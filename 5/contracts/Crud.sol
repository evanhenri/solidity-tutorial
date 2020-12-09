// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract Crud {
    struct User {
        uint id;
        string name;
    }

    User[] public users;

    // Initialize variable starting at 1 because if a user is created with id == 0
    // and then the user is deleted, users[0].id will still equal 0 because 0 is
    // the default value for the uint type. For example `users[999].id` is also 0
    // even though no user at that index exists.
    uint public nextId = 1;

    function create(string memory _name) public {
        users.push(User(nextId, _name));
        nextId++;
    }

    // string is a complex type so we need to specify the `memory` location
    function read(uint _id) view public returns(uint, string memory) {
        uint i = find(_id);
        return(users[i].id, users[i].name);
    }

    function update(uint _id, string memory _name) public {
        uint i = find(_id);
        users[i].name = _name;
    }

    function destroy(uint _id) public {
        uint i = find(_id);
        delete users[i];
    }

    function find(uint _id) view internal returns(uint) {
        for (uint i = 0; i < users.length; i++) {
            if(users[i].id == _id) {
                return i;
            }
        }
        revert('User does not exist');
    }
}
