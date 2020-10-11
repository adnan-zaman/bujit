import React from "react"


function Alert(props, ref) {
    return (
        <div>
            hehe
        </div>
    );
}

Alert = React.forwardRef(Alert);

export default Alert;