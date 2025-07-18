using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace backend.Hubs
{
    public class MatchHub : Hub
    {
        // 用线程安全的队列存储等待用户（最多一个）
        private static readonly ConcurrentQueue<string> WaitingUsers = new ConcurrentQueue<string>();

        // 用户ID到连接ID映射，普通字典，因修改都在单线程Hub上下文
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
            // 如果断开连接的用户还在等待队列中，移除
            RemoveFromWaitingQueue(userId);

            return base.OnDisconnectedAsync(exception);
        }

        private void RemoveFromWaitingQueue(string userId)
        {
            // 由于ConcurrentQueue无Remove，先尝试出队并重新入队剩余用户
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
            // 尝试匹配已有等待用户
            if (WaitingUsers.TryDequeue(out var partnerId))
            {
                if (!UserToConnection.ContainsKey(partnerId) || !UserToConnection.ContainsKey(userId))
                {
                    // 连接已经不存在，通知当前用户失败，或直接忽略
                    return;
                }

                var partnerConn = UserToConnection[partnerId];
                var myConn = Context.ConnectionId;

                // 通知匹配双方
                await Clients.Client(myConn).SendAsync("Matched", partnerId);
                await Clients.Client(partnerConn).SendAsync("Matched", userId);
            }
            else
            {
                // 等待队列空，确保用户不重复入队
                if (!WaitingUsers.Contains(userId))
                {
                    WaitingUsers.Enqueue(userId);
                }
                // 否则用户已经在等待中，不重复入队
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
