const contractABI = [
    {
        "inputs": [],
        "name": "hello",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "pure",
        "type": "function",
        "constant": true
    }
];

// You can find this address in build/contracts/<contract>.json,
// or just copy it from the output of `truffle migrate --reset`
const contractAddress = '0x6e4dD4fc5F6E0B8149Ef171Dac2Ba7f5247fCA9E';

const web3 = new Web3('http://127.0.0.1:8545');
const helloWorld = new web3.eth.Contract(contractABI, contractAddress);

document.addEventListener('DOMContentLoaded', () => {
    helloWorld.methods.hello().call()
        .then(result => {
            document.getElementById('hello').innerHTML = result;
        });
});
