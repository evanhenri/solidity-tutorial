import Web3 from "web3";

const getWeb3 = () => {
  return new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
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
  });
};

export { getWeb3 };
