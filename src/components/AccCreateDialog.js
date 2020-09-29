import React, { useState } from "react";
import "./AccCreateDialog.css"


function AccCreateDialog(props){

    //new account name
    const [accName,setAccName] = useState("");
    //new account starting balance
    const [accBal,setAccBal] = useState("0");
    //new account pay percentage
    const [accPercent,setAccPercent] = useState("0");

    function handleSubmit(e) {
        e.preventDefault();
        //remove leading zeroes if there are other characters after it
        const bal = accBal.replace(/^0+([^0]+)/,'$1','');
        props.onCreate(accName,bal,Number(accPercent));
    }

    
 
    //updates states when input fields change
    function handleChange(e) {
        let setFunc = () => undefined;
        let state = e.target.value;

        //different hook and state depending on input id
        switch (e.target.id) {
            case "name-input":
                setFunc = setAccName;
                state = accName;
                break;
            case "bal-input":
                setFunc = setAccBal;
                state = accBal;
                break;
            case "percent-input":
                setFunc = setAccPercent;
                state = accPercent;
                break;
        }
        
        
        setFunc(e.target.value);
        e.target.value = state;
    }
    
    return(
        <div className="acc-create-dialog">
            <form onSubmit={handleSubmit}>
                <ul>
                    <li>
                        <label htmlFor="name-input">Account Name:</label>
                        <input 
                            type="text" 
                            id="name-input" 
                            name="name-input" 
                            value={accName}
                            required={true}
                            onChange={handleChange}
                        /> 
                    </li>
                    <li>
                        <label htmlFor="bal-input">Starting Balance:</label>
                        <input
                            type="text" 
                            id="bal-input" 
                            name="bal-input" 
                            value={accBal}
                            pattern="[0-9]*(\.[0-9][0-9])?"
                            onChange={handleChange}
                        /> 
                    </li>
                    <li>  
                        <label htmlFor="percent-input">Pay Percentage:</label>
                        <input 
                            type="number" 
                            id="percent-input" 
                            name="percent-input" 
                            value={accPercent}
                            min="0"
                            max="100"
                            onChange={handleChange}
                        />
                    </li>
                </ul>
                <button type="button" onClick={props.onCancel}>Cancel</button>
                <button type="submit">Create</button>

            </form>
        </div>
    );
}


export default AccCreateDialog;