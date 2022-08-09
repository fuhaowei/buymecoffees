// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");


// takes in address, gives back ether balance
async function getBalance(address) {

  //with hardhat, there is a tool called waffle
  //uses ethers under the hood. provider is a node from the blockchain
  //getBalance is wrapped from ether, just returns balance
  //returns as big int
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  // but hey! in ethers, we have a formatter for this, returns nicer format
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx ++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

async function main() {

      //get example accounts
      //these are default hardhat addys
      const [owner,tipper, tipper2, tipper3] = await hre.ethers.getSigners();

      //get contract to deploy
      const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
      const buyMeACoffee = await BuyMeACoffee.deploy();
      
      await buyMeACoffee.deployed();
      console.log("BuyMeACoffee actually deployed to", buyMeACoffee.address);

      //check balances before the coffee prurchase
      const addresses =  [owner.address, tipper.address, buyMeACoffee.address];
      console.log("we start checking balances");
      await printBalances(addresses);

      //buy the owner a few coffees
      const tip = {value: hre.ethers.utils.parseEther("1")};
      // we have instance of buymeacoffee, we want to connect tipper to it, then call the function from that 

      // hey! any function call in my script here that goes to the blockchain, i have to use await! 
      // last argument is a function array, optional
      await buyMeACoffee.connect(tipper).buyCoffee("sweet", "best content ever", tip);
      await buyMeACoffee.connect(tipper2).buyCoffee("caro", "wow u r so amazing", tip);
      await buyMeACoffee.connect(tipper3).buyCoffee("line", "ill buy u a coffee anyday", tip);

      //check balance after coffee
      console.log("we bought coffee now, should be different balances");
      await printBalances(addresses);


      // collect funds from the contract address
      //withdraw funds
      await buyMeACoffee.connect(owner).withdrawTips();

      //check balance again!
      console.log("owner has withdrew the money");
      await printBalances(addresses);

      //read all the memos that is for the owner.
      console.log("owner has withdrew the money");
      const memos = await buyMeACoffee.getMemos();
      printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
