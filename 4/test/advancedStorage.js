const AdvancedStorage = artifacts.require('AdvancedStorage');

contract('AdvancedStorage', () => {
    let advancedStorage = null;

    before(async () => {
        advancedStorage = await AdvancedStorage.deployed();
    })

    it('Should add an element to ids array', async () => {
        await advancedStorage.add(10);
        const result = await advancedStorage.ids(0);
        assert(result.toNumber() === 10);
    });

    it('Should get an element of the ids array', async () => {
        await advancedStorage.add(20);
        const result = await advancedStorage.get(1);
        assert(result.toNumber() === 20);
    });

    it('Should get the ids array', async () => {
        const rawId = await advancedStorage.getAll();
        const ids = rawId.map(id => id.toNumber());

        // Can't use `===` here because that would be checking if the 2 arrays
        // are the exact same objects. We don't care if the arrays themselves
        // are the same object, we want to compare the values in each array.
        assert.deepEqual(ids, [10, 20]);
    });

    it('Should get the length of the ids array', async () => {
        const length = await advancedStorage.length();
        assert(length.toNumber() === 2);
    });
})
