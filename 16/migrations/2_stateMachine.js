const StateMachine = artifacts.require("StateMachine");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(
      StateMachine,
      1000, // amount
      100, // interest
      100, // duration is 100s
      accounts[1], // borrower
      accounts[2], // lender
  );
};
