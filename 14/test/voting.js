const { expectRevert, time } = require('@openzeppelin/test-helpers');
const Voting = artifacts.require('Voting');

contract('Voting', (accounts) => {
  let voting = null;
  const admin = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  const voter3 = accounts[3];
  const nonVoter = accounts[4];
  const choices = [
      web3.utils.asciiToHex('Choice 1'),
      web3.utils.asciiToHex('Choice 2'),
      web3.utils.asciiToHex('Choice 3')
  ];

  before(async () => {
    voting = await Voting.deployed();
  });

  it('should add voters', async () => {
    await voting.addVoters([voter1, voter2, voter3]);
    const results = await Promise.all(
      [voter1, voter2, voter3].map(voter =>
        voting.voters(voter)
      )
    );
    results.forEach(result => assert.equal(result, true));
  });

  it('should create a new ballot', async () => {
    const name = web3.utils.asciiToHex('Ballot 1');
    await voting.createBallot(name, choices, 5, {from: admin});
    const ballot = await voting.ballots(0);
    assert.equal(
        web3.utils.hexToUtf8(ballot.name),
        web3.utils.hexToUtf8(name)
    );
    assert.equal(
        ballot.id.toNumber(),
        0
    )
    console.log(ballot)
    assert.ok(ballot.end)
  });

  it('should NOT create a new ballot if not admin', async () => {
    const name = web3.utils.asciiToHex('Ballot 2');
    await expectRevert(
      voting.createBallot(name, choices, 5, {from: voter1}),
      'only admin'
    );
  });

  it('should NOT vote if not a voter', async () => {
    const name = web3.utils.asciiToHex('Ballot 3');
    await voting.createBallot(name, choices, 5, {from: admin});
    await expectRevert(
      voting.vote(1, 0, {from: nonVoter}),
      'only voters'
    );
  });

  it('should NOT vote after ballot end', async () => {
    const name = web3.utils.asciiToHex('Ballot 4');
    await voting.createBallot(name, choices, 5, {from: admin});
    await time.increase(5001);
    await expectRevert(
      voting.vote(2, 0, {from: voter1}),
      'voting period has ended'
    );
  });

  it('should vote', async () => {
    const name = web3.utils.asciiToHex('Ballot 5');
    await voting.createBallot(name, choices, 5, {from: admin});
    await voting.vote(3, 0, {from: voter1});
    await voting.vote(3, 0, {from: voter2});
    await voting.vote(3, 1, {from: voter3});
    await time.increase(5001);
    const results = await voting.results(3);
    assert.equal(results[0].votes, '2');
    assert.equal(results[1].votes, '1');
    assert.equal(results[2].votes, '0');
  });
});
