const MultiSig = artifacts.require("MultiSig");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(MultiSig,
      [
          accounts[1], //
          accounts[2], // approvers
          accounts[3], //
      ],
      2, // 2 of the above 3 addresses are required
      {from: accounts[0], value: 1000}
  );
};
