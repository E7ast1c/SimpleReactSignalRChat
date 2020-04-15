import React, { Component } from "react";
import * as signalR from "@aspnet/signalr";
import {Container} from "reactstrap";
import "./Chat.css";
import "bootstrap/dist/css/bootstrap.min.css";

export class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nick: "",
      message: "",
      messages: [],
      hubConnection: null,
    };
  }

    componentDidMount() {
    let conn = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5001/chat")
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
      <Container>
        <div class="menu">
          <div class="name">Simple React + SignalR Chat</div>
        </div>
        <ol class="chat">
          <li class="self">
            <div class="avatar">
              <img src="https://i.imgur.com/HYcn9xO.png" draggable="false" />
            </div>
            <div class="msg">
              <p>
                Ehh, me crashea el Launcher...
              </p>
              <time>18:08</time>
            </div>
          </li>
          <li class="other">
            <div class="avatar">
              <img src="https://i.imgur.com/DY6gND0.png" draggable="false" />
            </div>
            <div class="msg">
              <time>18:08</time>
            </div>
          </li>
          
         
        </ol>
        <input class="textarea" type="text" placeholder="Type here!"/>
        <div class="send"></div>
      </Container>
    );
  }
}
