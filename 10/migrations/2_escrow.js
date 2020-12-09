const Escrow = artifacts.require("Escrow");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(
      Escrow,
      accounts[1], // payer
      accounts[2], // payee
      1000, // 1000 WEI needs to be deposited into the escrow by the payer before funds can be released by the third party
  );
};
