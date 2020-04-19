import React, { useState } from 'react';
import { Alert } from 'reactstrap';

export const Error = (prop) => {
    const [visible, setVisible] = useState(true);

    const onDismiss = () => setVisible(false);

    return (
        <Alert color="danger" isOpen={visible} toggle={onDismiss}>
            {prop}
        </Alert>
    );
}

//