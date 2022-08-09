// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

// Import this file to use console.log

contract BuyMeACoffee is Ownable {

    //event to emit when a memo is created
    event newMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );


    //memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //list of all memos received from friends
    //list of the struct memo yes
    Memo[] memos;

    //address of the contract that's being deployed
    address payable owner2;
    address payable withdraw;

    //ONLY RUN ONCE! RMBR, THE ONLY TIME THIS IS RUN IS WHEN ITS BEIGNG DEPLOYED
    constructor () {
        //error message -> type address not implicitly convertible to expected type
        //hence just need to cast to payable
        owner2 = payable(msg.sender);
    }

    /**
    
     * @dev send a coffee to contract owner
     * @param _name name of the coffee buyer
     * @param _message a nice message from the cofee buyer
    
     */
    
    //mem basically says don't want to keep it around, just keep it local
    function buyCoffee(string memory _name, string memory _message) payable public{
        //value in contract soted in mesasge
        require (msg.value > 0, "send money please?");

        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        //emits the log event!
        emit newMemo(
             msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    function updateOwner(address payable newOwner) onlyOwner public {
        owner2 = newOwner;
    }

    /**    
     * @dev send entire balance of this contract to the owner
     */
    function withdrawTips() public {
        //do everything here in require statement, if anything goes wrong halfway
        //it will revert, nothing will go halfway

        //getting the address of this contract, getting the balance
        require(owner2.send(address(this).balance));
    }



    /**    
     * @dev retreive all the memos received + stored on blockchain. 
     */
     //view just to save gas, because doesn't change anythign on blockchian
    function getMemos() public view returns(Memo[] memory){
        return memos;
    }
}