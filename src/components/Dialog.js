import React from "react"
import CreateForm from "./form-components/CreateForm"
import EditForm from "./form-components/EditForm"
import AddForm from "./form-components/AddForm"
import SubtractForm from "./form-components/SubtractForm"
import TransferForm from "./form-components/TransferForm"
import "./Dialog.css"


/**
 * Creates a dialog box of a given type.
 * 
 * @param {object} props expected props:
 * - {string} type: type of dialog to be made
 * - {object} accountData: data to be passed to dialog (depends on type)
 * - {function} onSubmit: callback if the submit button is pressed
 * - {function} onCancel: callback if cancel button is pressed
 * @param {object} ref dialog will fill ref with focus target 
 */
function Dialog(props, ref) {
    let dialogBody;
    const properties = {accountData : props.accountData,
                        onSubmit : props.onSubmit,
                        onCancel : props.onCancel,
                        ref : ref};

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
    }


    return(
        <div className="dialog">
            {dialogBody}
        </div>
    );
}

Dialog = React.forwardRef(Dialog);

export default Dialog;