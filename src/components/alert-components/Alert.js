import React from "react"
import "../Dialog.css"


/**
 * Alert containing a message and variable number of buttons
 * 
 * @param {object} props required props:
 * - msg {string}: message to display
 * - followed by one or more buttons where the property name
 * is the button label, and the button value is the callback
 * @param {*} ref 
 */
function Alert(props, ref) {
    const buttons = [];
    for (const p in props) {
        if (p !== "msg")
            buttons.push(
                <div className='button-holder'>
                    <button key={p} onClick={props[p]} ref={ref}>{p}</button>
                </div>
            );
    }
    return (
        <div className="alert">
            <p aria-live="polite">{props.msg}</p>
            <div className="button-container">
                {buttons}
            </div>
        </div>
    );
}

Alert = React.forwardRef(Alert);

export default Alert;