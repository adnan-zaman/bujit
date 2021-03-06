import React from 'react';
import ReactDOM from 'react-dom';
import currency from "currency.js"
import App from './App';
import './index.css';


/** Class Definitions */

class AccountData {

  #balance;
  #id;
  #transactionList;

  /**
   * All the information for a single account
   * 
   * @param {string} name name of account
   * @param {number} balance starting balance
   * @param {number} percent pay percent
   * @param {string} id unique id
   * @param {TransactionData[]} transactions transaction history
   */
  constructor(name, balance, percent, id = null, transactions = []) {
    this.name = name;
    this.#balance = currency(balance);
    this.percent = percent;
    this.#id = id;
    this.#transactionList = transactions;
  }

  /**
   * Adds two numbers together. This method ensures
   * no floating point errors.
   * 
   * @param {number} amount1 number representing money value
   * @param {number} amount2  number representing money value
   * 
   * @returns {number} the sum
   */
  static add(amount1, amount2) {
    return currency(amount1).add(amount2).value;
  }

  get balance() {
    return this.#balance.value;
  }

  get id() {
    return this.#id;
  }

  set id(value) {
    //id can only be set the first time
    if (!this.#id)
      this.#id = value;
  }

  /**
   * Returns this account's transactions
   * 
   * @returns {TransactionData[]} a list of transactions
   */
  get transactions() {
    return [...this.#transactionList];
  }

  /**
   * Adds money to this account
   * 
   * @param {number} amount amount added
   */
  addMoney(amount) {
    this.#balance = this.#balance.add(amount);
  }

  /**
   * Removes money from this account
   * 
   * @param {number} amount amount to remove
   */
  removeMoney(amount) {
    this.#balance = this.#balance.subtract(amount);
  }

  /**
   * Adds a transaction to this account's transactions list.
   * Accounts have a max of 10 transactions at a time so adding an 11th
   * will remove the oldest one.
   * 
   * @param {number} amount transaction amount
   * @param {string} type type of transaction (add,subtract,transfer-in etc.)
   * @param {object} options additional options for the transaction
   * - id {number} : transaction id
   * - name {string} : transaction name
   * - other {string} : name of other account (for transfers)
   * - date {Date} : transaction date
   * 
   * @returns {TransactionData[]} 
   * - [0] the new transaction
   * - [1] {if transaction was removed, returns that transaction, undefined otherwise
   * 
   */
  addTransaction(amount, type, {id = null, name = null, other = null, date = new Date()} ) {
    const transaction = new TransactionData(amount, type, {id : id, name : name, other : other, date : date});
    let oldestTransaction;
    if (this.#transactionList.unshift(transaction) > 10)
      oldestTransaction = this.#transactionList.pop();
    return [transaction, oldestTransaction];
  }

  /**
   * Returns an object containing the same properties as this
   * AccoutData, except they aren't getters and simply just normal properties.
   * Meant to be used when interacting with IndexedDB.
   * 
   * @returns {object} object containing this AccountData's values
   */
  toObject() {
    const obj = {...this, balance : this.#balance.value};
    if (this.#id)
      obj.id = this.#id;
    return obj;
  }

  /**
   * Returns a fraction of a given amount of money
   * depending on this account's percent
   * 
   * @param {number} amount amount to get fraction of
   * 
   * @returns {number} fraction of given amount
   */
  percentOf(amount) {
    return currency(amount).multiply(this.percent/100).value;
  }
}

class TransactionData {

  #id;

  /**
   * An immutable object that represents a single transaction.
   * 
   * @param {number} amount transaction amount
   * @param {string} type type of transaction (add,subtract etc.)
   * @param {object} options optional parameters {name, other, date} 
   * -id : transaction's id
   * -name : transaction name
   * -other : name of other account (for transfers)
   * -date : date of transaction
   */
  constructor(amount, type, {id = null, name = null, other = null, date = new Date()} = {}) {
    this.amount = amount;
    this.type = type;
    this.id = id;
    this.name = name;
    this.other = other;
    this.date = date;

    Object.defineProperties(this, {
      amount : {writable : false},
      type : {writable : false},
      name : {writable : false},
      other : {writable : false},
      date : {writable : false}
    });
  }

  get id() {
    return this.#id;
  }

  set id(value) {
    //id can only be set the first time
    if (!this.#id)
      this.#id = value;
  }


}

let db;
let ACC_DATA = [];

/** DB Setup */
const dbRequest = window.indexedDB.open('bujit_db',1);

dbRequest.onupgradeneeded = function(e) {
  let db = e.target.result;
  const accountStore = db.createObjectStore('accounts', { keyPath : 'id', autoIncrement : true});
  accountStore.createIndex('name', 'name');
  accountStore.createIndex('balance', 'balance');

  const transactionStore = db.createObjectStore('transactions', { keyPath : 'id', autoIncrement : true});
  //each transactions associated account
  transactionStore.createIndex('account','account');
}

//load accounts
dbRequest.onsuccess = function(e) {
  db = e.target.result;
  const dbTransaction = db.transaction(['accounts','transactions']);
  dbTransaction.oncomplete = e => render();

  const accounts = dbTransaction.objectStore('accounts');
  const transactionsIndex = dbTransaction.objectStore('transactions').index('account');

  accounts.openCursor().onsuccess = function(e) {
    const accountCursor = e.target.result;
    if (accountCursor) {
      const acc = accountCursor.value;
      const accData = new AccountData(acc.name, acc.balance, acc.percent, acc.id);

      //get account's transactions
      transactionsIndex.openCursor(IDBKeyRange.only(accData.id)).onsuccess = function(e) {
        const txCursor = e.target.result;
        if (txCursor) {
          const tx = txCursor.value;
          accData.addTransaction(tx.amount, tx.type, {id : tx.id, name : tx.name, other : tx.other, date : tx.date});
          txCursor.continue();
        }
        else {
          //account is fully loaded, put into list
          //and move onto next account
          ACC_DATA.push(accData); 
          accountCursor.continue();
        } 
       
      }; 
    }
  }

}

// :(
dbRequest.onfailure = function(e){
  alert('IndexedDB failed to start. Data will not be saved.');
}

/**
 * Adds an account into the database
 * @param {string} name account name     
 * @param {number} bal  account balance 
 * @param {number} percent  account percent 
 */
function addAccount(name, bal, percent) {
  const newAcc = new AccountData(name, bal, percent);

  const transaction = db.transaction('accounts','readwrite');
  transaction.oncomplete = e => render();
  
  const accounts = transaction.objectStore('accounts');
  accounts.add(newAcc.toObject())
          .onsuccess = e => {newAcc.id = e.target.result; ACC_DATA.push(newAcc);}; 
}

/**
 * Delete account (and all associated transactions) from database
 * 
 * @param {number} id account id
 */
function deleteAccount(id) {
  const dbTransaction = db.transaction(['accounts','transactions'],'readwrite');

  const request = dbTransaction
                        .objectStore('accounts')
                        .delete(id);

  //delete all associated transactions
  const transactions = dbTransaction.objectStore('transactions');
  transactions.index('account').openKeyCursor(IDBKeyRange.only(id)).onsuccess = function(e) {
    const cursor = e.target.result;
    if (cursor) {
      transactions.delete(cursor.primaryKey);
      cursor.continue();
    }
    
  };

  request.onsuccess = function(e) {
    ACC_DATA = ACC_DATA.filter(acc => acc.id !== id);
    render();
  }
}
/**
 * Modify an existing account
 * 
 * @param {number} id account id
 * @param {string} newName account name
 * @param {number} newPercent account percent
 */
function editAccount(id, newName, newPercent) {
  let targetAcc;
  for (const acc of ACC_DATA) {
    if (acc.id === id)
    {
      targetAcc = acc;
      acc.name = newName;
      acc.percent = newPercent;
      break;
    }
  }

  const accounts = db.transaction('accounts','readwrite')
                    .objectStore('accounts');
          
  accounts.put(targetAcc.toObject()).onsuccess = e => render();
}

/**
 * Add money to an existing account
 * 
 * @param {number} id account id
 * @param {number} amount amount of money to be added
 * @param {string} transactionName name of transaction
 */
function addMoney(id, amount,transactionName) {
  const info = {};
  info[id] = ['addMoney', {amount : amount, type : 'add', options : {name : transactionName}}];
  moneyTransaction(info);
}

/**
 * Remove money from an existing account
 * 
 * @param {number} id account id
 * @param {number} amount amount of money to be removed
 * @param {string} transactionName name of transaction
 */
function removeMoney(id, amount, transactionName) {
  const info = {};
  info[id] = ['removeMoney', {amount : amount, type : 'subtract', options : {name : transactionName}}];
  moneyTransaction(info);
}

/**
 * Transfer money between two accounts
 * 
 * @param {number} sourceId id of account to take money from
 * @param {string} sourceName name of account to take money from
 * @param {number} targetId id of account to send money to
 * @param {string} targetName name of account to send money to
 * @param {number} amount amount of money to transfer
 */
function transferMoney(sourceId, sourceName, targetId, targetName, amount) {
  const info = {};
  info[sourceId] = ['removeMoney', {amount : amount, type : 'transfer-out', options : {other : targetName}}];
  info[targetId] = ['addMoney', {amount : amount, type : 'transfer-in', options : {other : sourceName}}];
  moneyTransaction(info);
}

function pay(amount) {
  const info = {}
  ACC_DATA.forEach(acc => {
    info[acc.id] = ['addMoney', {amount : acc.percentOf(amount), type : 'pay', options : {name : "Paid"}}];
  });
  moneyTransaction(info);
}


/**
 * 
 * Modifies the balance of of an account and adds a
 * transaction into the database.
 * 
 * @param {object} transactionInfo an object containing a variable amount of properties where
 * - property name is the account id of affected account
 * - value is an array [string,object] where [0] is the transaction method (addMoney, subtractMoney)
 * and [1] is the transaction details 
 * {amount : number, type : string, options : {name : string?, other : string?, date : Date?}}
 */
function moneyTransaction(transactionInfo) {
  const accounts = {};
  const transactions = {};

  for (const acc of ACC_DATA) {
    if (acc.id in transactionInfo)
    {
      const txMethod = transactionInfo[acc.id][0];
      const txDetails = transactionInfo[acc.id][1];

      accounts[acc.id] = acc;
      acc[txMethod](txDetails.amount);
      const transactionOutput = acc.addTransaction(txDetails.amount, txDetails.type, txDetails.options);
      transactions[acc.id] = transactionOutput;
    }
  }

  const dbTransaction = db.transaction(['accounts','transactions'],'readwrite');
  dbTransaction.oncomplete = e => render();

  const accountStore = dbTransaction.objectStore('accounts');
  const transactionStore = dbTransaction.objectStore('transactions');

  for (const id in accounts) {
    accountStore.put(accounts[id].toObject()).onsuccess = e => {
      transactionStore.add({...transactions[id][0], account : Number(id)}).onsuccess = e => {
        transactions[id][0].id = e.target.result;
        transactions[id][1] && transactionStore.delete(transactions[id][1].id);
      };
    };
  }
  
}


function render() {
  ReactDOM.render(
    <React.StrictMode>
      <App 
        accounts={ACC_DATA} 
        addAccount={addAccount}
        deleteAccount={deleteAccount}
        editAccount={editAccount}
        addMoney={addMoney}
        removeMoney={removeMoney}
        transferMoney={transferMoney}
        pay={pay}
      
        
      />
    </React.StrictMode>,
    document.getElementById('root')
  );
}


render();

export { AccountData, TransactionData };

