import React from 'react'

function MessageAlert(props) {
    return (
        <div className="alert alert-primary alert-design  d-flex justify-content-lg-center align-items-center text-center" role="alert">
            {props.message}
        </div>
    )
}

export default MessageAlert;