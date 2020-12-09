// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract AdvancedStorage {
    uint[] public ids;

    function add(uint _id) public {
        ids.push(_id);
    }

    function get(uint _index) view public returns(uint) {
        return ids[_index];
    }

    // memory is required for the return type because uint[] is a complex
    // type compared to the `get` function which simply returns a uint.
    function getAll() view public returns(uint[] memory) {
        return ids;
    }

    function length() view public returns(uint) {
        return ids.length;
    }
}
