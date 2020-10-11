import React, { useState, useRef } from "react"
import { Form, validateAllFields } from "./Form"
import {TextFormField, MoneyFormField} from "./FormFields"


/**
 * Form for editing an existing account.
 * 
 * @param {object} props expected props:
 * - {string} id account id
 * - {function} onSubmit: callback for form submission
 * - {function} onCancel: callback for form cancellation
 * 
 * @param {object} ref form will fill this with focus target
 */
function AddForm(props, ref) {
    const [transactName, setTransactName] = useState("");
    const [addAmount, setAddAmount] = useState("0");
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

    const addAmountField = (
        <MoneyFormField
            label={"Amount"}
            value={addAmount}
            required={true}
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
                stateFunc = setAddAmount;
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
        props.onSubmit(props.id, Number(addAmount),transactName);
    }

    return (
        <Form
            onSubmit={handleSubmit}
            onCancel={props.onCancel}
            errorMessage={errorMessage}
            submitButtonText={"Add"}
        >
            {transactNameField}
            {addAmountField}
        </Form>
    );
}

AddForm = React.forwardRef(AddForm);

export default AddForm;