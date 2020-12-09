const SplitPayment = artifacts.require('SplitPayment');

contract('SplitPayment', (accounts) => {
    let splitPayment = null;

    before(async () => {
        splitPayment = await SplitPayment.deployed();
    })

    it('Should split payment', async () => {
        const recipients = [accounts[1], accounts[2], accounts[3]];
        const amounts = [40, 20, 30];

        const initialBalances = await Promise.all(recipients.map(rcpt => {
            return web3.eth.getBalance(rcpt)
        }));

        // sum amounts array because that's how much is needed to split payments
        // across the 3 recipients.
        await splitPayment.send(recipients, amounts, {
            from: accounts[0],
            value: amounts.reduce((a, b) => {return a + b})
        });

        const finalBalances = await Promise.all(recipients.map(rcpt => {
            return web3.eth.getBalance(rcpt)
        }));

        recipients.forEach((_address, _index) => {
            const initialBalance = web3.utils.toBN(initialBalances[_index]);
            const finalBalance = web3.utils.toBN(finalBalances[_index]);
            assert(finalBalance.sub(initialBalance).toNumber() === amounts[_index]);
        })
    });

    it('Should not split payment if array length mismatch', async () => {
        const recipients = [accounts[1], accounts[2], accounts[3]];
        const amounts = [40, 20];

        try {
            await splitPayment.send(recipients, amounts, {
                from: accounts[0],
                value: amounts.reduce((a, b) => {return a + b})
            });
        } catch (e) {
            assert(e.message.includes('_to and _amount arrays must have the same length'))
            return
        }
        assert(false)
    });

    it('Should not split payment if caller is not owner', async () => {
        const recipients = [accounts[1], accounts[2], accounts[3]];
        const amounts = [40, 20, 30];

        try {
            await splitPayment.send(recipients, amounts, {
                from: accounts[5],
                value: amounts.reduce((a, b) => {return a + b})
            });
        } catch (e) {
            assert(e.message.includes('only owner can send transfers'))
            return
        }
        assert(false)
    });
})
