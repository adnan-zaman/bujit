import React, {useState, useRef, useEffect } from "react"
import { AccountData } from "./index"
import Dialog from "./components/Dialog"
import Account from "./components/Account"
import "./App.css"




    
/**
 * Creates an object containing refs to hold references to the
 * two DOM elements to switch focus between when switching 
 * back and forth from dialogs.
 * 
 * @returns {object} object of format {from : (ref), to : (ref)}
 * - from => DOM element that started the dialog 
 * - to => DOM element focus will switch to when dialog opens
 *  
 */
function useFocusTargets() {
  const from = useRef();
  const to = useRef();
  const focusTargets = useRef({from : from, to: to});  
  return focusTargets.current;
}

/**
 * Get the value of a given variable from the last render.
 * 
 * @param newVal the value of the tracked variable, this will be returned on next call
 * @returns the value of the tracked variable on the previous render
 */
function usePrevious(newVal) {
  const currVal = useRef();
  useEffect(() => {currVal.current = newVal;});
  return currVal.current;
}

function App(props) {

  /* Focus Management & Dialog Logic */

  //depending on input, dialog may be set to a Dialog component
  const [dialog,setDialog] = useState(null);
  //was there an active dialog last render
  const wasThereDialog = usePrevious(dialog);

  /**
   * Creates a dialog box of a specified type and manages
   * focus between initiating element and dialog elements.
   * 
   * @param {string} type type of dialog box (create, edit, alert etc.)
   * @param {*} element id of DOM element / DOM element reference of initiating elements
   * @param {*} data data required by dialog, depends on type
   * 
   * ## Valid Types and Required Data
   * - create : nothing needed
   * - edit : {id : account id, name: account name, percent: account percent}
   * - add : {id : account id}
   * - subtract: {id : account id, name: account name, balance: account balance}
   * - transfer : {accounts : AccountData[]}
   * - history : {id : account id, name: account name}
   * - pay : nothing needed
   * - alert : {msg : message, (name : f)} at least one property msg that contains a string which
   * is the messaged to be displayed followed one or more properties where the property name is
   * the name of button and the property value is the callback function to be called on button click
   * 
   */
  function startDialog(type, element, data={}) {
    if (typeof element === "string")
      focusTargets.from.current = document.querySelector("#"+element);
    else
      focusTargets.from.current = element;

    if (type === "history") {
      for (const acc of props.accounts) {
        if (acc.id === data.id) {
          data.transactions = acc.transactions;
          delete data.id;
          break;
        }
      }
    }

    if (type !== "alert") {
      switch (type) {
        case "create":
          data.onSubmit = addAccount;
          break;
        case "edit":
          data.onSubmit = editAccount;  
          break;  
        case "add":
          data.onSubmit = addMoney;   
          break
        case "subtract":
          data.onSubmit = removeMoney;
          break;
        case "transfer":
          data.onSubmit = transferMoney;
          break;
        case "pay":
          data.onSubmit = payAccounts;
          break;
      }
      data.onCancel = stopDialog;
    }
 
    setDialog(<Dialog 
      type={type}
      properties={data}
      ref={focusTargets.to}  
    />);
  }

  function stopDialog() {
    setDialog(null);
  }
  
  //DOM elements to focus on when switching states
  const focusTargets = useFocusTargets();
  
  
  //manage focus
  useEffect(() => {
    if (!wasThereDialog && dialog) 
      focusTargets.to.current.focus(); 
    else if (wasThereDialog && !dialog) 
      focusTargets.from.current.focus(); 
  }, [dialog, wasThereDialog, focusTargets]);


  /* Account Data */
  
  //total balance
  let totalBalance = 0;

   //array of Account components 
   const accList = [];


   for (let acc of props.accounts) { 
    accList.push(<Account 
        name={acc.name} 
        balance={acc.balance} 
        percent={acc.percent} 
        id={acc.id} 
        key={acc.id}
        onDelete={(id, name, elt) => startDialog("alert", elt, 
                                                  {msg: `Are you sure you want to delete ${name}?`,
                                                   Yes : () => {deleteAccount(id); stopDialog()}, 
                                                   No : stopDialog 
                                                  }
                                                )}

        onEdit={(accData, element) => startDialog("edit", element, accData)}
        onAdd={(accData, element) => startDialog("add", element, accData)}
        onRemove={(accData, element) => startDialog("subtract", element, accData)}
        onHistory={(accData, element) => startDialog("history",element, accData)}
      />);

      totalBalance = AccountData.add(totalBalance, acc.balance);
   }
  

  /* Account Creation/Deletion */
  
  /**
   * Add a new account object
   * 
   * @param {string} accName account name
   * @param {number} startingBal account balance
   * @param {number} startingPercent account percentage
   */
  function addAccount(accName, startingBal = 0, startingPercent = 0.0) {
    stopDialog();
    props.addAccount(accName, startingBal, startingPercent);
  }

  /**
   * Delete an account object
   * 
   * @param {number} id account id
   */
  function deleteAccount(id) {
    stopDialog();
    props.deleteAccount(id);
  }


  /* Account Modification

  /**
   * Edits details of an existing account.
   * 
   * @param {number} id account id
   * @param {string} newName new account name
   * @param {number} newPercent new account percentage
   */
  function editAccount(id, newName, newPercent) {
    stopDialog();
    props.editAccount(id, newName, newPercent);
    
  }

  /**
   * Add money to an existing account.
   * 
   * @param {number} id 
   * @param {number} amount 
   */
  function addMoney(id, amount, transactionName) {
    stopDialog();
    props.addMoney(id, amount, transactionName);
  }

  /**
   * Remove money from an existing account.
   * 
   * @param {number} id 
   * @param {number} amount 
   */
  function removeMoney(id, amount, transactionName) {
    stopDialog();
    props.removeMoney(id, amount, transactionName);
  }

  /**
   * Transfers money from one account to another
   * 
   * @param {number} sourceId account id of account to take money from
   * @param {string} sourceName name of account to take money from
   * @param {number} targetId account id of account to tranfer money to 
   * @param {string} targetName name of account to transfer money to
   * @param {number} amount amount of money to transfer
   */
  function transferMoney(sourceId, sourceName, targetId, targetName, amount) {
    stopDialog();
    props.transferMoney(sourceId, sourceName, targetId, targetName, amount);
  
    
  }

  function payAccounts(amount) {
    stopDialog();
    props.pay(amount);
  }

  /**
   * Creates a transfer dialog if there are enough
   * accounts to do so
   * 
   * @param {*} element id of DOM element or DOM element of transfer button
   */
  function handleTransfer(element) {
    if (props.accounts.length > 1)
      startDialog("transfer", element, {accounts: props.accounts});
    else 
      startDialog("alert", element,
        {msg : "You need at least 2 accounts to transfer",
         OK : stopDialog});
  }

  /**
   * Creates a pay dialog if all percents
   * add up to 100
   * 
   * @param {*} element id of DOM element or DOM element of pay button
   */
  function handlePay(element) {
    let totalPercent = 0;
    props.accounts.forEach(acc => totalPercent += acc.percent);
    if (totalPercent === 100)
      startDialog("pay", element);
    else 
      startDialog("alert", element,
        {msg : "All account percents must add up to 100",
         OK : stopDialog});
  }

 
  return(
    <div className='app-container vert-flex-container'>
      <h1>Bujit</h1> 
      <div className='app-main vert-flex-container'>
        <section className='acc-area'>
          {
            (accList.length > 0) ? 
              accList :
              <p>You don't seem to have any accounts. Add one to start tracking!</p>
          }
        </section>
        <section className='toolbar'>
          <label htmlFor='total-bal' className='total-bal'>
            Total <span className="visually-hidden">Balance</span>
          </label>
          <input 
              id='total-bal' 
              type='text' 
              className='total-bal' 
              value={"$" + totalBalance.toFixed(2)} 
              disabled={true}
          />
          
          <button 
            id="add-account"
            onClick={() => startDialog("create", "add-account") }
          >
            Add <span className='visually-hidden'>Account</span>
          </button>
          <button 
            id="transfer"
            onClick={() => handleTransfer("transfer")} 
          >
            Transfer
          </button>
          <button 
            id="pay"
            onClick={() => handlePay("pay")} 
          >
            Pay
          </button>
          
          
          
        </section>
      </div>

      {dialog}
    </div>
   
  );
}


export default App;