import React, { useEffect, useState } from 'react';
import Multisig from './MultiSig.json';
import { getWeb3 } from './utils.js';

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [currentTransfer, setCurrentTransfer] = useState(undefined);
  const [n, setN] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Multisig.networks[networkId];
      const contract = new web3.eth.Contract(
        Multisig.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const n = await contract.methods
        .n()
        .call();

      setWeb3(web3);
      setAccounts(accounts);
      setContract(contract);
      setN(n);
    }
    init();

    // if the user changes the current account in metamask, update the frontend
    // to reflect that change.
    window.ethereum.on('accountsChanged', accounts => { setAccounts(accounts) });
  }, []);

  // every time the variables in the below array change, this hook will get called
  useEffect(() => {
    // make sure the necessary variables are defined before calling functions that
    // use them.
    if(typeof contract !== 'undefined' && typeof web3 !== 'undefined') {
      updateBalance();
      updateCurrentTransfer();
    }
  }, [accounts, contract, web3]);

  async function updateBalance() {
    const balance = await web3.eth.getBalance(contract.options.address);
    setBalance(balance);
  }

  async function createTransfer(e) {
    e.preventDefault();
    const amount = e.target.elements[0].value;
    const to = e.target.elements[1].value;
    await contract.methods
      .createTransfer(amount, to)
      .send({from: accounts[0]});
    await updateCurrentTransfer();
  }

  async function sendTransfer() {
    await contract.methods
      .sendTransfer(currentTransfer.id)
      .send({from: accounts[0]});
    await updateBalance();
    await updateCurrentTransfer();
  }

  async function updateCurrentTransfer() {
    const currentTransferId = (await contract.methods
      .nextId()
      .call()) - 1;
    if(currentTransferId >= 0) {
      const currentTransfer = await contract.methods
        .transfers(currentTransferId)
        .call();
      const alreadyApproved = await contract.methods
        .approvals(accounts[0], currentTransferId)
        .call();
      setCurrentTransfer({...currentTransfer, alreadyApproved});
    }
  }

  if (!web3) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-center">MultiSig</h1>

      <div className="row">
        <div className="col-sm-12">
           <p>Balance: <b>{balance}</b> wei </p>
        </div>
      </div>

      {!currentTransfer || currentTransfer.approvals === n ? (
        <div className="row">
          <div className="col-sm-12">
            <h2>Create transfer</h2>
            <form onSubmit={e => createTransfer(e)}>
              <div className="form-group">
                <label htmlFor="amount">Amount</label>
                <input type="number" className="form-control" id="amount" />
              </div>
              <div className="form-group">
                <label htmlFor="to">To</label>
                <input type="text" className="form-control" id="to" />
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-sm-12">
            <h2>Approve transfer</h2>
            <ul>
              <li>TransferId: {currentTransfer.id}</li>
              <li>Amount: {currentTransfer.amount}</li>
              <li>Approvals: {currentTransfer.approvals}</li>
            </ul>
            {currentTransfer.alreadyApproved ? 'Already approved' : (
              <button
                type="submit"
                className="btn btn-primary"
                onClick={sendTransfer}
              >Submit</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
