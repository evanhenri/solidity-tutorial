// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import {SafeMath} from "@openzeppelin/contracts/math/SafeMath.sol";

contract Lottery {
    using SafeMath for uint;

    enum State {
        IDLE,
        BETTING
    }
    State public currentState = State.IDLE;
    address public admin;
    address payable[] public players;
    uint public requiredPlayers;
    uint public requiredBetSize;
    uint public houseFee;

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin");
        _;
    }

    modifier requireState(State _requiredState) {
        require(currentState == _requiredState, "current state does not allow this");
        _;
    }

    constructor(uint _houseFee) {
        require(_houseFee > 1 && _houseFee < 99, "fee should be from 1-99");
        houseFee = _houseFee;
        admin = msg.sender;
    }

    function cancel() external requireState(State.BETTING) onlyAdmin() {
        // refund all players who have sent ETH to for the current lottery
        for (uint i = 0; i < players.length; i++) {
            (bool success, ) = players[i].call{value: requiredBetSize}("");
            require(success, "transfer failed");
        }
        delete players;
        currentState = State.IDLE;
    }

    function create(
        uint _requiredPlayers,
        uint _requiredBetSize
    )
        external
        payable
        onlyAdmin()
        requireState(State.IDLE)
    {
        requiredPlayers = _requiredPlayers;
        requiredBetSize = _requiredBetSize;
        currentState = State.BETTING;
    }

    function placeBet() external payable requireState(State.BETTING) {
        require(msg.value == requiredBetSize, "can only bet exactly the required bet size");
        players.push(msg.sender);
        if (players.length == requiredPlayers) {
            currentState = State.IDLE;

            // calculate the winners payout minus the house fee
            uint payoutBeforeFee = requiredBetSize.mul(players.length);
            uint fee = houseFee.mul(100).div(payoutBeforeFee);
            uint payout = payoutBeforeFee.sub(fee);

            uint winnerIdx = _randomModulo(requiredPlayers);
            address payable winner = players[winnerIdx];

            // cleanup the players array so it's empty and can be reused
            delete players;

            // send the winner the payout
            (bool success, ) = winner.call{value: payout}("");
            require(success, "transfer failed");
        }
    }

    function _randomModulo(uint _modulo) internal view returns(uint) {
        // For demonstration purposes only as this does not generate a truly random number
        return uint(
            keccak256( // takes single bytes argument
                abi.encodePacked(block.timestamp, block.difficulty) // returns bytes
            )
        ).mod(_modulo);
    }
}
