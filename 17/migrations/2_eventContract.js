const EventContract = artifacts.require("EventContract");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(EventContract);
};
