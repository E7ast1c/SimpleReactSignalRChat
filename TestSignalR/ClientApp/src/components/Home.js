import React, { PureComponent } from "react";
import * as signalR from "@aspnet/signalr";
import {Chat} from './Chat/Chat';

export class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      buttonDisabled: true,
      inputText: "",
      messages: [],
      receivedText: "",
      connection: "",
    };
  }

  componentDidMount() {
    let conn = new signalR.HubConnectionBuilder()
      .withUrl("https://172.18.25.209:5001/chat")
      .configureLogging(signalR.LogLevel.Information)
      .build();
    setTimeout(() => this.start(), 5000);
        this.setState({
      connection: conn
    });
  }

  toggleButton = () => {
    const t = signalR.HubConnectionState.Connected;
      if (this.state.connection && this.state.connection === signalR.HubConnectionState.Connected) {
        this.setState({
          buttonDisabled: !this.state.buttonDisabled,
        });
    }
  }

  async start() {
    try {
      await this.state.connection.start();
      this.setState({
        buttonDisabled: !this.state.buttonDisabled,
      });
      console.log("connected");
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
      }

      this.toggleButton();
      this.receiveMessage();
  }

  sendMessage = (user, message) => {
    this.state.connection
      .invoke("SendMessage", user, message)
      .catch(function (err) {
        return console.error(err.toString());
      });
  };

  receiveMessage = () => {
    this.state.connection.on("ReceiveMessage", (user, message) => {
      var msg = message
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      var encodedMsg = user + " says " + msg;
      this.setState({
        receivedText: encodedMsg,
      });
    });
  };

  render() {
    return (
        <body>
            <Chat />
        </body>
    );
  }
}
