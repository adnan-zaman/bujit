import React, { useState, useRef } from "react"
import { Form, validateAllFields } from "./Form"
import {TextFormField, MoneyFormField, PercentFormField} from "./FormFields"


/**
 * Form for creating a new account.
 * 
 * @param {object} props expected props:
 * - {object} accountData: data to be passed to form
 * - {function} onSubmit: callback for form submission
 * - {function} onCancel: callback for form cancellation
 * 
 * @param {object} ref form will fill this with focus target
 */
function CreateForm(props, ref) {
    const [accName, setAccName] = useState("");
    const [accBal, setAccBal] = useState("0");
    const [accPercent, setAccPercent] = useState("0");
    const [errorMessage, setErrorMessage] = useState("");
    //will be passed down to form fields to get their validation functions
    const validateFuncs = useRef([
                            {validateFunc : undefined}, 
                            {validateFunc : undefined},
                            {validateFunc : undefined}
                          ]);

    const accNameField =(
        <TextFormField
            label={"Account Name"}
            value={accName}
            onChange={handleChange}
            required={true}
            ref={{current: {focus : ref, validate: validateFuncs.current[0]}}}
        />
    );

    const accBalField = (
        <MoneyFormField
            label={"Starting Balance"}
            value={accBal}
            required={false}
            onChange={handleChange}   
            ref={{current: {validate: validateFuncs.current[1]}}}
        />
    );

    const accPercentField = (
        <PercentFormField
            label={"Starting Percent"}
            value={accPercent}
            required={false}
            onChange={handleChange}   
            ref={{current: {validate: validateFuncs.current[2]}}}
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
            case "Account Name":
                stateFunc = setAccName;
                break;
            case "Starting Balance":
                stateFunc = setAccBal;
                break;
            case "Starting Percent":
                stateFunc = setAccPercent;
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
        props.onSubmit(accName, Number(accBal), Number(accPercent));
    }

    return (
        <Form
            onSubmit={handleSubmit}
            onCancel={props.onCancel}
            errorMessage={errorMessage}
            submitButtonText={"Create"}
        >
            {accNameField}
            {accBalField}
            {accPercentField}
        </Form>
    );
}

CreateForm = React.forwardRef(CreateForm);

export default CreateForm;