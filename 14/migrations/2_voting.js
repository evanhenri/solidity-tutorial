const Voting = artifacts.require("Voting");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(Voting);
};

// $ docker exec -it eattheblocks_app_1 truffle console
// const voting = await Voting.deployed()
// const voter1 = "0x23dca59DB6A2FA829cD28f1D7b27b9e76791cBBF";
// const voter2 = "0xA0851A8aDA09068df92a54f400C469555EBd643b";
// const voter3 = "0x23eB4A5710dB9A721f5Df349C688A6cf5fdcA377";
// const voters = [voter1, voter2, voter3]
// await voting.addVoters(voters)
// await voting.createBallot("dividends", ["increase", "decrease", "unchanged"], 60);
//
// // ballot0, choice0 (increase)
// await voting.vote(0, 0, {from: voter1});
//
// // ballot0, choice1 (decrease)
// await voting.vote(0, 1, {from: voter2});
//
// // ballot0, choice0 (increase)
// await voting.vote(0, 0, {from: voter3});
//
// await voting.getResults(0);
