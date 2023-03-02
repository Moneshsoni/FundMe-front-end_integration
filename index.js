import { ethers } from "./ethers-5.6.esm.min.js";
import {abi,contractAddress} from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = GetBalance
withdrawButton.onclick = Withdraw
async function connect(){
    if(typeof window.ethereum !=="undefined"){
       await window.ethereum.request({method:"eth_requestAccounts"});
       document.getElementById("connectButton").innerHTML = "Metamask Connected!";
       console.log("You are connected!");
    }else{
        document.getElementById("connectButton").innerHTML = "Please install the metamask!";
    }
}

async function GetBalance(){
    if(typeof window.ethereum != "undefined"){
       const provider = new ethers.providers.Web3Provider(window.ethereum)
       const balance = await provider.getBalance(contractAddress);
       console.log(ethers.utils.formatEther(balance));
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
            await listingForTransactionMine(transactionResponse,provider);
            console.log("Done!");
        }catch (error){
            console.log(error);
        }
    
     
    }

}

function listingForTransactionMine(transactionResponse,provider){
    console.log(`Mining ${transactionResponse.hash} ....`);
    
    return new Promise((resolve,reject)=>{
        provider.once(transactionResponse.hash, (getTransactionReceipt)=>{
            console.log(`Completed with ${transactionResponse.confirmations} Confirmations`);
        })
        resolve()
    })


}

async function Withdraw(){
    if(typeof window.ethereum != "undefined"){
        console.log("Withdrawing ...");
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress,abi,signer);
        try{
            const transactionResponse = await contract.Withdraw();
            await listingForTransactionMine(transactionResponse,provider);
        }catch (error){
            console.log(error);
        } 
    }
}