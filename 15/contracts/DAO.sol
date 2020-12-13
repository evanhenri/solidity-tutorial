// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import {SafeMath} from "@openzeppelin/contracts/math/SafeMath.sol";

contract DAO {
    using SafeMath for uint;

    struct Proposal {
        uint id;
        uint amount;
        uint votes;
        uint end;
        string name;
        address payable recipient;
        bool executed;
    }

    mapping(address => bool) public investors;
    mapping(address => uint) public shares;
    mapping(address => mapping(uint => bool)) public votes;
    mapping(uint => Proposal) public proposals;
    uint public totalShares; // 1 contributed WEI == 1 share
    uint public availableFunds;
    uint public contributionEnd;
    uint public nextProposalId;
    uint public voteTime;
    uint public quorum;
    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin");
        _;
    }

    modifier onlyInvestors() {
        require(investors[msg.sender], "only investors");
        _;
    }

    constructor(
        uint _contributionTime,
        uint _voteTime,
        uint _quorum
    )
        public
    {
        require(_quorum > 0 && _quorum < 100, "quorum must be between 0 and 100");
        contributionEnd = block.timestamp.add(_contributionTime);
        voteTime = _voteTime;
        quorum = _quorum;
        admin = msg.sender;
    }

    fallback() external payable {
        availableFunds = availableFunds.add(msg.value);
    }

    function contribute() external payable {
        require(block.timestamp < contributionEnd, "funding period has ended");
        investors[msg.sender] = true;
        shares[msg.sender] = shares[msg.sender].add(msg.value);
        totalShares = totalShares.add(msg.value);
        availableFunds = availableFunds.add(msg.value);
    }

    function createProposal(
        string memory _name,
        uint _amount,
        address payable _recipient
    )
        external
        onlyInvestors()
    {
        require(availableFunds >= _amount, "amount too big");
        proposals[nextProposalId] = Proposal(
            nextProposalId,
            _amount,
            0,
            block.timestamp.add(voteTime),
            _name,
            _recipient,
            false
        );
        availableFunds = availableFunds.sub(_amount);
        nextProposalId = nextProposalId.add(1);
    }

    function executeProposal(uint _proposalId) external onlyAdmin() {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.end <= block.timestamp, "cannot execute a proposal before end date");
        require(!proposal.executed, "cannot execute a proposal already executed");
        require(proposal.votes.mul(100).div(totalShares) >= quorum, "cannot execute a proposal with vote below quorum");
        proposal.executed = true;
        _transferEther(proposal.amount, proposal.recipient);
    }

    function redeemShare(uint _amount) external {
        require(shares[msg.sender] >= _amount, "not enough shares");
        require(availableFunds >= _amount, "not enough available funds");
        shares[msg.sender] = shares[msg.sender].sub(_amount);
        availableFunds = availableFunds.sub(_amount);
        (bool success, ) = msg.sender.call{value: _amount}("");
        require(success, "transfer failed");
    }

    function transferShare(uint _amount, address _to) external {
        require(shares[msg.sender] >= _amount, "not enough shares");
        shares[msg.sender] = shares[msg.sender].sub(_amount);
        shares[_to] = shares[_to].add(_amount);
        investors[_to] = true;
    }

    function vote(uint _proposalId) external onlyInvestors() {
        Proposal storage proposal = proposals[_proposalId];
        require(!votes[msg.sender][_proposalId], "investor can only vote once");
        require(block.timestamp < proposal.end, "can only vote until proposal end");
        votes[msg.sender][_proposalId] = true;
        proposal.votes = proposal.votes.add(shares[msg.sender]);
    }

    function withdrawEther(uint _amount, address payable _to) external onlyAdmin() {
        _transferEther(_amount, _to);
    }

    function _transferEther(uint _amount, address payable _to) internal {
        require(_amount <= availableFunds, "not enough available funds");
        availableFunds = availableFunds.sub(_amount);
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "transfer failed");
    }
}
