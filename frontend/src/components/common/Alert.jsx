import React, { useEffect } from 'react';

const Alert = ({ message, type = 'danger', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className={`alert alert-${type}`}>
            {message}
        </div>
    );
};

export default Alert;