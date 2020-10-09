import React from "react"
import "./AccountSelect.css"



function AccountSelect(props, ref)
{
    //accounts as options
    const options = props.accounts.map(acc => <option value={acc.id}>{acc.name}</option>);

    function handleChange(e) {
        props.onChange(e.target.value);
        props.changeMax && props.changeMax(e.target.value);
    }

    return (
        <select 
            id={props.id} 
            className={props.className} 
            required={props.required} 
            onChange={handleChange} 
            value={props.value}
            ref={ref}
        >
            {options}
        </select>
    );
}



AccountSelect = React.forwardRef(AccountSelect);

export default AccountSelect;