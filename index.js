async function connect(){
    if(typeof window.ethereum !=="undefined"){
       await window.ethereum.request({method:"eth_requestAccounts"});
       document.getElementById("connectButton").innerHTML = "Metamask Connected!";
       console.log("You are connected!");
    }else{
        document.getElementById("connectButton").innerHTML = "Please install the metamask!";
    }
}