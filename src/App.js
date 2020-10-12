import React, {useState, useRef, useEffect } from "react"
import { nanoid } from "nanoid"
import AccountData from "./index"
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

    if (type !== "alert")
    {
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
  
  //array of account objects
  const [accounts, setAccounts] = useState(props.accounts);

   //array of Account components 
   const accList = accounts.map(acc => 
    <Account 
      name={acc.name} 
      balance={acc.balance} 
      percent={acc.percent} 
      id={acc.id} 
      key={acc.id}
      onDelete={(id, name, elt) => startDialog("alert", elt, 
                                                {msg: `Are you sure you want to delete ${name}?`, 
                                                 No : stopDialog, 
                                                 Yes : () => {deleteAccount(id); stopDialog()}
                                                }
                                              )}

      onEdit={(accData, element) => startDialog("edit", element, accData)}
      onAdd={(accData, element) => startDialog("add", element, accData)}
      onRemove={(accData, element) => startDialog("subtract", element, accData)}
    />
  );

  /* Account Creation/Deletion */
  
  /**
   * Add a new account object
   * 
   * @param {string} accName account name
   * @param {number} startingBal account balance
   * @param {number} startingPercent account percentage
   */
  function addAccount(accName, startingBal = 0, startingPercent = 0.0) {
    accounts.push(new AccountData(accName, startingBal, startingPercent, nanoid()));
    setAccounts(accounts);
    stopDialog();
  }

  /**
   * Delete an account object
   * 
   * @param {string} id account id
   */
  function deleteAccount(id) {
    const updatedAccounts = accounts.filter((acc) => acc.id !== id);
    setAccounts(updatedAccounts);
  }


  /* Account Modification

  /**
   * Edits details of an existing account.
   * 
   * @param {string} id account id
   * @param {string} newName new account name
   * @param {number} newPercent new account percentage
   */
  function editAccount(id, newName, newPercent) {
    for (let acc of accounts) {
      if (acc.id === id) {
        acc.name = newName;
        acc.percent = newPercent;
        break;
      }
    }
    setAccounts(accounts);
    stopDialog();
  }

  /**
   * Add money to an existing account.
   * 
   * @param {string} id 
   * @param {number} amount 
   */
  function addMoney(id, amount) {
    for (let acc of accounts) {
      if (acc.id === id) {
        acc.addMoney(amount);
        break;
      }
    }
    setAccounts(accounts);
    stopDialog();
  }

  /**
   * Remove money from an existing account.
   * 
   * @param {string} id 
   * @param {number} amount 
   */
  function removeMoney(id, amount) {
    for (let acc of accounts) {
      if (acc.id === id) {
        acc.removeMoney(amount);
        break;
      }
    }
    setAccounts(accounts);
    stopDialog();
  }

  /**
   * Transfers money from one account to another
   * 
   * @param {string} sourceId account id of account to take money from
   * @param {string} targetId account id of account to tranfer money to 
   * @param {number} amount amount of money to transfer
   */
  function transferMoney(sourceId, targetId, amount) {
    for (let acc of accounts) {
      if (acc.id === sourceId) 
        acc.removeMoney(amount);
      if (acc.id === targetId) 
        acc.addMoney(amount);      
    }
    setAccounts(accounts);
    stopDialog();
  }

  function handleTransfer(element) {
    if (accounts.length > 1)
      startDialog("transfer", element, {accounts: accounts});
    else 
      startDialog("alert", element,
        {msg : "You need at least 2 accounts to transfer",
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
          <button 
            id="add-account"
            onClick={() => startDialog("create", "add-account") }
          >
            Add Account
          </button>
          <button 
            id="transfer"
            onClick={() => handleTransfer("transfer")} 
          >
            Transfer
          </button>
        </section>
      </div>

      {dialog}
    </div>
   
  );
}


export default App;