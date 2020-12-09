const EtherWallet = artifacts.require('EtherWallet');

contract('Crud', (accounts) => {
    let etherWallet = null;

    before(async () => {
        etherWallet = await EtherWallet.deployed();
    })

    it('Should set accounts[0] as owner', async () => {
        const owner = await etherWallet.owner();
        assert(owner === accounts[0]);
    });

    it('Should deposit ETH to etherWallet', async () => {
        await etherWallet.deposit({from: accounts[0], value: 100})
        const balance = await web3.eth.getBalance(etherWallet.address);
        // `web3.eth.getBalance` returns the balance as a string so we
        // need to convert it to an integer
        assert(web3.utils.toBN(balance).toNumber() === 100);
    });

    it('Should should return the balance of the contract', async () => {
        const balance = await etherWallet.balanceOf();
        assert(balance.toNumber() === 100);
    });

    it('Should should transfer ETH to another address', async () => {
        const recipientBalanceBefore = await web3.eth.getBalance(accounts[1]);
        const initialBalance = web3.utils.toBN(recipientBalanceBefore);

        // transfer 50 wei from account0 to account1
        await etherWallet.send(accounts[1], 50, {from: accounts[0]});
        const balance = await web3.eth.getBalance(etherWallet.address);
        assert(web3.utils.toBN(balance).toNumber() === 50);

        // account1 should now have a balance of 50
        const recipientBalanceAfter = await web3.eth.getBalance(accounts[1]);
        const finalBalance = web3.utils.toBN(recipientBalanceAfter);
        assert(finalBalance.sub(initialBalance).toNumber() === 50);
    });

    it('Should should not transfer ETH if sent from non-owner', async () => {
        try {
            await etherWallet.send(accounts[1], 50, {from: accounts[2]});
        }
        catch (e) {
            assert(e.message.includes('sender is not allowed'))
            return
        }
        assert(false)
    });
})
