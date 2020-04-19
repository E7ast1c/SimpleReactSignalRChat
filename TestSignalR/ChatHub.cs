using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestSignalR
{
    public class Chat : Hub
    {
        async public Task SendMessage(string UUID, string name, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", UUID, name, message, DateTime.UtcNow);
        }
    }
}
