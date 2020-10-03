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
        if (inputType == "money" || inputType == "percent")
            className += " num";

        let pattern = ".*";
        //only numbers up to two decimal places
        if (inputType === "money")
            pattern = "[0-9]*(\.[0-9][0-9])?"
        //only numbers between 0 and 100
        else if (inputType === "percent") 
            pattern = "100|[0-9]?[0-9]";
        
        const input = <input
                        id={labelName}
                        className={className}
                        value={formValues[labelName]}
                        pattern={pattern}
                        required={required} 
                        onChange={handleChange}
                        ref={refTarget}
                      />

        return (
            <li key={index}>
                {label}
                {input}
            </li>
        );
                        


    }

    /**
     * Handles form submission
     * 
     * @param {React.SyntheticEvent} e a SyntheticEvent object
     */
    function handleSubmit(e) {
        e.preventDefault();
        //different params will be expected depending on what kind of dialog this is
        if (props.type === "create") {
            props.onSubmit(
                formValues["Account Name"], 
                parseFloat(formValues["Starting Balance"]), 
                Number(formValues["Pay Percentage"])
            );
        }
        else if (props.type === "edit") {
            props.onSubmit(
                props.accountData.id, 
                formValues["Account Name"], 
                Number(formValues["Pay Percentage"]));
        }
        
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
                <form onSubmit={handleSubmit}>
                    <ul>
                        {formContents}           
                    </ul>
                    <button type="button" onClick={props.onCancel}>Cancel</button>
                    <button type="submit">{submitBtnText}</button>
                </form>
            </div>
        
       
    );
}

FormDialog = React.forwardRef(FormDialog);

export default FormDialog;

