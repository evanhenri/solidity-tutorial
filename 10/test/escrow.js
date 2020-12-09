const Escrow = artifacts.require('Escrow');

const assertError = async (promise, error) => {
    try {
        await promise;
    } catch(e) {
        assert(e.message.includes(error))
        return;
    }
    assert(false);
}

contract('Escrow', (accounts) => {
    let escrow = null;
    const [thirdParty, payer, recipient] = accounts;

    before(async () => {
        escrow = await Escrow.deployed();
    })

    it('should deposit', async () => {
        await escrow.deposit({from: payer, value: 900});
        const escrowBalance = web3.utils.toBN(await web3.eth.getBalance(escrow.address));
        assert(escrowBalance.toNumber() === 900);
    });

    it('should NOT deposit if transfer exceed total escrow amount', async () => {
        assertError(
            escrow.deposit({from: payer, value: 1000}),
            'contract balance cannot exceed specified amount'
        );
    });

    it('should NOT deposit if not sending from payer', async () => {
        assertError(
            escrow.deposit({from: accounts[5]}),
            'sender must be the payer'
        );
    });

    it('should NOT release if full amount not received', async () => {
        assertError(
            escrow.release({from: thirdParty}),
            'escrow contract is not fully funded'
        );
    });

    it('should NOT release if not lawyer', async () => {
        await escrow.deposit({from: payer, value: 100}); //We are missing 100 wei
        assertError(
            escrow.release({from: payer}),
            'only the specified third party can release funds'
        );
    });

    it('should release', async () => {
        const initialRecipientBalance = web3.utils.toBN(await web3.eth.getBalance(recipient));
        await escrow.release({from: thirdParty});
        const finalRecipientBalance = web3.utils.toBN(await web3.eth.getBalance(recipient));
        assert(finalRecipientBalance.sub(initialRecipientBalance).toNumber() === 1000);
    });

})
