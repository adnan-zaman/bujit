import React from 'react';
import ReactDOM from 'react-dom';
import currency from "currency.js"
import './index.css';
import App from './App';



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
   */
  constructor(name, balance, percent, id) {
    this.name = name;
    this.#balance = currency(balance);
    this.percent = percent;
    this.#id = id;
    this.#transactionList = [];
  }

  get balance() {
    return this.#balance.value;
  }

  get id() {
    return this.#id;
  }

  get transactions() {
    return [...this.#transactionList];
  }

  addMoney(amount) {
    this.#balance = this.#balance.add(amount);
  }

  removeMoney(amount) {
    this.#balance = this.#balance.subtract(amount);
  }

  addTransaction(amount, type, {name = null, other = null}) {
    if (this.#transactionList.unshift(new TransactionData(amount, type, {name : name, other : other})) > 10)
      this.#transactionList.pop();

  }

}


class TransactionData {
  #amount;
  #type;
  #name;
  #other;
  #date;

  /**
   * Represents a single transaction
   * 
   * @param {number} amount transaction amount
   * @param {string} type type of transaction (add,subtract etc.)
   * @param {object} optional params {name, other} 
   * -name : transaction name
   * -other : name of other account (for transfers)
   */
  constructor(amount, type, {name = null, other = null, date = Date.now()} = {}) {
    this.#amount = amount; 
    this.#name = type = type;
    this.#name = name;
    this.#other = other;
    this.#date = date;
  }

  /**
   * Transaction amount
   */
  get amount () {
    return this.#amount;
  }

  /**
   * Transaction type
   */
  get type() {
    return this.#type;
  }
  
  /**
   * Name of transaction
   */
  get name() {
    return this.#name;
  }

  /** 
   * Other account name
   */
  get other() {
    return this.#other;
  }

  /**
   * Date of the transaction
   */
  get date() {
    return this.#date;
  }

}



const ACC_DATA = [];

ReactDOM.render(
  <React.StrictMode>
    <App accounts={ACC_DATA}/>
  </React.StrictMode>,
  document.getElementById('root')
);

export { AccountData, TransactionData };

