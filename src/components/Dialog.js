import React, { useState } from "react";
import "./Dialog.css"

function Dialog(props, ref){

    let formVals;
    let formTypes;
    let formReqs;
    
    //set up formValues depending on desired dialog type
    if (props.type === "create") {
        formVals = {
            "Account Name" : "", 
            "Starting Balance" : "0",
            "Pay Percentage" : "0"
        };
        formTypes = ["text","money","percent"];
        formReqs = [true,false,false];
    }

    else if (props.type === "edit") {
        formVals = {
            "Account Name" : props.accountName, 
            "Pay Percentage" : props.accountPercent
        };
        formTypes = ["text","money"];
        formReqs = [false,false];
    }
    
    let formContents = [];

    //the number and type of fields varies depending on props.type
    //each fields corresponding state is stored in the object
    const [formValues,setFormValues] = useState(formVals);

    const formLabels = Object.keys(formValues);
    console.log(formLabels);
    for (let i = 0; i < formLabels.length; i++)
    {
        formContents.push(createFormElement(formTypes[i], formLabels[i], i, formReqs[i], i == 0));
    }

    /**
     * Creates a label/input combo wrapped in a <li> to be
     * inserted into form. 
     * 
     * @param {string} inputType type of field (text,money,percentage)
     * @param {string} labelName the field name
     * @param {boolean} required is this field required
     * @param {boolean} focusTarget is this the focus target
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
        if (inputType === "money")
            pattern = "[0-9]*(\.[0-9][0-9])?"
        else if (inputType === "percent") 
            pattern = "100|[0-9]?[0-9]";
        
        const input = <input
                        id={labelName}
                        className={className}
                        value={formValues[labelName]}
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

    function handleSubmit(e) {
        e.preventDefault();
        // props.onCreate(accName,parseFloat(accBal),Number(accPercent));
    }    
 
    //updates states when input fields change
    function handleChange(e) {
        // let setFunc = () => undefined;
        // let state = e.target.value;

        // //different hook and state depending on input id
        // switch (e.target.id) {
        //     case "name-input":
        //         setFunc = setAccName;
        //         state = accName;
        //         break;
        //     case "bal-input":
        //         setFunc = setAccBal;
        //         state = accBal;
        //         break;
        //     case "percent-input":
        //         setFunc = setAccPercent;
        //         state = accPercent;
        //         break;
        // }
        
        
        // setFunc(e.target.value);
    }
    
    return(
        
            <div className="dialog">
                <form onSubmit={handleSubmit}>
                    <ul>
                        {formContents}           
                    </ul>
                    <button type="button" onClick={props.onCancel}>Cancel</button>
                    <button type="submit">Create</button>
                </form>
            </div>
        
       
    );
}

Dialog = React.forwardRef(Dialog);

export default Dialog;

/*
<li>
                            <label htmlFor="name-input" >Account Name:</label>
                            <input 
                                type="text" 
                                id="name-input" 
                                name="name-input" 
                                value={accName}
                                required={true}
                                onChange={handleChange}
                                ref={ref}
                            /> 
                        </li>
                        <li>
                            <label htmlFor="bal-input">Starting Balance:</label>
                            <input
                                id="bal-input" 
                                name="bal-input" 
                                value={accBal}
                                pattern="[0-9]*(\.[0-9][0-9])?"
                                onChange={handleChange}
                            /> 
                        </li>
                        <li>  
                            <label htmlFor="percent-input">Pay Percentage:</label>
                      
                            <input 
                                type="number" 
                                id="percent-input" 
                                name="percent-input" 
                                value={accPercent}
                                min="0"
                                max="100"
                                onChange={handleChange}
                            />
                        </li>
 */