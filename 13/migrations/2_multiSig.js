const MultiSig = artifacts.require("MultiSig");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(MultiSig,
      [
          accounts[0], //
          accounts[1], // approvers
          accounts[2], //
      ],
      2, // 2 of the above 3 addresses are required
  );
};
