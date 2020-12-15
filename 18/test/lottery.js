const { expectRevert } = require('@openzeppelin/test-helpers');
const Lottery = artifacts.require('Lottery');

const balances = async addresses => {
  const balanceResults = await Promise.all(
      addresses.map(address => web3.eth.getBalance(address))
  );
  return balanceResults.map(balance => web3.utils.toBN(balance));
};

contract('Lottery', (accounts) => {
  let lottery;

  beforeEach(async () => {
    lottery = await Lottery.new(2);
  });

  it('Should NOT create lottery if not admin', async () => {
    await expectRevert(
      lottery.create(5, 5, {from: accounts[1]}),
      'only admin'
    );
  });

  it('Should NOT create bet if state not idle', async () => {
    await lottery.create(5, 5)
    await expectRevert(
      lottery.create(5, 5),
      'current state does not allow this'
    );
  });

  it('Should create a bet', async () => {
    await lottery.create(10, 20);
    const requiredPlayers = await lottery.requiredPlayers();
    const requiredBetSize = await lottery.requiredBetSize();
    const currentState = await lottery.currentState();
    assert.equal(requiredPlayers.toNumber(), 10);
    assert.equal(requiredBetSize.toNumber(), 20);
    assert.equal(currentState.toNumber(), 1);
  });

  it('Should NOT bet if not in state BETTING', async () => {
    await expectRevert(
      lottery.placeBet({value: 100, from: accounts[1]}),
      'current state does not allow this'
    );
  });

  it('Should NOT bet if not sending exact bet amount', async () => {
    await lottery.create(3, 20);
    await expectRevert(
      lottery.placeBet({value: 100, from: accounts[1]}),
      'can only bet exactly the required bet size'
    );
    await expectRevert(
      lottery.placeBet({value: 15, from: accounts[2]}),
      'can only bet exactly the required bet size'
    );
  });

  // it('Should bet', async () => {
  //   const players = [accounts[1], accounts[2], accounts[3]];
  //   const requiredBetSize = web3.utils.toWei('1', 'ether');
  //   await lottery.create(3, requiredBetSize);
  //
  //   const balancesBefore = await balances(players);
  //   const txs = await Promise.all(
  //       players.map(
  //           player => lottery.placeBet({
  //             value: requiredBetSize,
  //             from: player,
  //             gasPrice: 1
  //           })
  //       )
  //   )
  //   const balancesAfter = await balances(players);
  //
  //   const result = players.some((_player, i) => {
  //     const gasUsed = web3.utils.toBN(txs[i].receipt.gasUsed);
  //     const expected = web3.utils.toBN(web3.utils.toWei('1.94', 'ether'));
  //     return balancesAfter[i].sub(balancesBefore[i]).add(gasUsed).eq(expected);
  //   });
  //   assert.equal(result, true);
  // });

  it('Should NOT cancel if not betting', async () => {
    await expectRevert(
      lottery.cancel({from: accounts[1]}),
      'current state does not allow this'
    );
  });

  it('Should NOT cancel if not admin', async () => {
    await lottery.create(3, 100);
    await expectRevert(
      lottery.cancel({from: accounts[1]}),
      'only admin'
    );
  });

  it('Should cancel', async () => {
    await lottery.create(3, 100);
    await lottery.cancel();
    const state = await lottery.currentState();
    assert.equal(state.toNumber(), 0);
  });
});
