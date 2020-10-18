import React, { useState, useRef } from "react"
import { Form, validateAllFields } from "./Form"
import { MoneyFormField } from "./FormFields"


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
function PayForm(props, ref) {
    const [payAmount, setPayAmount] = useState("0");
    const [errorMessage, setErrorMessage] = useState("");
    //will be passed down to form fields to get their validation functions
    const validateFuncs = useRef([{validateFunc : undefined}]);


    const payField = (
        <MoneyFormField
            label={"Pay Amount"}
            value={payAmount}
            required={true}
            onChange={handleChange}   
            ref={{current: {focus : ref, validate: validateFuncs.current[0]}}}
        />
    );


    
    /**
     * Handles change on form fields
     * 
     * @param {React.SyntheticEvent} e the event 
     * @param {string} id id of the DOM element that changed 
     */
    function handleChange(e, id) {
        setPayAmount(e.target.value);
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
        props.onSubmit(Number(payAmount));
    }

    return (
        <Form
            onSubmit={handleSubmit}
            onCancel={props.onCancel}
            errorMessage={errorMessage}
            submitButtonText={"Get Paid!"}
        >
            {payField}
        </Form>
    );
}

PayForm = React.forwardRef(PayForm);

export default PayForm;