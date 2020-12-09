// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract DeedMultiPayout {
    address payable public beneficiary;
    uint public earliest;  // unix timestamp
    uint public amountPerPayout; // the amount of WEI to be paid in each payout
    uint constant public PAYOUTS = 4; // how many payouts will occur
    uint constant public INTERVAL = 1; // seconds between each payout
    uint public paidPayouts; // keeps track of how many payouts have occurred so far

    constructor(address payable _beneficiary, uint _fromNow) public payable {
        beneficiary = _beneficiary;
        earliest = block.timestamp + _fromNow;
        amountPerPayout = msg.value / PAYOUTS;
    }

    function withdraw() public {
        require(msg.sender == beneficiary, 'only the beneficiary can initiate the withdrawal');
        require(block.timestamp  >= earliest, 'you cannot withdraw this early');
        require(paidPayouts < PAYOUTS, 'no payouts left');

        // if we allow the beneficiary to withdraw after 1 second, but 3
        // seconds has elapsed, allow them to withdraw 3 payouts.
        uint eligiblePayouts = (block.timestamp - earliest) / INTERVAL;

        // we need this to prevent the beneficiary from calling `withdraw`
        // multiple times in quick succession.
        uint duePayouts = eligiblePayouts - paidPayouts;

        duePayouts = duePayouts + paidPayouts > PAYOUTS ? PAYOUTS - paidPayouts : duePayouts;
        paidPayouts += duePayouts;

        beneficiary.transfer(duePayouts * amountPerPayout);
    }
}

// left off at https://eattheblocks-pro.teachable.com/courses/588302/lectures/12012034 @ 3:16
