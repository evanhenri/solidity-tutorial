const { expectRevert, time } = require('@openzeppelin/test-helpers');
const DAO = artifacts.require('DAO');

contract('DAO', (accounts) => {
  let dao;

  const [admin, investor1, investor2, investor3] = [accounts[0], accounts[1], accounts[2], accounts[3]];

  beforeEach(async () => {
    dao = await DAO.new(2, 2, 50);
  });

  it('Should accept contribution', async () => {
    await dao.contribute({from: investor1, value: 100});
    await dao.contribute({from: investor2, value: 200});
    await dao.contribute({from: investor3, value: 300});

    const shares1 = await dao.shares(investor1);
    const shares2 = await dao.shares(investor2);
    const shares3 = await dao.shares(investor3);
    assert.equal(shares1.toNumber(), 100);
    assert.equal(shares2.toNumber(), 200);
    assert.equal(shares3.toNumber(), 300);

    const isInvestor1 = await dao.investors(investor1);
    const isInvestor2 = await dao.investors(investor2);
    const isInvestor3 = await dao.investors(investor3);
    assert.equal(isInvestor1, true);
    assert.equal(isInvestor2, true);
    assert.equal(isInvestor3, true);

    const totalShares = await dao.totalShares();
    const availableFunds = await dao.availableFunds();
    assert.equal(totalShares.toNumber(), 600);
    assert.equal(availableFunds.toNumber(), 600);
  });

  it('Should NOT accept contribution after contributionTime', async () => {
    await time.increase(2001);
    await expectRevert(
      dao.contribute({from: investor1, value: 100}),
      'funding period has ended'
    );
  });

  it('Should create proposal', async () => {
    await dao.contribute({from: investor1, value: 100});
    await dao.createProposal('proposal', 100, accounts[8], {from: investor1});
    const proposal = await dao.proposals(0);
    assert.equal(proposal.name, 'proposal');
    assert.equal(proposal.recipient, accounts[8]);
    assert.equal(proposal.amount.toNumber(), 100);
    assert.equal(proposal.votes.toNumber(), 0);
    assert.equal(proposal.executed, false);
  });

  it('Should NOT create proposal if not from investor', async () => {
    await expectRevert(
      dao.createProposal('proposal', 10, accounts[8], {from: accounts[5]}),
      'only investors'
    );
  });

  it('Should NOT create proposal if amount too big', async () => {
    await dao.contribute({from: investor1, value: 100});
    await expectRevert(
      dao.createProposal('proposal', 1000, accounts[8], {from: investor1}),
      'amount too big'
    );
  });

  it('Should vote', async () => {
    await dao.contribute({from: investor1, value: 100});
    await dao.createProposal('proposal', 100, accounts[8], {from: investor1});
    await dao.vote(0, {from: investor1});
  });

  it('Should NOT vote if not investor', async () => {
    await expectRevert(
      dao.vote(0, {from: accounts[8]}),
      'only investors'
    );
  });

  it('Should NOT vote if already voted', async () => {
    await dao.contribute({from: investor1, value: 100});
    await dao.createProposal('proposal', 100, accounts[8], {from: investor1});
    await dao.vote(0, {from: investor1});
    await expectRevert(
      dao.vote(0, {from: investor1}),
      'investor can only vote once'
    );
  });

  it('Should NOT vote if after proposal end date', async () => {
    await dao.contribute({from: investor1, value: 100});
    await dao.createProposal('proposal', 100, accounts[8], {from: investor1});
    await time.increase(2001);
    expectRevert(
      dao.vote(0, {from: investor1}),
      'can only vote until proposal end'
    );
  });

  it('Should execute proposal', async () => {
    await dao.contribute({from: investor1, value: 100});
    await dao.contribute({from: investor2, value: 200});
    await dao.contribute({from: investor3, value: 300});
    await dao.createProposal('proposal', 100, accounts[8], {from: investor1});
    await dao.vote(0, {from: investor1}); //100 shares
    await dao.vote(0, {from: investor3}); //300 shares
    await time.increase(2001);
    await dao.executeProposal(0);
  });

  it('Should NOT execute proposal if not enough votes', async () => {
    await dao.contribute({from: investor1, value: 100});
    await dao.contribute({from: investor2, value: 200});
    await dao.contribute({from: investor3, value: 300});
    await dao.createProposal('proposal', 100, accounts[8], {from: investor1});
    await dao.vote(0, {from: investor1}); //100 shares
    await time.increase(2001);
    await expectRevert(
      dao.executeProposal(0),
      'cannot execute a proposal with vote below quorum'
    );
  });

  it('Should NOT execute proposal twice', async () => {
    await dao.contribute({from: investor1, value: 1000});
    await dao.createProposal('proposal', 100, accounts[8], {from: investor1});
    await dao.vote(0, {from: investor1}); //100 shares
    await time.increase(2001);
    await dao.executeProposal(0);
    await expectRevert(
      dao.executeProposal(0),
      'cannot execute a proposal already executed'
    );
  });

  it('Should NOT execute proposal before end date', async () => {
    await dao.contribute({from: investor1, value: 100});
    await dao.contribute({from: investor2, value: 200});
    await dao.createProposal('proposal', 50, accounts[8], {from: investor1});
    await dao.vote(0, {from: investor1});
    await dao.vote(0, {from: investor2});
    expectRevert(
      dao.executeProposal(0),
      'cannot execute a proposal before end date'
    );
  });

  it('Should withdraw ether', async () => {
    await dao.contribute({from: investor1, value: 100});
    const balanceBefore = await web3.eth.getBalance(accounts[8]);
    const balanceBeforeBN = web3.utils.toBN(balanceBefore);
    await dao.withdrawEther(10, accounts[8]);
    const balanceAfter = await web3.eth.getBalance(accounts[8]);
    const balanceAfterBN = web3.utils.toBN(balanceAfter);
    assert.equal(balanceAfterBN.sub(balanceBeforeBN).toNumber(), 10);
  });

  it('Should NOT withdraw ether if not admin', async () => {
    await dao.contribute({from: investor1, value: 100});
    await expectRevert(
      dao.withdrawEther(10, accounts[8], {from: investor1}),
      'only admin'
    );
  });

  it('Should NOT withdraw ether if trying to withdraw too much', async () => {
    await expectRevert(
      dao.withdrawEther(1000, accounts[8]),
      'not enough available funds'
    );
  });
});
