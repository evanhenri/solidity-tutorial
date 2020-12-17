// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fomo3d {
    enum State {
        INACTIVE,
        ACTIVE
    }

    State public currentState = State.INACTIVE;
    address payable public king;
    uint public startDate;

    // When the current round will end. If someone invests before the round ends,
    // the endDate is pushed back again.
    uint public endDate;

    // When the 'game' ends.
    uint public hardEndDate;

    // Game ends if there are no bets placed and 30 seconds have elapsed since the
    // prior bet was made or if the hard end date is hit.
    uint public roundDuration = 30;

    // Keys will cost 0.01 more ether with every round that passes
    uint public keyPremium = 0.01 ether;

    // When winnings are distributed, 2% is withheld as a fee for organizing the game
    uint public houseFee = 2;

    uint public pot;
    uint public initialKeyPrice;
    uint public totalKeysSold;
    address payable[] public keyHolders;
    mapping(address => uint) public keyCounts;

    modifier requireState(State _state) {
        require(currentState == _state, "not possible in current state");
        _;
    }

    function bet() external payable requireState(State.ACTIVE) {
        if (block.timestamp > endDate || block.timestamp > hardEndDate) {
            _distributePot();
            _createRound();

            // refund the user what they just sent
            (bool success, ) = msg.sender.call{value: msg.value}("");
            require(success, "transfer failed");
        } else {
            uint keyCount = msg.value / getKeyPrice();
            keyCounts[msg.sender] += keyCount;
            totalKeysSold += keyCount;
            pot += msg.value;

            // do not allow the end date of the round to exceed the hard end date
            if (endDate + roundDuration > hardEndDate) {
                endDate = hardEndDate;
            } else {
                endDate += roundDuration;
            }

            bool isKeyHolder = false;
            for (uint i = 0; i < keyHolders.length; i++) {
                if (keyHolders[i] == msg.sender) {
                    isKeyHolder = true;
                    break;
                }
            }
            if (!isKeyHolder) {
                keyHolders.push(msg.sender);
            }
        }
    }

    function getKeyPrice() view public returns (uint) {
        uint periodCount = (block.timestamp - startDate) / roundDuration;
        return (initialKeyPrice + periodCount) * keyPremium;
    }

    function start() external requireState(State.INACTIVE) {
        currentState = State.ACTIVE;
        _createRound();
    }

    function _cleanupPriorRound() internal {
        for (uint i = 0; i < keyHolders.length; i++) {
            delete keyCounts[keyHolders[i]];
        }
        delete keyHolders;
        totalKeysSold = 0;
    }

    function _createRound() internal {
        _cleanupPriorRound();
        startDate = block.timestamp;
        endDate = startDate + roundDuration;
        hardEndDate = startDate + 86400; // game ends after it's been live for 1 day
        initialKeyPrice = 1 ether;
    }

    function _distributePot() internal {
        uint netPot = ((100 - houseFee) * pot) / 100;
        uint halfNetPot = netPot / 2;

        // send the king half of the netPot
        (bool success, ) = king.call{value: halfNetPot}("");
        require(success, "transfer failed");

        for (uint i = 0; i < keyHolders.length; i++) {
            address payable keyHolder = keyHolders[i];

            if (keyHolder != king) {
                uint participantPayout = (halfNetPot * keyCounts[keyHolder]) / totalKeysSold;
                (bool success, ) = keyHolder.call{value: participantPayout}("");
                require(success, "transfer failed");
            }
        }
    }
}
