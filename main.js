'use-strict';

const hash = require("hash.js");


/*
This is a simple block class to create a block and hold transaction data.
*/
class bankBlock{
	
	constructor(index, timestamp, data, previousHash = ''){
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
		this.hash = this.createHash();
	}
	
	
	createHash(){
		return hash.sha256().update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).digest('hex');
	}
}


class bankBlockchain{
	constructor(){
		this.bankChain = [this.generateGenesisBlock()];
	}
	
	
	generateGenesisBlock(){
		return new bankBlock(1, '01/06/2018', {data: 'this is a test'}, 0);
	}
	
	getLastBlock(){
		return this.bankChain[this.bankChain.length - 1];
	}
	
	addBlock(newBlock){
		newBlock.previousHash = this.getLastBlock().hash;
		newBlock.hash = newBlock.createHash();
		
		this.bankChain.push(newBlock);
	}
}



var BankCoin = new bankBlockchain();

BankCoin.addBlock(new bankBlock(2, '02/06/2018', {data: 'this is a test chain', amount: 78}));
BankCoin.addBlock(new bankBlock(3, '02/06/2018', {data: 'this is a test chain', amount: 100}));


console.log(JSON.stringify(BankCoin, null, 4));
