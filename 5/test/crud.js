const Crud = artifacts.require('Crud');

contract('Crud', () => {
    let crud = null;

    before(async () => {
        crud = await Crud.deployed();
    })

    it('Should create a new user', async () => {
        await crud.create('Frank');
        const user = await crud.read(1)
        const id = user['0'].toNumber();
        const name = user['1'];
        assert(id === 1);
        assert(name === 'Frank');
    });

    it('Should update an existing user', async () => {
        await crud.update(1, 'Franklin');
        const user = await crud.read(1)
        const id = user['0'].toNumber();
        const name = user['1'];
        assert(id === 1);
        assert(name === 'Franklin');
    });

    it('Should throw an error when updating a nonexistent user', async () => {
        try {
            await crud.update(99, 'name')
        } catch (e) {
            assert(e.message.includes('User does not exist'))
            return;
        }
        // This assertion will only fail if the try/catch block above does NOT throw
        // an exception like we want it to.
        assert(false);
    });

    it('Should destroy a user', async () => {
        await crud.destroy(1);

        try {
            await crud.read(1)
        } catch (e) {
            assert(e.message.includes('User does not exist'))
            return;
        }
        // This assertion will only fail if the try/catch block above does NOT throw
        // an exception like we want it to.
        assert(false);
    });

    it('Should not destroy a nonexistent user', async () => {
        try {
            await crud.destroy(99)
        } catch (e) {
            assert(e.message.includes('User does not exist'))
            return;
        }
        // This assertion will only fail if the try/catch block above does NOT throw
        // an exception like we want it to.
        assert(false);
    });
})
