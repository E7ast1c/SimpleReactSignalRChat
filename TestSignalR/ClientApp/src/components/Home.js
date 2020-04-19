import React, { PureComponent } from "react";
import {Chat} from './Chat/Chat';
import {LoginModal} from './LoginModal'

export class Home extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            openLogin: false
        }
    }

    componentDidMount() {
        const LoginName = localStorage.getItem('login') || sessionStorage.getItem('login');
        if (!LoginName) {
            this.setState({ openLogin: true })
        }
    }

  render() {
    return (
        <div>
            <Chat />
            {this.state.openLogin && <LoginModal />}
        </div>
    );
  }
}
