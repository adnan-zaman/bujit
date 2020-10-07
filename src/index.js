import React from 'react';
import ReactDOM from 'react-dom';
import currency from "currency.js"
import './index.css';
import App from './App';


/**
 * All the information for a single account
 */

class AccountData {

  #balance = 0;
  #id = "";

  /**
   * Creates a new account.
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
  }

  get balance() {
    return this.#balance.value;
  }

  get id() {
    return this.#id;
  }

  addMoney(amount) {
    this.#balance = this.#balance.add(amount);
  }

  removeMoney(amount) {
    this.#balance = this.#balance.subtract(amount);
  }

}

const ACC_DATA = [];
console.log('wahohoo');
ReactDOM.render(
  <React.StrictMode>
    <App accounts={ACC_DATA}/>
  </React.StrictMode>,
  document.getElementById('root')
);

export default AccountData;

