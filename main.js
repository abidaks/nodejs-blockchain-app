'use-strict';

const hash = require("hash.js");

class Transaction{
	constructor(sender, receiver, amount){
		this.sender = sender;
		this.receiver = receiver;
		this.amount = amount;
		this.fees = this.transactionFee();
	}
	
	transactionFee(){
		return this.amount*0.01;
	}
}

class bankBlock{
	
	constructor(timestamp, transactions, previousHash = ''){
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.hash = this.generateHash();
		this.nonce = 0;
	}
	
	generateHash(){
		return hash.sha256().update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
	}
	
	mineBankBlock(difficulty){
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
			this.nonce++;
			this.hash = this.generateHash();
		}
	}
}


class bankBlockchain{
	constructor(){
		this.bankChain = [];
		this.difficulty = 4;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}
	
	
	generateGenesisBlock(){
		var firstTransaction = new Transaction('first', 'second', 0);
		this.pendingTransactions.push(firstTransaction);
		var block = new bankBlock(Date.now(), this.pendingTransactions);
		block.mineBankBlock(this.difficulty);
		this.bankChain = [block];
		this.pendingTransactions = [];
	}
	
	getLastBlock(){
		return this.bankChain[this.bankChain.length - 1];
	}
	
	minePendingTransactions(rewardAddress){
		var block = new bankBlock(Date.now(), this.pendingTransactions, this.getLastBlock().hash);
		block.mineBankBlock(this.difficulty);
		
		console.log("block mined successfully...");
		
		var transactionFeeReward = 0;
		for(const transaction of this.pendingTransactions){
			transactionFeeReward += transaction.fees;
		}
		
		this.bankChain.push(block);
		
		this.pendingTransactions = [
			new Transaction(null, rewardAddress, this.miningReward+transactionFeeReward)
		];
	}
	
	addTransactions(transaction){
		this.pendingTransactions.push(transaction);
	}
	
	isValidChain(){
		for (var i=1; i < this.bankChain.length; i++){
			var currentBlock = this.block[i];
			var previousBlock = this.block[i - 1];
			
			if(currentBlock.hash !== currentBlock.generateHash()){
				return false;
			}
			if(currentBlock.previousHash !== previousBlock.hash){
				return false;
			}
		}
		return true;
	}
	
	getBalanceOfAddress(address){
		var balance = 0;
		for(const block of this.bankChain){
			for(const transaction of block.transactions){
				if(transaction.sender === address){
					balance -= transaction.amount;
				}
				
				if(transaction.receiver === address){
					balance += transaction.amount;
				}
			}
		}
		return balance;
	}
}



var BankCoin = new bankBlockchain();

BankCoin.generateGenesisBlock();

console.log("block 1 mining.....");
BankCoin.addTransactions(new Transaction('sender', 'reciever', 100));
BankCoin.minePendingTransactions('miner');

console.log("block 2 mining.....");
BankCoin.addTransactions(new Transaction('reciever', 'sender', 50));
BankCoin.minePendingTransactions('miner2');


console.log("\n\n");
console.log("reciever balance is "+BankCoin.getBalanceOfAddress('reciever'));
console.log("miner balance is "+BankCoin.getBalanceOfAddress('miner'));
console.log("sender balance is "+BankCoin.getBalanceOfAddress('sender'));
console.log("\n\n");
console.log(JSON.stringify(BankCoin, null, 4));
