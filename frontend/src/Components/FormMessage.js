import React from "react";

function FormMessage({ type, message }) {
    if (!message) return null;
    return (
        <div className={`form-feedback form-feedback-${type}`} role="alert">
            <p>{message}</p>
        </div>
    );
}

export default FormMessage;
