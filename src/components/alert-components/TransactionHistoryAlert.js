import React from "react"
import Transaction from "./Transaction"
import "../Dialog.css"
import "../../App.css"
import "./Transaction.css"


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
            //leave out day of the week
            date={transact.date.toDateString().substring(transact.date.toDateString().indexOf(' '))} 
        />         
    );

    return (
        <div className="alert vert-flex-container">
            <h2>Transaction History: {props.name}</h2>
            <div className="transact-area">
                {
                    (transactList.length > 0) ? 
                     transactList :
                     <p>There are no transactions for this account.</p>
                }
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