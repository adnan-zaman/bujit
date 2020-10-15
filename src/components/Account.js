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
                value={props.percent + "%"} 
                disabled={true}
            />            
            <button id={'add-'+props.id}
                className='acc-add' 
                onClick={() => 
                    props.onAdd(
                        {id: props.id}, 
                        'add-'+props.id)
                }
            >
                + <span className='visually-hidden'>Add Money to {props.name}</span>
            </button>
            <button id={'remove-'+props.id}
                className='acc-remove' 
                onClick={() => 
                    props.onRemove(
                        {id: props.id, balance: props.balance, name : props.name}, 
                        'remove-'+props.id)
                }
            >
                - <span className='visually-hidden'>Take Money from {props.name}</span>
            </button>
            <button 
                id={"history-"+props.id}
                className='acc-history'
                onClick={() =>
                    props.onHistory(
                        {id : props.id, name: props.name},
                        "history-"+props.id
                    )
                }
            >
                i <span className='visually-hidden'>Transaction History for {props.name}</span>
            </button>
            <button 
                id={'edit-'+props.id}
                className='acc-edit' 
                onClick={() => 
                    props.onEdit(
                        {id: props.id, name: props.name, percent: props.percent}, 
                        'edit-'+props.id)
                }
            >
                Edit
                <span className='visually-hidden'>info for {props.name}</span>  
            </button>
            <button 
                id={'del-'+props.id} 
                className='acc-delete' 
                onClick={() => props.onDelete(props.id, props.name,'del-'+props.id)}>
                Delete
                <span className='visually-hidden'>{props.name}</span> 
            </button>
        
            
        </div>
    );
}


export default Account;