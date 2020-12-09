const DeedMultiPayout = artifacts.require("DeedMultiPayout");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(
      DeedMultiPayout,
      accounts[1], // beneficiary
      1,           // withdrawal can be initiated 1 second after the contract is deployed
      {value: 100} // deposit 100 WEI that will be distributed to the beneficiary
  );
};
