import React, { useState, useRef } from "react"
import { Form, validateAllFields } from "./Form"
import {TextFormField, MoneyFormField} from "./FormFields"


/**
 * Form for editing an existing account.
 * 
 * @param {object} props expected props:
 * - {string} id: account id
 * - {string} name: account name
 * - {number} balance: account balance
 * - {function} onSubmit: callback for form submission
 * - {function} onCancel: callback for form cancellation
 * 
 * @param {object} ref form will fill this with focus target
 */
function SubtractForm(props, ref) {
    const [transactName, setTransactName] = useState("");
    const [subAmount, setsubAmount] = useState("0");
    const [errorMessage, setErrorMessage] = useState("");
    //will be passed down to form fields to get their validation functions
    const validateFuncs = useRef([
                            {validateFunc : undefined},
                            {validateFunc : undefined}
                          ]);

    const transactNameField = (
    <TextFormField
        label={"Transaction Name"}
        value={transactName}
        required={true}
        onChange={handleChange}   
        ref={{current: {focus: ref, validate: validateFuncs.current[0]}}}
    />
    );

    const subAmountField = (
        <MoneyFormField
            label={"Amount"}
            value={subAmount}
            required={true}
            max={props.balance}
            associatedAccount={props.name}
            onChange={handleChange}   
            ref={{current: {validate: validateFuncs.current[1]}}}
        />
    );
  
    /**
     * Handles change on form fields
     * 
     * @param {React.SyntheticEvent} e the event 
     * @param {string} id id of the DOM element that changed 
     */
    function handleChange(e, id) {
        let stateFunc;
        switch (id) {
            case "Transaction Name":
                stateFunc = setTransactName;
                break;
            case "Amount":
                stateFunc = setsubAmount;
                break;
        }
        stateFunc(e.target.value);
    }

    /**
     * Handles form submission
     * 
     * @param {React.SyntheticEvent} e the event
     */
    function handleSubmit(e) {
        e.preventDefault();
        if (!validateAllFields(validateFuncs.current, setErrorMessage)[0])
            return; 
        props.onSubmit(props.id, Number(subAmount),transactName);
    }

    return (
        <Form
            onSubmit={handleSubmit}
            onCancel={props.onCancel}
            errorMessage={errorMessage}
            submitButtonText={"Subtract"}
        >
            {transactNameField}
            {subAmountField}
        </Form>
    );
}

SubtractForm = React.forwardRef(SubtractForm);

export default SubtractForm;