// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import {SafeMath} from "@openzeppelin/contracts/math/SafeMath.sol";

contract StateMachine {
    using SafeMath for uint;

    enum State {
        PENDING,
        ACTIVE,
        CLOSED
    }

    State public state = State.PENDING;
    uint public amount;
    uint public interest;
    uint public end;
    address payable public borrower;
    address payable public lender;

    constructor(
        uint _amount,
        uint _interest,
        uint _duration,
        address payable _borrower,
        address payable _lender
    )
        public
    {
        amount = _amount;
        interest = _interest;
        end = block.timestamp.add(_duration);
        borrower = _borrower;
        lender = _lender;
    }

    function fund() external payable {
        require(msg.sender == lender, "only lender can lend");
        require(address(this).balance == amount, "can only lend the exact amount");
        _transitionTo(State.ACTIVE);
        (bool success, ) = borrower.call{value: amount}("");
        require(success, "transfer failed");
    }

    function reimburse() external payable {
        require(msg.sender == borrower, "only borrower can reimburse");
        require(msg.value == amount.add(interest), "borrower need to reimburse exact amount plus interest");
        _transitionTo(State.CLOSED);
        (bool success, ) = lender.call{value: amount.add(interest)}("");
        require(success, "transfer failed");
    }

    function _transitionTo(State _to) internal {
        require(_to != State.PENDING, "cannot go back to PENDING state");
        require(_to != state, "cannot transition to current state");
        if (state == State.PENDING) {
            require(_to == State.ACTIVE, "can only transition to active from pending state");
        } else if (state == State.ACTIVE) {
            require(_to == State.CLOSED, "can only transition to closed from active state");
            require(block.timestamp >= end, "loan hasnt matured yet");
        } else {
            require(false, "invalid transition state");
        }
        state = _to;
    }
}
