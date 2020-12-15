const Lottery = artifacts.require("Lottery");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(Lottery, 5);
};
