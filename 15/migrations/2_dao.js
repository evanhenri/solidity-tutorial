const DAO = artifacts.require("DAO");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(DAO, 60, 30, 65);
};

// const dao = await DAO.deployed()
// dao.contribute({from: accounts[1], value: web3.utils.toWei('1', 'ether')})
// dao.contribute({from: accounts[2], value: web3.utils.toWei('1', 'ether')})
// dao.contribute({from: accounts[3], value: web3.utils.toWei('1', 'ether')})
//
// dao.createProposal("DAI", 10000, accounts[9], {from: accounts[1]})
// dao.vote(0, {from: accounts[2]})
// dao.vote(0, {from: accounts[3]})
//
// dao.executeProposal(0, {from: accounts[0]})
