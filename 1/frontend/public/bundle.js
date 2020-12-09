const contractABI = [];

// You can find this address in build/contracts/<contract>.json,
// or just copy it from the output of `truffle migrate --reset`
const contractAddress = '0x3441cD1E5969ffB9d028515D9D664104ca246614';

const web3 = new Web3('http://127.0.0.1:8545');
const simpleSmartContract = new web3.eth.Contract(contractABI, contractAddress);

console.log(simpleSmartContract);
web3.eth.getAccounts().then(console.log);
