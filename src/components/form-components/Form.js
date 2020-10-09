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
            <p className="error-msg" aria-live={"polite"}>{props.errorMessage}</p>
        </form>
        
    );

}

export default Form;