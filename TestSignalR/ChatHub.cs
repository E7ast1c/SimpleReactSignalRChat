using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestSignalR
{
    public class Chat : Hub
    {
        async public Task SendToAll(string name, string message)
        {
           await Clients.All.SendAsync("sendToAll", name, message);
                //InvokeAsync("sendToAll", name, message);
        }

        async public Task SendMessage(string name, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", name, message);
            //InvokeAsync("sendToAll", name, message);
        }
    }
}
