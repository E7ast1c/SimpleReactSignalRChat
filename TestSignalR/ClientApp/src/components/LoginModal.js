import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, Input, FormGroup, Form, Col, Row } from 'reactstrap';
//import { Error } from './Alerts'


export const LoginModal = (props) => {
    const storages = {
        sessionStorage: false,
        localStorage: true
    }

    const [open, setOpen] = useState(true);
    const [storagePlace, setStoragePlace] = useState(storages.sessionStorage);
    const [loginValue, setText] = useState("");


    const saveLogin = () => {
        const item = {login: loginValue, UUID: generateUUID()}
        switch (storagePlace) {
            case storages.sessionStorage:
                sessionStorage.setItem('login', JSON.stringify(item));
                break;
            case storages.localStorage:
                localStorage.setItem('login', JSON.stringify(item));
                break;
            default:

        }    

        setOpen(!open)
    };

    function generateUUID() { 
    var d = new Date().getTime()
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

    const updateText = ({ target: { value } }) => {
        setText(value)
    }

    return (
        <div>
            <Modal isOpen={open}>
                <ModalHeader>
                    <Label for="header">Enter your credentials</Label>
                </ModalHeader>
                <ModalBody>
                    <Form inline className={"justify-content-center"} onSubmit={(e) => e.preventDefault()}>
                        <FormGroup>
                            <Row>
                                <Col>
                                    <Label for="login">Your name</Label>
                                </Col>
                                <Col>
                                    <Input type="text" onChange={updateText} autoFocus
                                        maxLength={15} name="email" id="login" placeholder="" />
                                    <Label check>
                                        <Input type="checkbox" checked={storagePlace}
                                            onChange={() => setStoragePlace(!storagePlace)} />
                                        Remember me
                                    </Label>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={saveLogin} disabled={!loginValue}>Enter</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default LoginModal;