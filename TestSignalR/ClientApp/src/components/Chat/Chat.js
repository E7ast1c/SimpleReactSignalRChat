import React, { Component } from "react";
import * as signalR from "@aspnet/signalr";
import {
  InputGroup,
  Navbar,
  NavbarBrand,
  InputGroupAddon,
  Input,
  Button,
} from "reactstrap";
import "./Chat.css";
import "bootstrap/dist/css/bootstrap.min.css";

export class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connection: new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5001/chat")
        .configureLogging(signalR.LogLevel.Information)
        .build(),
      connectionState: false,
      nickName: "",
      UUID: "",
      messages: [
        {
          UUID: "59dcd722-a27b-4539-bef7-05d07975e109",
          nickName: "Self",
          message: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
          timestamp: "Sun Apr 19 2020 16:35:34 GMT+0300",
        },
        {
          UUID: "ff8fe660-b73e-4e4f-9730-fafb99c1651c",
          nickName: "Another",
          message:
            "Molestias unde expedita maxime amet reprehenderit cum earum tenetur veniam.",
          timestamp: "Sun Apr 20 2020 15:00:34 GMT+0300",
        },
      ],
      hubConnection: null,
      inputText: "",
      repeatDelay: 5000,
    };
  }

  async componentWillMount() {
    const storage =
      JSON.parse(localStorage.getItem("login")) ||
      JSON.parse(sessionStorage.getItem("login")) ||
      "";
    console.log(storage);
    this.setState({
      nickName: storage.login,
      UUID: storage.UUID,
    });
    await this.start();
  }

  componentDidMount() {
    if (this.state.connection && this.state.connection.connectionState) {
      this.setState({
        connectionState: !this.state.connectionState,
      });
      this.receiveMessage();
      console.log("connected");
    }
  }

  async start() {
    try {
      await this.state.connection.start();
    } catch (err) {
      console.error(err);
    }

    if (this.state.connection && this.state.connection.connectionState) {
      this.setState({
        connectionState: !this.state.connectionState,
      });
      this.receiveMessage();
      console.log("connected");
    }
  }

  onKeyDown = (keyName, e, handle) => {
    console.log();
  };

  sendMessage = () => {
    this.state.connection
      .invoke(
        "SendMessage",
        this.state.UUID,
        this.state.nickName,
        this.state.inputText
      )
      .catch(function (err) {
        return console.error(err.toString());
      });

      this.setState({inputText: ""})
  };

  receiveMessage = () => {
    this.state.connection.on(
      "ReceiveMessage",
      (UUID, user, message, timeUTC) => {
        var msg = message
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        this.setState({
          messages: [
            ...this.state.messages,
            {
              UUID: UUID,
              nickName: user,
              message: msg,
              timestamp: timeUTC,
            },
          ],
        });
        console.log(this.state.messages);
      }
    );
  };

  render() {
    let items = this.state;
    return (
      <div>
        <Navbar color="info">
          <NavbarBrand
            className={
              "text-white " +
              (this.state.connectionState ? "connected" : "disconnected")
            }
          >
            Simple chat
          </NavbarBrand>
        </Navbar>

        <ol className="chat">
          {items.messages.map((item, ind) => (
            <li
              key={ind}
              className={item.UUID === this.state.UUID ? "self" : "other"}
            >
              <p className={"letters"}>{item.nickName}</p>
              <div className="msg">
                <p>{item.message}</p>
                <time>{item.timestamp}</time>
              </div>
            </li>
          ))}
        </ol>

          <InputGroup onKeyPress={(e) => {
            if (this.state.connectionState && e.key === 'Enter') {
              this.sendMessage()
            }}} >
            <Input
              autoFocus
              value={this.state.inputText}
              onChange={(e) => this.setState({ inputText: e.target.value })}
              placeholder="Type here..."
            />
            <InputGroupAddon addonType="append">
              <Button
                color={this.state.connectionState ? "info" : "danger"}
                onClick={this.sendMessage}
                disabled={!this.state.connectionState}
              >
                Send
              </Button>
            </InputGroupAddon>
          </InputGroup>     
      </div>
    );
  }
}
