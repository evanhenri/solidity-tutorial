const Fibonacci = artifacts.require("Fibonacci");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(Fibonacci);
};
