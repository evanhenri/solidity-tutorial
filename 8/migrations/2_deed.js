const Deed = artifacts.require("Deed");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(
      Deed,
      accounts[0], // lawyer
      accounts[1], // beneficiary
      5,           // withdrawal can be initiated 5 seconds after the contract is deployed
      {value: 100} // deposit 100 WEI that will be distributed to the beneficiary
  );
};
