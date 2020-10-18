import React from "react"
import "../../App.css"

/**
 * Visually displays a transaction
 * 
 * @param {object} props expected props
 * - amount {number} transaction amount
 * - type {string} type of transaction
 * - name (optional) {string} name of transaction
 * - other (optional) {string} other account's name
 * - date {Date} transaction date
 * - id {string} this Transaction's id
 */
function Transaction(props) {
    return (
        <div className="transaction list-element clearfix"> 
            <label htmlFor={props.id}>
                <span className="visually-hidden">
                    Amount
                    {
                     (props.type === "add" || props.type === "pay") ? "added" :
                     (props.type === "subtract") ? "removed" :
                     "transfered"
                    }
                </span>
            </label>
            <input 
                id={props.id}
                className={(props.type === "add" || 
                            props.type === "transfer-in" || 
                            props.type === "pay") ? "gain" : "loss"
                          }
                value={props.amount} 
                type="number" 
                disabled={true}/>
            
            <p>{props.name}</p>
            {
                props.other &&
                <p>{(props.type === "transfer-in") ? `Transferred from ${props.other}` :
                    `Transferred to ${props.other}`}
                </p>
            }
            <p>
                <span className="visually-hidden">Transaction Date</span>
                {props.date}
            </p>
        </div>
    );
}

export default Transaction;