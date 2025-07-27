using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace backend.Hubs
{
    public class MatchHub : Hub
    {
        // Use a thread-safe queue to store waiting users (at most one)
        private static readonly ConcurrentQueue<string> WaitingUsers = new ConcurrentQueue<string>();

        // User ID to connection ID mapping, ordinary dictionary, because all modifications are in the single-threaded Hub context
        private static readonly Dictionary<string, string> UserToConnection = new Dictionary<string, string>();

        public override Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier!;
            lock (UserToConnection)
            {
                UserToConnection[userId] = Context.ConnectionId;
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier!;
            lock (UserToConnection)
            {
                UserToConnection.Remove(userId);
            }
            // If the disconnected user is still in the waiting queue, remove
            RemoveFromWaitingQueue(userId);

            return base.OnDisconnectedAsync(exception);
        }

        private void RemoveFromWaitingQueue(string userId)
        {
            // Since ConcurrentQueue has no Remove, try to dequeue and requeue the remaining users first
            var tempQueue = new Queue<string>();
            while (WaitingUsers.TryDequeue(out var uid))
            {
                if (uid != userId)
                {
                    tempQueue.Enqueue(uid);
                }
            }

            foreach (var uid in tempQueue)
            {
                WaitingUsers.Enqueue(uid);
            }
        }

        public async Task StartMatching(string userId)
        {
            // Try to match an existing waiting user
            if (WaitingUsers.TryDequeue(out var partnerId))
            {
                if (!UserToConnection.ContainsKey(partnerId) || !UserToConnection.ContainsKey(userId))
                {
                    // The connection no longer exists, notifying the current user failed, or simply ignoring it
                    return;
                }

                var partnerConn = UserToConnection[partnerId];
                var myConn = Context.ConnectionId;

                // Notify both parties of the match
                await Clients.Client(myConn).SendAsync("Matched", partnerId);
                await Clients.Client(partnerConn).SendAsync("Matched", userId);
            }
            else
            {
                // Wait for the queue to be empty to ensure that users do not enter the queue repeatedly
                if (!WaitingUsers.Contains(userId))
                {
                    WaitingUsers.Enqueue(userId);
                }
                // Otherwise, the user is already waiting and will not be added to the queue again.
            }
        }

        public async Task SendMessage(string toUserId, string message)
        {
            if (UserToConnection.TryGetValue(toUserId, out var toConnectionId))
            {
                await Clients.Client(toConnectionId).SendAsync("ReceiveMessage", Context.UserIdentifier, message);
            }
        }
    }
}
