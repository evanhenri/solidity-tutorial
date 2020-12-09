const Deed = artifacts.require('Deed');

contract('Deed', (accounts) => {
    let deed = null;
    const lawyerAddr = accounts[0];
    const beneficiaryAddr = accounts[1];

    before(async () => {
        deed = await Deed.deployed();
    })

    it('Should withdraw', async () => {
        const b1 = await web3.eth.getBalance(beneficiaryAddr)
        const initialBalance = web3.utils.toBN(b1)

        // Resolve this promise after waiting 5 seconds so that we
        // don't call `deed.withdraw` too early.
        await new Promise(resolve => setTimeout(resolve, 5000))
        await deed.withdraw({from: lawyerAddr});
        const b2 = await web3.eth.getBalance(beneficiaryAddr)
        const finalBalance = web3.utils.toBN(b2)

        assert(finalBalance.sub(initialBalance).toNumber() === 100)
    });

    it('Should not withdraw if too early', async () => {
        // We need to deploy a new version of the contract for use in this test
        // because the withdrawal timer was already hit in the prior test (we
        // already waited 5 seconds). If we rely on the same contract variable,
        // it will allow us to withdraw even though we want to test the timer
        // functionality.
        const deed = await Deed.new(lawyerAddr, beneficiaryAddr, 5, {value: 100});

        try {
            await deed.withdraw({from: lawyerAddr});
        } catch (e) {
            assert(e.message.includes('you cannot withdraw this early'))
            return
        }
        assert(false)
    });

    it('Should not withdraw if caller is not lawyer', async () => {
        // Resolve this promise after waiting 5 seconds so that we
        // don't call `deed.withdraw` too early.
        await new Promise(resolve => setTimeout(resolve, 5000))

        try {
            await deed.withdraw({from: beneficiaryAddr});
        } catch (e) {
            assert(e.message.includes('only the lawyer can initiate the withdrawal'))
            return
        }
        assert(false)
    });
})
