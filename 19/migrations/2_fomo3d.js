const Fomo3d = artifacts.require("Fomo3d");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(Fomo3d);
};
