import React from "react"

/**
 * Form field for taking text input
 * 
 * @param {object} props expected props:
 * - {string} label: form element label
 * - {string} value: form element's input's value
 * - {function} onChange: callback for when input value changes
 * - {boolean} required: whether or not this form element is required
 * 
 * @param {object} ref ref format: {focus : (ref), validate : {validateFunc : ...}}
 * - focus (optional) : should contain focus target if you want this form field to be
 *                      the focus
 * - validate.validateFunc: form field will fill this with a callback that validates it's input 
 */
function TextFormField(props, ref) {

  
    ref.current.validate.validateFunc = validate;

    /**
     * Validates this form field.
     * 
     * @return {array}
     * - [0] {boolean}: true if form passes, false if error
     * - [1] {string}: if form has error, will contain error message, otherwise empty string
     */
    function validate() {
        const element = document.querySelector(`input[id="${props.label}"]`);
        const validityState = element.validity;

        return [!validityState.valueMissing, 
                validityState.valueMissing ? `${props.label} is required` : ""
               ];
    }

    return (
        <li>
            <label htmlFor={props.label}>{props.label + ":"}</label>
            <input
                id={props.label}
                className={"text"}
                type={"text"}
                value={props.value}
                required={props.required} 
                onChange={(e) => props.onChange(e, props.label)}
                ref={ref.current.focus}
            />
        </li>
    );
}

/**
 * Form field for taking money input
 * 
 * @param {object} props expected props:
 * - {string} label: form element label
 * - {string} value: form element's input's value
 * - {boolean} required: whether or not this form element is required
 * - {number} min (default=0): minimum value
 * - {number} max (default=null): max value
 * - {string} associatedAccount (default=null): name of account if this money field
 * is associated with an account
 * - {function} onChange: callback for when input value changes
 * 
 * 
 * @param {object} ref ref format: {focus : (ref), validate : {validateFunc : ...}}
 * - focus (optional) : should contain focus target if you want this form field to be
 *                      the focus
 * - validate.validateFunc: form field will fill this with a callback that validates it's input 
 */
function MoneyFormField(props, ref) {

  
    ref.current.validate.validateFunc = validate;

    /**
     * Validates this form field.
     * 
     * @return {array}
     * - [0] {boolean}: true if form passes, false if error
     * - [1] {string}: if form has error, will contain error message, otherwise empty string
     */
    function validate() {
        const element = document.querySelector(`input[id="${props.label}"]`);
        const validityState = element.validity;

         //required
         if (validityState.valueMissing) {
            return [false, `${props.label} is required`]
        } 
        //negative number
        else if (validityState.rangeUnderflow) {
            return [false,`${props.label} must be greater than or equal to ${props.min ?? 0}`];        
        }  
        //value too high 
        else if (validityState.rangeOverflow) {         
            const msg = (props.associatedAccount) 
                        ? `${props.associatedAccount} doesn't have sufficient funds` 
                        : `${props.label} must be less than or equal to ${props.max}`;
            return [false,msg]; 
        }       
        //not 2 decimal places
        else if (validityState.stepMismatch) {
            return [false,`${props.label} must be 2 decimal places`]; 
        }

        return [true,""];
    }

    return (
        <li>
            <label htmlFor={props.label}>{props.label + ":"}</label>
            <input
                id={props.label}
                className={"num money"}
                type={"number"}
                value={props.value}
                min={props.min ?? 0}
                max={props.max}
                step={0.01}
                required={props.required} 
                onChange={(e) => props.onChange(e, props.label)}
                ref={ref.current.focus}
            />
        </li>
    );
}

TextFormField = React.forwardRef(TextFormField);
MoneyFormField = React.forwardRef(MoneyFormField);

export {TextFormField, MoneyFormField};