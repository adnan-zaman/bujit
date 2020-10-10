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
   * Creates a dialog box of a specified type.
   * Changes values of focusTargets. 
   * 
   * @param {string} type type of dialog box (create, edit, transfer etc.)
   * @param {object} accData obj or obj[] containing data dialog
   * @param {*} element id of DOM element or DOM element itself
   */
  function startDialog(type, accData, element) {
    if (typeof element === "string")
      focusTargets.from.current = document.querySelector("#"+element);
    else
      focusTargets.from.current = element;
    let submitFunc;
    switch (type) {
      case "create":
        submitFunc = addAccount;
        break;
      case "edit":
        submitFunc = editAccount;
        break;
      case "add":
        submitFunc = addMoney;
        break;
      case "subtract":
        submitFunc = removeMoney;
        break;
    }
    setDialog(<Dialog 
      type={type}
      accountData={accData}
      onCancel={stopDialog}
      onSubmit={submitFunc}
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
      onDelete={deleteAccount}
      onEdit={(accData, element) => startDialog("edit", accData, element)}
      onAdd={(accData, element) => startDialog("add", accData, element)}
      onRemove={(accData, element) => startDialog("subtract", accData, element)}
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
            onClick={() => startDialog("create", {}, "add-account") }
          >
            Add Account
          </button>
        </section>
      </div>

      {dialog}
    </div>
   
  );
}


export default App;