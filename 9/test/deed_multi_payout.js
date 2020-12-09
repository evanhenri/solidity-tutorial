const DeedMultiPayout = artifacts.require('DeedMultiPayout');

contract('DeedMultiPayout', (accounts) => {
    let deedMultiPayout = null;
    const beneficiaryAddress = accounts[1];

    before(async () => {
        deedMultiPayout = await DeedMultiPayout.deployed();
    })

    it('should withdraw for all payouts (1)', async () => {
        for(let i = 0; i < 4; i++) {
            const b1 = await web3.eth.getBalance(beneficiaryAddress);
            const initialBalance = web3.utils.toBN(b1);

            await new Promise(resolve => setTimeout(resolve, 1000));

            await deedMultiPayout.withdraw({from: beneficiaryAddress});

            const b2 = await web3.eth.getBalance(beneficiaryAddress);
            const finalBalance = web3.utils.toBN(b2);

            console.log('initial', b1, 'final', b2);
            // console.log(finalBalance.sub(initialBalance).toNumber());

            // assert(finalBalance.sub(initialBalance).toNumber() === 25); // 100 WEI / 4 === 25
        }
    });



})
