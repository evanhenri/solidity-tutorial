// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract Deed {
    address public lawyer;
    address payable public beneficiary;
    uint public earliest;  // unix timestamp

    constructor(address _lawyer, address payable _beneficiary, uint _fromNow) public payable {
        lawyer = _lawyer;
        beneficiary = _beneficiary;
        // `block.timestamp` is a built-in that is the same as python's time.time()
        earliest = block.timestamp + _fromNow;
    }

    function withdraw() public {
        require(msg.sender == lawyer, 'only the lawyer can initiate the withdrawal');
        require(block.timestamp  >= earliest, 'you cannot withdraw this early');

        // send all ETH that has been sent to this contract to the beneficiary
        beneficiary.transfer(address(this).balance);
    }
}
