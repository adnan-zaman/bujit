import React, { useState } from "react"
import { nanoid } from "nanoid"
import "./App.css"
import Account from "./components/Account"
import AccCreateDialog from "./components/AccCreateDialog"

    

function App(props) {

  //array of account objects
  const [accounts, setAccounts] = useState(props.accounts);

  //Add a new account object
  function addAccount(accName, startingBal = 0, startingPercent = 0.0) {
    const newAcc = {name : accName, 
      balance : startingBal, 
      percentage: startingPercent,
      id : nanoid()
    };
    setAccounts([...accounts, newAcc]);
  }

  //array of Account components 
  const accList = accounts.map(acc => 
    <Account 
      name={acc.name} 
      balance={acc.balance} 
      percentage={acc.percentage} 
      id={acc.id} 
      key={acc.id}
    />
  );

  return(
    <div className='app-container vert-flex-container'>
      <h1>Bujit</h1>
      <div className='app-main vert-flex-container'>
        <section className='acc-area'>
          {accList}
        </section>
        <section className='toolbar'>
          <button onClick={() => addAccount("")}>Add Account</button>
        </section>
      </div>
    </div>
  );
}


export default App;