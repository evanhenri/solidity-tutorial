const Strings = artifacts.require("Strings");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(Strings);
};
