// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract Escrow {
    address public thirdParty;
    address public payer;
    address payable public recipient;
    uint public amount;

    constructor(address _payer, address payable _recipient, uint _amount) {
        thirdParty = msg.sender;
        payer = _payer;
        recipient = _recipient;
        amount = _amount;
    }

    function deposit() public payable {
        require(msg.sender == payer, 'sender must be the payer');

        // `address(this).balance` is already updated to reflect the incoming amount
        // when we reach this point in the execution
        require(address(this).balance <= amount, 'contract balance cannot exceed specified amount');
    }

    function release() public {
        require(address(this).balance == amount, 'escrow contract is not fully funded');
        require(msg.sender == thirdParty, 'only the specified third party can release funds');
        recipient.transfer(amount);
    }

    function balanceOf() public view returns(uint) {
        return address(this).balance;
    }
}

