import React, { useState, useRef } from "react"
import { Form, validateAllFields } from "./Form"
import {TextFormField, PercentFormField} from "./FormFields"


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
function EditForm(props, ref) {
    const [accName, setAccName] = useState(props.accountData.name);
    const [accPercent, setAccPercent] = useState(props.accountData.percent);
    const [errorMessage, setErrorMessage] = useState("");
    //will be passed down to form fields to get their validation functions
    const validateFuncs = useRef([
                            {validateFunc : undefined}, 
                            {validateFunc : undefined}
                          ]);

    const accNameField =(
        <TextFormField
            label={"New Name"}
            value={accName}
            onChange={handleChange}
            required={true}
            ref={{current: {focus : ref, validate: validateFuncs.current[0]}}}
        />
    );

    const accPercentField = (
        <PercentFormField
            label={"New Percent"}
            value={accPercent}
            required={false}
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
            case "New Name":
                stateFunc = setAccName;
                break;
            case "New Percent":
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
        props.onSubmit(props.accountData.id, accName, Number(accPercent));
    }

    return (
        <Form
            onSubmit={handleSubmit}
            onCancel={props.onCancel}
            errorMessage={errorMessage}
            submitButtonText={"Save"}
        >
            {accNameField}
            {accPercentField}
        </Form>
    );
}

EditForm = React.forwardRef(EditForm);

export default EditForm;