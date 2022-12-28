'use strict';

const hash = require('hash.js');

class Transaction {
  constructor(sender, receiver, amount) {
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
    this.fees = this.calculateTransactionFees();
  }

  calculateTransactionFees() {
    return this.amount * 0.01;
  }
}

class BankBlock {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return hash
      .sha256()
      .update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce)
      .digest('hex');
  }

  mine(difficulty) {
    while (this.hash.substring(0, difficulty) !== '0'.repeat(difficulty)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

class BankBlockchain {
  constructor() {
    this.chain = [];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  generateGenesisBlock() {
    const firstTransaction = new Transaction('first', 'second', 0);
    this.pendingTransactions.push(firstTransaction);
    const block = new BankBlock(Date.now(), this.pendingTransactions);
    block.mine(this.difficulty);
    this.chain = [block];
    this.pendingTransactions = [];
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(rewardAddress) {
    const block = new BankBlock(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
    block.mine(this.difficulty);
    console.log('Block mined successfully...');
    const transactionFeeReward = this.pendingTransactions.reduce((total, t) => total + t.fees, 0);
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, rewardAddress, this.miningReward + transactionFeeReward),
    ];
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  isValidChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true
