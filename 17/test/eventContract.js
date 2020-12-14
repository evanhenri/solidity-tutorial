const { expectRevert, time } = require('@openzeppelin/test-helpers');
const EventContract = artifacts.require('EventContract.sol');

contract('EventContract', (accounts) => {
  const price = 5;
  let eventContract = null;

  before(async () => {
    eventContract = await EventContract.new();
  });

  it('Should NOT create an event if date if before now', async () => {
    const date = (await time.latest()).sub(time.duration.seconds(1));
    await expectRevert(
      eventContract.createEvent('event1', date, price, 10),
      'event can only be organized in the future'
    );
  });

  it('Should NOT create an event if less than 1 ticket', async () => {
    const date = (await time.latest()).add(time.duration.seconds(1000));
    await expectRevert(
      eventContract.createEvent('event1', date, price, 0),
      'can only create event with at least 1 ticket available'
    );
  });

  it('Should create an event', async () => {
    const date = (await time.latest()).add(time.duration.seconds(1000));
    await eventContract.createEvent('event1', date, price, 2);
    const event = await eventContract.events(0);
    assert.equal(event.id.toNumber(), 0);
    assert.equal(event.name, 'event1');
    assert.equal(event.date.toNumber(), date.toNumber());
  });

  it('Should NOT buy a ticket if event does not exist', async () => {
    await expectRevert(
      eventContract.buyTicket(1, 1),
      'this event does not exist'
    );
  });

  context('event created', () => {
    beforeEach(async () => {
      eventContract = await EventContract.new();
      const date = (await time.latest()).add(time.duration.seconds(1000));
      await eventContract.createEvent('event1', date, price, 2);
    });

    it('Should NOT buy a ticket if wrong amount of ether sent', async () => {
      await expectRevert(
        eventContract.buyTicket(0, 1),
        'not enough ether sent'
      );
    });

    it('Should NOT buy a ticket if not enough ticket left', async () => {
      await expectRevert(
        eventContract.buyTicket(0, 3, {value: price * 3}),
        'not enough tickets left'
      );
    });

    it('Should buy tickets', async () => {
      await eventContract.buyTicket(0, 1, {value: price, from: accounts[1]});
      await eventContract.buyTicket(0, 1, {value: price, from: accounts[2]});
      const ticketCount1 = await eventContract.tickets.call(accounts[1], 0);
      const ticketCount2 = await eventContract.tickets.call(accounts[2], 0);
      assert.equal(ticketCount1.toNumber(), 1);
      assert.equal(ticketCount2.toNumber(), 1);
    });

    it('Should NOT transfer ticket it not enough tickets', async () => {
      await expectRevert(
        eventContract.transferTicket(0, 3, accounts[5]),
        'not enough tickets'
      );
    });

    it('Should transfer ticket', async () => {
      await eventContract.buyTicket(0, 1, {value: price, from: accounts[1]});
      await eventContract.transferTicket(0, 1, accounts[5], {from: accounts[1]});
      const ticketCount1 = await eventContract.tickets.call(accounts[1], 0);
      const ticketCount5 = await eventContract.tickets.call(accounts[5], 0);
      assert.equal(ticketCount1.toNumber(), 0);
      assert.equal(ticketCount5.toNumber(), 1);
    });

    it('Should NOT buy a ticket if event has expired', async () => {
      time.increase(1001);
      await expectRevert(
        eventContract.buyTicket(0, 1),
        'this event is not active anymore'
      );
    });
  });
});
