// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract MultiSig {
    struct Transfer {
        uint id;
        uint amount;
        uint approvals;
        bool sent;
        address payable recipient;
    }

    // default value for bool is false
    mapping(address => bool) approvers;

    // the n requirement in 'n of m' signatures
    uint public n;

    // keeps track of the next id to use for Transfer objects
    uint nextId;

    // tracks pending/approved multisig transfers
    mapping(uint => Transfer) public transfers;

    // tracks what addresses have approved what transactions
    // {<address>: {<transfer.id>: <address-approved-this-transfer>}}
    mapping(address => mapping(uint => bool)) approvals;

    modifier onlyApprover() {
        require(approvers[msg.sender], 'only approvers are allowed to approve transactions');
        _;
    }

    constructor(address[] memory _approvers, uint _n) {
        for(uint i = 0; i < _approvers.length; i++) {
            approvers[_approvers[i]] = true;
        }
        n = _n;
    }

    function createTransfer(uint _amount, address payable _to) external payable onlyApprover() {
        transfers[nextId] = Transfer(nextId, _amount, 0, false, _to);
        nextId++;
    }

    function sendTransfer(uint _id) external onlyApprover() {
        require(!transfers[_id].sent, 'transfer has already been sent');

        // Make sure that the approver only approves each transaction once
        if(!approvals[msg.sender][_id]) {
            approvals[msg.sender][_id] = true;
            transfers[_id].approvals++;
        }

        if(transfers[_id].approvals >= n) {
            transfers[_id].sent = true;
            transfers[_id].recipient.transfer(transfers[_id].amount);
        }
    }
}

// left off at https://eattheblocks-pro.teachable.com/courses/588302/lectures/11394500
