import React from "react"
import Transaction from "./Transaction"
import "../Dialog.css"


/**
 * Alert displaying an account's transaction history
 * 
 * @param {object} props required props:
 * - name {string}: account name
 * - transactions {TransactionData[]} account's transactions
 * - onCancel {function} callback for alert's OK button
 * 
 * @param {object} ref the focus target
 */
function TransactionHistoryAlert(props, ref) {
    
    const transactList = props.transactions.map((transact, index) =>
        <Transaction
            key={index}
            id={index}
            amount={transact.amount}
            type={transact.type}
            name={transact.name}
            other={transact.other}
        />         
    );

    return (
        <div className="alert vert-flex-container">
            <h2>Transaction History: {props.name}</h2>
            <div>
                {transactList}
            </div>
            <div className="button-container">
                <div className="button-holder">
                    <button onClick={props.onCancel} ref={ref}>OK</button>
                </div>
            </div>
        </div>
    );
}

TransactionHistoryAlert = React.forwardRef(TransactionHistoryAlert);

export default TransactionHistoryAlert;