import Web3 from 'web3';
import Crud from '/app/build/contracts/Crud.json';

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

const initContract = async (web3) => {
  // const networkId = Object.keys(Crud.networks)[0];
  const networkId = (await web3.eth.net.getId()).toString()
  return new web3.eth.Contract(
      Crud.abi,
      Crud.networks[networkId].address
  );
};

const initApp = (web3, crudContract) => {
  const $create = document.getElementById('create');
  const $createResult = document.getElementById('create-result');
  const $read = document.getElementById('read');
  const $readResult = document.getElementById('read-result');
  const $update = document.getElementById('update');
  const $updateResult = document.getElementById('update-result');
  const $delete = document.getElementById('delete');
  const $deleteResult = document.getElementById('delete-result');
  let accounts = [];

  web3.eth.getAccounts().then(_accounts => {accounts = _accounts});

  $create.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.elements[0].value;
    crudContract.methods
        .create(name)
        .send({from: accounts[0]})
        .then(result => {
          $createResult.innerHTML = `New user ${name} successfully created`;
        })
        .catch(_e => {
          $createResult.innerHTML = `Ooops... there was an error while trying to create a new user...`;
        });
  });

  $read.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    crudContract.methods
        .read(id)
        .call()
        .then(result => {
          $readResult.innerHTML = `Id: ${result[0]} Name: ${result[1]}`;
        })
        .catch(_e => {
          $readResult.innerHTML = `Ooops... there was an error while trying to read user ${id}`;
        });
  });

  $update.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    const name = e.target.elements[1].value;
    crudContract.methods
        .update(id, name)
        .send({from: accounts[0]})
        .then(result => {
          $updateResult.innerHTML = `Changed name of user ${id} to ${name}`;
        })
        .catch(_e => {
          $updateResult.innerHTML = `Ooops... there was an error while trying to update name of user ${id} to ${name}`;
        });
  });

  $delete.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = e.target.elements[0].value;
    crudContract.methods
        .destroy(id)
        .send({from: accounts[0]})
        .then(result => {
          $deleteResult.innerHTML = `Deleted user ${id}`;
        })
        .catch(_e => {
          $deleteResult.innerHTML = `Ooops... there was an error while trying to delete iser ${id}`;
        });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(web3 => {
      const crudContract = initContract(web3);
      initApp(web3, crudContract);
    })
    .catch(e => console.log(e.message));
});
