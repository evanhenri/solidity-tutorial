// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

// Need this to accept an array of strings as a function argument.
// Also need this to be able to return an array of structs from a function.
pragma experimental ABIEncoderV2;

contract Voting {
    mapping(address => bool) public voters;
    // for each voter, track if they have already voted for the given ballot id
    mapping(address => mapping(uint => bool)) votes;
    mapping(uint => Ballot) public ballots;
    struct Choice {
        uint id;
        uint votes;
        string name;
    }
    struct Ballot {
        uint id;
        uint end;
        string name;
        Choice[] choices;
    }
    uint nextBallotId;
    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin");
        _;
    }

    constructor() public {
        admin = msg.sender;
    }

    function addVoters(address[] calldata _voters) external onlyAdmin() {
        for (uint i =0; i < _voters.length; i++) {
            voters[_voters[i]] = true;
        }
    }

    function createBallot(
        string memory _name,
        string[] memory _ballotChoices,
        uint _offset
    )
        public
        onlyAdmin()
    {
        // We can access empty Ballot instances that do not exist yet.
        // The values for these instances will be the default values for the defined
        // type (bool => false, uint => 0, etc) and just replace those default values
        // with the ones that we actually want.
        ballots[nextBallotId].id = nextBallotId;
        ballots[nextBallotId].end = block.timestamp + _offset;
        ballots[nextBallotId].name = _name;
        for (uint i = 0; i < _ballotChoices.length; i++) {
            ballots[nextBallotId].choices.push(
                Choice(i, 0, _ballotChoices[i])
            );
        }
        nextBallotId++;
    }

    function results(uint _ballotId) view external returns (Choice[] memory) {
        require(block.timestamp >= ballots[_ballotId].end, "voting has not ended");
        return ballots[_ballotId].choices;
    }

    function vote(uint _ballotId, uint _choiceId) external {
        // If msg.sender's address is not in `voters`, the address will be mapped to the default
        // value for bool which is `false`
        require(voters[msg.sender], "only voters");

        // Check if the voter has already voted for the specified ballot
        require(!votes[msg.sender][_ballotId], "voter can only vote once for a ballot");

        // Check if the ballot that they are attempting to vote on has already ended.
        require(block.timestamp < ballots[_ballotId].end, "voting period has ended");

        // Mark the user as having voted on the ballot so they cannot vote on the same ballot again.
        votes[msg.sender][_ballotId] = true;

        // Apply the user's vote
        ballots[_ballotId].choices[_choiceId].votes++;
    }
}
