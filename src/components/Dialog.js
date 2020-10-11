import React from "react"
import CreateForm from "./form-components/CreateForm"
import EditForm from "./form-components/EditForm"
import AddForm from "./form-components/AddForm"
import SubtractForm from "./form-components/SubtractForm"
import TransferForm from "./form-components/TransferForm"
import Alert from "./alert-components/Alert"
import "./Dialog.css"


/**
 * Creates a dialog box of a given type.
 * 
 * @param {object} props expected props:
 * - {string} type: type of dialog to be made
 * - {object} properties: props to be passed to dialog (depends on type)
 * - {function} onSubmit: callback if the submit button is pressed
 * - {function} onCancel: callback if cancel button is pressed
 * @param {object} ref dialog will fill ref with focus target 
 * 
 * ## Properties required for different types ##
 * ### Form Types ###
 * #### f stands for a callback function to be called on event ###
 * - create : {onSubmit : f, onCancel: f}
 * - edit : {id : account id, name: account name, percent: account percent, onSubmit : f, onCancel: f}
 * - add : {id : account id, onSubmit: f, onCancel: f}
 * - subtract: {id : account id, name: account name, balance: account balance, onSubmit : f, onCancel: f}
 * - transfer : {accounts : AccountData[], onSubmit : f, onCancel: f}
 * ### Alert Types ###
 * - alert : {msg : message, (name : f)} at least one property, msg, that contains a string which
   * is the messaged to be displayed, followed by one or more properties where the property name is
   * the name of button and the property value is the callback function to be called on button click
 */
function Dialog(props, ref) {
    let dialogBody;
    let properties = {...props.properties, ref : ref};
    switch (props.type) {
        case "create":
            dialogBody = <CreateForm {...properties} />
            break;
        case "edit":
            dialogBody = <EditForm {...properties} />
            break;
        case "add":
            dialogBody = <AddForm {...properties} />
            break;
        case "subtract":
            dialogBody = <SubtractForm {...properties} />
            break;
        case "transfer":
            dialogBody = <TransferForm {...properties} />
            break;
        case "alert":
            dialogBody = <Alert {...properties} />
    }


    return(
        <div className="dialog">
            {dialogBody}
        </div>
    );
}

Dialog = React.forwardRef(Dialog);

export default Dialog;