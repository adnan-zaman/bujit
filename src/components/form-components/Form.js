import React from "react"

/**
 * Generic form temlplate to be used by
 * Form Components. Form Fields should be children
 * of Form.
 * 
 * @param {objects} props expected props:
 * - {function} onSubmit: callback for form submission
 * - {function} onCancel: callback for form cancellation
 * - {string} errorMessage: error message to be dispayed
 * - {string} submitButtonText: text for submit button
 */
function Form(props) {
    return (
        <form onSubmit={props.onSubmit} noValidate={true}>
            <ul>
                {props.children}           
            </ul>
            <button type="button" onClick={props.onCancel}>Cancel</button>
            <button type="submit">{props.submitButtonText}</button>
            <p className="error-msg" aria-live="polite">{props.errorMessage}</p>
        </form>
        
    );

}

/**
 * Validates all Form Fields in a Form Component.
 * 
 * @param {Array} validateFuncs array of {validateFunc: f} objects where f is
 * a Form Field's validation function
 * @param {Function} setErrorMessage callback to set error message
 * @returns {array} 
 * - [0] : true if all fields valid, false otherwise
 * - [1] : empty string if all fields valid, error message of 
 * the first invalid field if invalid
 */
function validateAllFields(validateFuncs, setErrorMessage=undefined)
{
    for (const f of validateFuncs) {
        const [valid, error] = f.validateFunc();
        if (!valid) {
            setErrorMessage && setErrorMessage(error);
            return [false, error];
        }
    }

    return [true, ""];
}

export {Form, validateAllFields};