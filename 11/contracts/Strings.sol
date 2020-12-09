// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract Strings {
    function concatenate(string memory _s1, string memory _s2) public pure returns(string memory) {
        // this differs from the approach used in the eat the blocks tutorial
        // found from https://ethereum.stackexchange.com/questions/729/how-to-concatenate-strings-in-solidity
        return string(abi.encodePacked(_s1, _s2));
    }

    function length(string memory _s) public pure returns(uint) {
        // This does not work because the string type does not have a length property.
        // We need to cast it to a bytes type because then it _will_ have a length property.
        // return _s.length;
        bytes memory s_bytes = bytes(_s);
        return s_bytes.length;
    }
}
