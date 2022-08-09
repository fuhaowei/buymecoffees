// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.


// BuyMeACoffee actually deployed to 0xE92dCcf159213116595085878040957463E3604f



const hre = require("hardhat");


// takes in address, gives back ether balance
async function main(){
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    
    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee actually deployed to", buyMeACoffee.address);
  
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
