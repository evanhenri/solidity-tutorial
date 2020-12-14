// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import {SafeMath} from "@openzeppelin/contracts/math/SafeMath.sol";

contract EventContract {
    using SafeMath for uint;

    struct Event {
        address admin;
        string name;
        uint id;
        uint date;
        uint price;
        uint ticketCount;
        uint ticketRemaining;
    }
    mapping(uint => Event) public events;
    // {userAddress: {eventId: ticketsPurchased}}
    mapping(address => mapping(uint => uint)) public tickets;
    uint nextId;

    modifier eventActive(uint _eventId) {
        require(events[_eventId].date > block.timestamp, "this event is not active anymore");
        _;
    }

    modifier eventExists(uint _eventId) {
        require(events[_eventId].date != 0, "this event does not exist");
        _;
    }

    function buyTicket(
        uint _eventId,
        uint _quantity
    )
        external
        payable
        eventExists(_eventId)
        eventActive(_eventId)
    {
        Event storage e = events[_eventId];
        require(e.price.mul(_quantity) == msg.value, "not enough ether sent");
        require(e.ticketRemaining >= _quantity, "not enough tickets left");
        e.ticketRemaining = e.ticketRemaining.sub(_quantity);
        tickets[msg.sender][_eventId] = tickets[msg.sender][_eventId].add(_quantity);
    }

    function createEvent(
        string calldata _name,
        uint _date,
        uint _price,
        uint _ticketCount
    )
        external
    {
        require(_date > block.timestamp, "event can only be organized in the future");
        require(_ticketCount > 0, "can only create event with at least 1 ticket available");
        events[nextId] = Event(
            msg.sender,
            _name,
            nextId,
            _date,
            _price,
            _ticketCount,
            _ticketCount
        );
        nextId = nextId.add(1);
    }

    function transferTicket(
        uint _eventId,
        uint _quantity,
        address _to
    )
        external
        eventExists(_eventId)
        eventActive(_eventId)
    {
        require(tickets[msg.sender][_eventId] >= _quantity, "not enough tickets");
        tickets[msg.sender][_eventId] = tickets[msg.sender][_eventId].sub(_quantity);
        tickets[_to][_eventId] = tickets[_to][_eventId].add(_quantity);
    }
}
