import React, { useState, useRef, useEffect } from "react"
import { nanoid } from "nanoid"
import "./App.css"
import Account from "./components/Account"
import AccCreateDialog from "./components/AccCreateDialog"
import Dialog from "./components/Dialog"

    
/**
 * Creates an object holding refs relating to different states where
 * focus can change. The refs should be passed down to elements and components
 * who will set the ref to whatever element should be initially focused when that component 
 * mounts.
 * 
 * @param {string[]} focusStates names of states where focus changes
 * @returns {object} object that maps each given focus state to a ref to be passed to elements
 */
function useFocusTargets(focusStates) {
  const focusTargets = useRef({});
  
  //focusStates will never change so using hooks will be safe 
  for (let fs of focusStates) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    focusTargets.current[fs] = useRef();
  }

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

  /* Account Data */
  
  //array of account objects
  const [accounts, setAccounts] = useState(props.accounts);

   //array of Account components 
   const accList = accounts.map(acc => 
    <Account 
      name={acc.name} 
      balance={acc.balance} 
      percentage={acc.percentage} 
      id={acc.id} 
      key={acc.id}
      onDelete={deleteAccount}
    />
  );

  /* Account Creation/Deletion */

  //whether or not user is creating a new account
  const [isCreating, setIsCreating] = useState(false);
  //whether or not user was creating an account last render
  const wasCreating = usePrevious(isCreating);
  
  //Add a new account object
  function addAccount(accName, startingBal = 0, startingPercent = 0.0) {
    const newAcc = {
      name : accName, 
      balance : startingBal, 
      percentage: startingPercent,
      id : nanoid()
    };
    setAccounts([...accounts, newAcc]);
    setIsCreating(false);
  }

  //Delete an account object
  function deleteAccount(id) {
    const updatedAccounts = accounts.filter((acc) => acc.id !== id);
    setAccounts(updatedAccounts);
  }

  /* Focus Management */
  
  //DOM elements to focus on when switching states
  const focusTargets = useFocusTargets(["isCreating","cancelCreating"]);
  
  //manage focus
  useEffect(() => {
    if (!wasCreating && isCreating) 
      focusTargets.isCreating.current.focus(); 
    else if (wasCreating && !isCreating) 
      focusTargets.cancelCreating.current.focus(); 
  });

   /* Setting up dialog box */

   let dialog = null;
   let isEditing = true;
   //account creation dialog
   if (isCreating) {
     dialog = <Dialog
       type={"create"}
       onSubmit={addAccount}
       onCancel={() => setIsCreating(false)}
       ref={focusTargets.isCreating}
     />
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
          <button onClick={() => setIsCreating(true)} ref={focusTargets.cancelCreating} >Add Account</button>
        </section>
      </div>
      {
        dialog
      }
    </div>
   
  );
}


export default App;