import Web3 from 'web3';
import AdvancedStorage from '/app/build/contracts/AdvancedStorage.json';

const initWeb3 = () => {
    return new Promise((resolve, reject) => {
      const web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:8545")

      if(typeof window.ethereum !== 'undefined') {
        // Silence browser console warning
        window.ethereum.autoRefreshOnNetworkChange = false;

        // prompt the user to unlock their account
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(() => {
              // called if the user accepts the request of the DAPP in their provider
              console.log('Successfully connected to provider')
              resolve(web3);
            })
            .catch(e => {
              // called if the user rejected the request of the DAPP in their provider
              console.log('Failed to connect to provider')
              reject(e);
            });
      }
      else {
        console.log('No ethereum provider is present')
        resolve(web3);
      }
  });
};

const initContract = (web3) => {
  const deploymentKey = Object.keys(AdvancedStorage.networks)[0];
  return new web3.eth.Contract(
    AdvancedStorage.abi,
    AdvancedStorage.networks[deploymentKey].address
  );
};

const initApp = (web3, advancedStorageContract) => {
  const $addData = document.getElementById('addData');
  const $data = document.getElementById('data');
  let accounts = [];

  web3.eth.getAccounts()
      .then(_accounts => {
        accounts = _accounts;
        return advancedStorageContract.methods
            .getAll()
            .call();
      })
      .then(result => {
        $data.innerHTML = result.join(', ');
      });

  $addData.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = e.target.elements[0].value;
    advancedStorageContract.methods
        .add(data)
        .send({from: accounts[0]})
        .then(result => {
          return advancedStorageContract.methods
              .getAll()
              .call();
        })
        .then(result => {
          $data.innerHTML = result.join(', ');
        });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(web3 => {
      const advancedStorageContract = initContract(web3);
      initApp(web3, advancedStorageContract);
    })
    .catch(e => console.log(e.message));
});
