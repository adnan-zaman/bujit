import React from "react"
import "./Account.css"


function Account(props) {
    return (
        <div className='acc-container' id={props.id}>
            <label htmlFor='bal' className='acc-name'>{props.name}</label>
            <input 
                id='bal' 
                type='text' 
                className='acc-bal' 
                value={"$" + props.balance} 
                disabled={true}
            />
                
            <label htmlFor='percent' className='percent-label'>Percentage</label>   
            <input 
                id='percent' 
                className='acc-percent' 
                type='text'  
                value={props.percentage + "%"} 
                disabled={true}
            />            
            <button className='acc-add'>
                + <span className='visually-hidden'>Add Money to {props.name}</span>
            </button>
            <button className='acc-remove'>
                - <span className='visually-hidden'>Take Money from {props.name}</span>
            </button>
            <button className='acc-history'>
                i <span className='visually-hidden'>Transaction History for {props.name}</span>
            </button>
            <button className='acc-edit'>
                Edit
                <span className='visually-hidden'>info for {props.name}</span>  
            </button>
            <button className='acc-delete' onClick={() => props.onDelete(props.id)}>
                Delete
                <span className='visually-hidden'>{props.name}</span> 
            </button>
        
            
        </div>
    );
}


export default Account;