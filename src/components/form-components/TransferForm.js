import React, { useState, useRef } from "react"
import { AccountSelectFormField, MoneyFormField } from "./FormFields"
import { Form, validateAllFields } from "./Form"

/**
 * Form for editing an existing account.
 * Assumes there are at least 2 accounts.
 * 
 * @param {object} props expected props:
 * - {array} accounts: array of AccountData objects
 * - {function} onSubmit: callback for form submission
 * - {function} onCancel: callback for form cancellation
 * 
 * @param {object} ref form will fill this with focus target
 */
function TransferForm(props, ref) {
    
    //AccountSelectFormField's value corresponds to the selected account's index 
    const [sourceAcc, setSourceAcc] = useState("0");
    const [targetAcc, setTargetAcc] = useState("1");
    const [transferAmount, setTransferAmount] = useState("0");
    const [errorMessage, setErrorMessage] = useState("");

    //will be passed down to form fields to get their validation functions
    const validateFuncs = useRef([
                            {validateFunc : undefined},
                            {validateFunc : undefined},  
                            {validateFunc : undefined}
                          ]);

    const sourceAccField =(
        <AccountSelectFormField
            label={"From"}
            value={sourceAcc}
            onChange={handleChange}
            required={true}
            accounts={props.accounts}
            ref={{current: {focus : ref, validate: validateFuncs.current[0]}}}
        />
    );

    const targetAccField =(
        <AccountSelectFormField
            label={"To"}
            value={targetAcc}
            onChange={handleChange}
            required={true}
            disabled={sourceAcc}
            accounts={props.accounts}
            ref={{current: {validate: validateFuncs.current[1]}}}
        />
    );

    const transferAmountField =(
        <MoneyFormField
            label={"Amount"}
            value={transferAmount}
            onChange={handleChange}
            required={true}
            max={props.accounts[sourceAcc].balance}
            associatedAccount={props.accounts[sourceAcc].name}
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
            case "From":
                stateFunc = setSourceAcc;
                break;
            case "To":
                stateFunc = setTargetAcc;
                break;
            case "Amount":
                stateFunc = setTransferAmount;
                break;
        }
        
        stateFunc(e.target.value);

        //change targetAcc so that sourceAcc != targetAcc
        if (stateFunc === setSourceAcc && e.target.value === targetAcc)
            setTargetAcc((Number(targetAcc) + 1) % props.accounts.length + "");

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
        props.onSubmit(props.accounts[sourceAcc].id, props.accounts[targetAcc].id, Number(transferAmount));
    }

    return (
        <Form
            onSubmit={handleSubmit}
            onCancel={props.onCancel}
            errorMessage={errorMessage}
            submitButtonText={"Transfer"}
        >
            {sourceAccField}
            {targetAccField}
            {transferAmountField}
        </Form>
    );
}
TransferForm = React.forwardRef(TransferForm);

export default TransferForm;