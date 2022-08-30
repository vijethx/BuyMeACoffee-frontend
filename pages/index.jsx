/* eslint-disable react/no-unescaped-entities */
import { ethers } from "ethers";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import abi from "../utils/BuyMeACoffee.json";

export default function Home() {
  // Contract Address & ABI
  const contractAddress = "0x62eE740323c5355362edF37B442733d8FaC5066C";
  const contractABI = abi.abi;

  // Component state
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);
  const [eth, setEth] = useState("0");

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  // Wallet connection logic
  const isWalletConnected = async () => {
    try {
      const { ethereum } = window;

      const accounts = await ethereum.request({ method: "eth_accounts" });
      console.log("accounts: ", accounts);

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log("wallet is connected! " + account);
      } else {
        console.log("make sure MetaMask is connected");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum && !ethereum.isMetaMask) {
        console.log("please install MetaMask");
        alert(`Install Metamask : https://metamask.io`);
      }

      switchToGoerli();

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const switchToGoerli = async () => {
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x5",
                chainName: "Goerli Test Network",
                rpcUrls: ["https://rpc.ankr.com/eth_goerli"] /* ... */,
              },
            ],
          });
        } catch (addError) {
          console.log("Error in switchToGoerli");
        }
      }
      // handle other "switch" errors
    }
  };

  const checkEth = (e) => {
    e.preventDefault();
    if (name === "") {
      alert("Name required");
    }
    if (message === "") {
      alert("Message required");
    }
    if (eth < 0.01) {
      alert("Tipping amount required to proceed");
    }
  };

  const buyCoffee = async (e) => {
    try {
      checkEth(e);
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "goerli");
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("buying coffee..");
        const coffeeTxn = await buyMeACoffee.buyCoffee(
          name ? name : "anon",
          message ? message : "Enjoy your coffee!",
          { value: ethers.utils.parseEther(eth) }
        );

        await coffeeTxn.wait();

        console.log("mined ", coffeeTxn.hash);

        console.log("coffee purchased!");
        alert("Vijeth thanks you for the coffee!");

        // Clear the form fields.
        setName("");
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to fetch all memos stored on-chain.
  const getMemos = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const buyMeACoffee = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        console.log("fetching memos from the blockchain..");
        const memos = await buyMeACoffee.getMemos();
        console.log("fetched!");
        setMemos(memos);
      } else {
        console.log("Metamask is not connected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(eth);
  }, [eth]);

  useEffect(() => {
    let buyMeACoffee;
    isWalletConnected();
    getMemos();

    // Create an event handler function for when someone sends
    // us a new memo.
    const onNewMemo = (from, timestamp, name, message) => {
      console.log("Memo received: ", from, timestamp, name, message);
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name,
        },
      ]);
    };

    const { ethereum } = window;

    // Listen for new memo events.
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      buyMeACoffee = new ethers.Contract(contractAddress, contractABI, signer);

      buyMeACoffee.on("NewMemo", onNewMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off("NewMemo", onNewMemo);
      }
    };
  }, []);

  return (
    // <div className={styles.container}>
    //   <Head>
    //     <title>Buy Vijeth a Coffee!</title>
    //     <meta name='description' content='Tipping site' />
    //     <link rel='icon' href='/favicon.ico' />
    //   </Head>

    //   <main className={styles.main}>
    //     <h1 className={styles.title}>Buy Vijeth a Coffee!</h1>

    //     {currentAccount ? (
    //       <div>
    //         <form>
    //           <div>
    //             <label>Name</label>
    //             <br />

    //             <input
    //               id='name'
    //               type='text'
    //               placeholder='anon'
    //               onChange={onNameChange}
    //             />
    //           </div>
    //           <br />
    //           <div>
    //             <label>Send Vijeth a message</label>
    //             <br />

    //             <textarea
    //               rows={3}
    //               placeholder='Enjoy your coffee!'
    //               id='message'
    //               onChange={onMessageChange}
    //               required></textarea>
    //           </div>
    //           <div>
    //             <button type='button' onClick={buyCoffee}>
    //               Send 1 Coffee for 0.001ETH
    //             </button>
    //           </div>
    //         </form>
    //       </div>
    //     ) : (
    //       <button onClick={connectWallet}> Connect your wallet </button>
    //     )}
    //   </main>

    //   {currentAccount && <h1>Memos received</h1>}

    //   {currentAccount &&
    //     memos.map((memo, idx) => {
    //       return (
    //         <div
    //           key={idx}
    //           style={{
    //             border: "2px solid",
    //             borderRadius: "5px",
    //             padding: "5px",
    //             margin: "5px",
    //           }}>
    //           <p style={{ fontWeight: "bold" }}>"{memo.message}"</p>
    //           <p>
    //             From: {memo.name} at {memo.timestamp.toString()}
    //           </p>
    //         </div>
    //       );
    //     })}

    //   <footer className={styles.footer}>
    //     <a
    //       href='https://twitter.com/vijethx'
    //       target='_blank'
    //       rel='noopener noreferrer'>
    //       Created by @vijethx
    //     </a>
    //   </footer>
    // </div>
    <>
      <Head>
        <title>Buy Vijeth a Coffee!</title>
        <meta name='description' content='Buy Vijeth a Coffee' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div
        className='h-screen flex items-center justify-center font-["Lexend_Deca"]  bg-grad 
  '>
        <div className='flex-col items-center justify-center py-12 px-8 rounded-xl'>
          {" "}
          <h1 className='font-bold text-3xl text-center'>
            Buy Vijeth A Coffee
          </h1>
          <p className='text-gray-500'>
            (Works only w/ Metamask and Goerli Testnet)
          </p>
          <div className='flex items-center justify-center'>
            {currentAccount ? (
              <form className='flex-col items-center justify-center'>
                <div className='my-10'>
                  <label htmlFor='name'>Name</label>
                  <input
                    onChange={onNameChange}
                    required
                    name='name'
                    type='text'
                    className='border h-10 w-full rounded-lg mt-3'
                  />
                </div>
                <div className='my-10'>
                  <label htmlFor='message'>Message</label>
                  <textarea
                    className='border mt-3 h-30 w-full resize-none rounded-lg'
                    name='message'
                    onChange={onMessageChange}
                    required
                    rows='3'></textarea>
                </div>
                <div className='flex items-center justify-center'>
                  <ul className='grid grid-cols-3 gap-x-5 mb-10 max-w-md mx-auto'>
                    <li className='relative flex items-center justify-center'>
                      <input
                        className='sr-only peer'
                        type='radio'
                        value='yes'
                        name='answer'
                        id='answer_yes'
                        onClick={() => setEth("0.01")}
                      />
                      <label
                        className='flex p-4 bg-white border border-gray-300 rounded-full cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-indigo-500 peer-checked:ring-2 peer-checked:border-transparent'
                        htmlFor='answer_yes'>
                        0.01 ETH
                      </label>
                    </li>
                    <li className='relative flex items-center justify-center'>
                      <input
                        className='sr-only peer'
                        type='radio'
                        value='no'
                        name='answer'
                        id='answer_no'
                        onClick={() => setEth("0.02")}
                      />
                      <label
                        className='flex p-4 bg-white border border-gray-300 rounded-full cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-indigo-500 peer-checked:ring-2 peer-checked:border-transparent'
                        htmlFor='answer_no'>
                        0.02 ETH
                      </label>
                    </li>

                    <li className='relative flex items-center justify-center'>
                      <input
                        className='sr-only peer'
                        type='radio'
                        value='maybe'
                        name='answer'
                        id='answer_maybe'
                        onClick={() => setEth("0.05")}
                      />
                      <label
                        className='flex p-4 bg-white border border-gray-300 rounded-full cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-indigo-500 peer-checked:ring-2 peer-checked:border-transparent'
                        htmlFor='answer_maybe'>
                        0.05 ETH
                      </label>
                    </li>
                  </ul>
                </div>
                <button
                  className='bg-black text-white p-4  w-full rounded-full '
                  type='submit'
                  onClick={buyCoffee}>
                  Send
                </button>
                <div className='flex items-center justify-center mt-2'>
                  <a
                    href='https://goerlifaucet.com'
                    target='_blank'
                    className='text-blue-700'
                    rel='noreferrer'>
                    Click here to get GoerliETH
                  </a>
                </div>
                <div className='flex items-center justify-center mt-2'>
                  <a
                    href='https://goerli.etherscan.io/address/0x62eE740323c5355362edF37B442733d8FaC5066C'
                    target='_blank'
                    className='text-orange-500'
                    rel='noreferrer'>
                    &gt;&gt; Check your transactions here! &lt;&lt;
                  </a>
                </div>
              </form>
            ) : (
              <button
                className='bg-black text-white mt-5  p-4 rounded-full w-full'
                type='submit'
                onClick={connectWallet}>
                Connect Wallet
              </button>
            )}
          </div>
          <footer className='flex items-center justify-center mt-5 '>
            <a
              href='https://twitter.com/vijethx'
              target='_blank'
              rel='noopener noreferrer'>
              Created by @vijethx
            </a>
          </footer>
          {currentAccount &&
            memos.map((memo, idx) => {
              return (
                <div key={idx} className='mt-10 drop-shadow-sm'>
                  <p style={{ fontWeight: "bold" }}>"{memo.message}"</p>
                  <p>From: {memo.name}</p>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
