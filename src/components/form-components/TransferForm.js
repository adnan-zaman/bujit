import React, { useState, useRef } from "react"
import { AccountSelectFormField, MoneyFormField } from "./FormFields"
import { Form, validateAllFields } from "./Form"

/**
 * Form for editing an existing account.
 * 
 * @param {object} props expected props:
 * - {object} accountData: data to be passed to form
 * - {function} onSubmit: callback for form submission
 * - {function} onCancel: callback for form cancellation
 * 
 * @param {object} ref form will fill this with focus target
 */
function TransferForm(props, ref) {
    //AccountSelectFormField's value corresponds to the selected account's id
    const [sourceAcc, setSourceAcc] = useState(props.accountData[0].id);
    const [targetAcc, setTargetAcc] = useState(props.accountData[0].id);
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
            accounts={props.accountData}
            ref={{current: {focus : ref, validate: validateFuncs.current[0]}}}
        />
    );

    const targetAccField =(
        <AccountSelectFormField
            label={"To"}
            value={targetAcc}
            onChange={handleChange}
            required={true}
            accounts={props.accountData}
            ref={{current: {focus : ref, validate: validateFuncs.current[1]}}}
        />
    );

    const transferAmountField =(
        <MoneyFormField
            label={"Amount"}
            value={transferAmount}
            onChange={handleChange}
            required={true}
            max={getAccount(sourceAcc).balance}
            associatedAccount={getAccount(sourceAcc).name}
            ref={{current: {focus : ref, validate: validateFuncs.current[2]}}}
        />
    );

    /**
     * Gets an account from props.accountData
     * 
     * @param {string} id account id
     * @returns {AccountData} the account with the given account id 
     */
    function getAccount(id) {
        for (const acc of props.accountData) {
            if (acc.id === id)
                return acc;
        }
    }
  
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
        props.onSubmit(sourceAcc, targetAcc, Number(transferAmount));
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