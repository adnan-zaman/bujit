import React from "react"

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
        <div>
            <label htmlFor={props.id}>
                <span className="visually-hidden">
                    Amount
                    {(props.type === "add") ? "added" :
                     (props.type === "subtract") ? "removed" :
                     "transfered"
                    }
                </span>
            </label>
            <input 
                id={props.id}
                className={(props.type === "add" | "transfer-in") ? "gain" : "loss"}
                value={props.amount} 
                type="number" 
                disabled={true}/>
            <div>{props.name}</div>
            <div>{(props.type === "transfer-in") ? `Transferred from ${props.other}` :
                  `Transferred to ${props.other}`}</div>
        </div>
    );
}

export default Transaction;