import React, { useState } from "react";
import "./FormDialog.css"

function FormDialog(props, ref){

    /* Setting up state */

    //form field labels
    let formVals;
    //different fields have different acceptance critera
    //text - anything goes
    //money - only up to two decimal places, numbers only
    //percentage - 0 to 100, numbers only
    let formTypes;
    //whether the form fields are required or not
    let formReqs;


    let submitBtnText;
    
    //set up formValues depending on desired dialog type
    if (props.type === "create") {
        formVals = {
            "Account Name" : "", 
            "Starting Balance" : "0",
            "Pay Percentage" : "0"
        };
        formTypes = ["text","money","percent"];
        formReqs = [true,false,false];
        submitBtnText = "Create";
    }
    else if (props.type === "edit") {
        formVals = {
            "Account Name" : props.accountData.name, 
            "Pay Percentage" : props.accountData.percent + ""
        };
        formTypes = ["text","percent"];
        formReqs = [true,false];
        submitBtnText = "Save";
    }
    else if (props.type === "add") {
        formVals = {
            "Amount" : ""
        };
        formTypes = ["money"];
        formReqs = [false];
        submitBtnText = "Add";
    }
    else if (props.type === "remove") {
        formVals = {
            "Amount" : ""
        };
        formTypes = ["money"];
        formReqs = [false];
        submitBtnText = "Remove";
    }

    //all form fields
    let formContents = [];

    //the number and type of form fields varies depending on props.type
    //each field's corresponding state is stored in the object
    //a form field consists of a label and its corresponding input
    //format: {form field label: form field value}
    const [formValues,setFormValues] = useState(formVals);
    const formLabels = Object.keys(formValues);
    for (let i = 0; i < formLabels.length; i++)
        formContents.push(createFormElement(formTypes[i], formLabels[i], i, formReqs[i], i === 0));
    

    /**
     * Creates a form field (label/input combo) wrapped in a <li> to be
     * inserted into form. 
     * 
     * @param {string} inputType type of field (text,money,percentage)
     * @param {string} labelName the field name
     * @param {boolean} required is this field required
     * @param {boolean} focusTarget is this the focus target when dialog is mounted
     * @returns a JSX li element
     * 
     */
    function createFormElement(inputType, labelName, index, required = false, focusTarget = false) {
        const label = <label htmlFor={labelName}>{labelName + ":"}</label>;
        
        let refTarget = focusTarget? ref : null;
        let className = inputType;
        let numProps = {};

        //conditional attributes for numbers
        if (inputType === "money" || inputType === "percent") {
            className += " num";
            numProps.type = "number";
            numProps.min = "0";
            
            if (inputType === "percent") 
                numProps.max = "100";
            else {
                numProps.step = "0.01";
                if (props.type === "remove")
                    numProps.max = props.accountData.balance;
            }
                
        };
        
        const input = ( 
            <input
                id={labelName}
                className={className}
                value={formValues[labelName]}
                required={required} 
                onChange={handleChange}
                ref={refTarget}
                type={"text"}
                {...numProps}
            />
        );

        return (
            <li key={index}>
                {label}
                {input}
            </li>
        );
                        


    }

    const [errorMsg,setErrorMsg] = useState("");
    /**
     * Handles form submission
     * 
     * @param {React.SyntheticEvent} e a SyntheticEvent object
     */
    function handleSubmit(e) {
        e.preventDefault();

        if (!validateInputs())
            return;

        //different params will be expected depending on what kind of dialog this is
        if (props.type === "create") {
            props.onSubmit(
                formValues["Account Name"], 
                Number(formValues["Starting Balance"]), 
                Number(formValues["Pay Percentage"])
            );
        }
        else if (props.type === "edit") {
            props.onSubmit(
                props.accountData.id, 
                formValues["Account Name"], 
                Number(formValues["Pay Percentage"]));
        }
        else if (props.type === "add") {
            props.onSubmit(props.accountData.id, formValues["Amount"]);
        }
        else if (props.type === "remove") {
            props.onSubmit(props.accountData.id, formValues["Amount"]);
        }
        
    }    

    /**
     * Iterates through formValues and validates
     * input depending on type of input (money,percent etc.)
     * and dialog type. Sets error message.
     * 
     * @returns {Boolean} true if form is valid, false otherwise
     */
    function validateInputs()
    {
        for (let l in formValues) {
            const element = document.querySelector(`input[id="${l}"]`);
            const validityState = element.validity;

            //required
            if (validityState.valueMissing) {
                setErrorMsg(`${l} is required`);
                return false;
            } 
            //negative number
            else if (validityState.rangeUnderflow) {
                setErrorMsg(`${l} must be greater than or equal to ${element.min}`);
                return false;
            }  
            //value too high 
            //(balance not enough or percentage > 100)
            else if (validityState.rangeOverflow) {
                const msg = (props.type === "remove") 
                            ? `${props.accountData.name} doesn't have sufficient funds` 
                            : `${l} must be less than or equal to ${element.max}`;
                setErrorMsg(msg);
                return false;
            }       
            //
            else if (validityState.stepMismatch) {
                setErrorMsg(`${l} must be 2 decimal places`);
                return false;
            }
            
        }
        return true;
    }
 
    /**
     * Updates form field and corresponding
     * state when there is a change in value
     * 
     * @param {*} e 
     */
    function handleChange(e) {
        let newValues = {...formValues};
        newValues[e.target.id] = e.target.value;
        setFormValues(newValues);
    }
   
    return(
        
            <div className="dialog">
                <form onSubmit={handleSubmit} noValidate={true}>
                    <ul>
                        {formContents}           
                    </ul>
                    <button type="button" onClick={props.onCancel}>Cancel</button>
                    <button type="submit">{submitBtnText}</button>
                </form>
                <p className="error-msg" aria-live={"polite"}>{errorMsg}</p>
            </div>
        
       
    );
}

FormDialog = React.forwardRef(FormDialog);

export default FormDialog;

