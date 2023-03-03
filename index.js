import { ethers } from "./ethers-5.6.esm.min.js";
import {abi,contractAddress} from "./constants.js";

const connectButton = document.getElementById("connectButton");
const withdrawButton = document.getElementById("withdrawButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
connectButton.onclick = connect
withdrawButton.onclick = Withdraw
fundButton.onclick = fund
balanceButton.onclick = GetBalance



async function connect(){
    if(typeof window.ethereum !=="undefined"){
       await window.ethereum.request({method:"eth_requestAccounts"});
       document.getElementById("connectButton").innerHTML = "Metamask Connected!";
       console.log("You are connected!");
    }else{
        document.getElementById("connectButton").innerHTML = "Please install the metamask!";
    }
}


async function Withdraw() {
    console.log(`Withdrawing...`)
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const transactionResponse = await contract.Withdraw()
        await listenForTransactionMine(transactionResponse, provider)
        // await transactionResponse.wait(1)
      } catch (error) {
        console.log(error)
      }
    } else {
      withdrawButton.innerHTML = "Please install MetaMask"
    }
  }


async function fund(){
    const ethAmount = document.getElementById("ethAmount").value;
    console.log("Funding with ethn amount",ethAmount);
    if(typeof window.ethereum !== "undefined"){

        //provider connection to the blockchain
        //signer wallet 
        //contract that we we are interacting with
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress,abi,signer);
        try{
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })

            //hey wait for this TX to finish this
            await listenForTransactionMine(transactionResponse,provider);
            console.log("Done!");
        }catch (error){
            console.log(error);
        }
    
     
    }


}

async function GetBalance(){
    if(typeof window.ethereum != "undefined"){
       const provider = new ethers.providers.Web3Provider(window.ethereum)
       const balance = await provider.getBalance(contractAddress);
       console.log(ethers.utils.formatEther(balance));
    }
}


function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}`)
    return new Promise((resolve, reject) => {
        try {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations. `
                )
                resolve()
            })
        } catch (error) {
            reject(error)
        }
    })
}
