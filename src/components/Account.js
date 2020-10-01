import React from "react"
import "./Account.css"


function Account(props) {
    return (
        <div className='acc-container' id={props.id}>
            <div className='acc-name'>{props.name}</div>
            <div className='acc-bal'>
               <span className='visually-hidden'>Balance for {props.name}</span> 
               ${props.balance}
            </div>
            <button className='acc-add'>
                + <span className='visually-hidden'>Add Money to {props.name}</span>
            </button>
            <button className='acc-remove'>
                - <span className='visually-hidden'>Take Money from {props.name}</span>
            </button>
            <button className='acc-history'>
                i <span className='visually-hidden'>Transaction History for {props.name}</span>
            </button>
            <div className='acc-percent'>
            <span className='visually-hidden'>Percentage for {props.name}</span> 
                {props.percentage}%
            </div>
            <button className='acc-delete' onClick={() => props.onDelete(props.id)}>
            <span className='visually-hidden'>Delete {props.name}</span> 
                Delete
            </button>
        </div>
    );
}


export default Account;