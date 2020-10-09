import React, { useState, useRef } from "react"
import Form from "./Form"
import {TextFormField, MoneyFormField} from "./form-fields/FormFields"


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
    const [errorMessage, setErrorMessage] = useState("");
    const validateFuncs = useRef([{validateFunc : undefined}, {validateFunc : undefined}]);

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
  

    function handleChange(e, id) {
        let stateFunc;
        switch (id) {
            case "Account Name":
                stateFunc = setAccName;
                break;
            case "Starting Balance":
                stateFunc = setAccBal;
                break;
        }
        stateFunc(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        for (const f of validateFuncs.current) {
            const [valid, error] = f.validateFunc();
            if (!valid) {
                setErrorMessage(error)
                return;
            }
        }
        props.onSubmit(accName, Number(accBal));
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
        </Form>
    );
}

CreateForm = React.forwardRef(CreateForm);

export default CreateForm;