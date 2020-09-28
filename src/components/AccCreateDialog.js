import React, { useState } from "react";
import "./AccCreateDialog.css"


function AccCreateDialog(props){

    function handleSubmit(e) {
        e.preventDefault();
        props.onCreate('hoho',20,21);
    }

    return(
        <div className="acc-create-dialog">
            <form onSubmit={handleSubmit}>
                <ul>
                    <li>
                        <label for="name-input">Account Name:</label>
                        <input type="text" id="name-input" name="name-input"></input> 
                    </li>
                    <li>
                        <label for="bal-input">Starting Balance:</label>
                        <input type="text" id="bal-input" name="bal-input"></input> 
                    </li>
                    <li>  
                        <label for="percent-input">Pay Percentage:</label>
                        <input type="text" id="percent-input" name="percent-input"></input> 
                    </li>
                </ul>
                <button type="button">Cancel</button>
                <button type="submit">Create</button>

            </form>
        </div>
    );
}


export default AccCreateDialog;