using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class FriendRepository : IFriendRepository
    {
        private readonly AppDbContext _context;

        public FriendRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<IEnumerable<User>> GetAllUsersExceptCurrentAsync(Guid currentUserId)
        {
            return await _context.Users
                .Where(u => u.Id != currentUserId)
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> SearchUsersByInterestAsync(Guid currentUserId, string interest)
        {
            var userIds = await _context.UserInterests
                .Where(ui => ui.Interest.Contains(interest) && ui.UserId != currentUserId)
                .Select(ui => ui.UserId)
                .Distinct()
                .ToListAsync();

            return await _context.Users
                .Where(u => userIds.Contains(u.Id))
                .ToListAsync();
        }

        public async Task<IEnumerable<User>> GetFriendsAsync(Guid currentUserId)
        {
            var friendIds = await _context.Friends
                .Where(f => f.UserId == currentUserId)
                .Select(f => f.FriendUserId)
                .ToListAsync();

            return await _context.Users
                .Where(u => friendIds.Contains(u.Id))
                .ToListAsync();
        }

        public async Task<bool> AreFriendsAsync(Guid userId, Guid friendUserId)
        {
            return await _context.Friends.AnyAsync(f => f.UserId == userId && f.FriendUserId == friendUserId);
        }

        public async Task<bool> FriendRequestExistsAsync(Guid requesterId, Guid receiverId)
        {
            return await _context.FriendRequests.AnyAsync(fr =>
                fr.RequesterId == requesterId &&
                fr.ReceiverId == receiverId &&
                fr.Status == FriendRequestStatus.Pending);
        }
        public async Task SendFriendRequestAsync(Guid requesterId, Guid receiverId)
        {
            var request = new FriendRequest
            {
                Id = Guid.NewGuid(),
                RequesterId = requesterId,
                ReceiverId = receiverId,
                Status = FriendRequestStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };
            _context.FriendRequests.Add(request);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<FriendRequest>> GetReceivedFriendRequestsAsync(Guid receiverId)
        {
            return await _context.FriendRequests
                .Where(fr => fr.ReceiverId == receiverId && fr.Status == FriendRequestStatus.Pending)
                .ToListAsync();
        }

        public async Task AcceptFriendRequestAsync(Guid requestId, Guid currentUserId)
        {
            var request = await _context.FriendRequests.FindAsync(requestId);
            if (request == null || request.ReceiverId != currentUserId) throw new Exception("Request not found or unauthorized.");

            request.Status = FriendRequestStatus.Accepted;

            var friend1 = new Friend { Id = Guid.NewGuid(), UserId = currentUserId, FriendUserId = request.RequesterId };
            var friend2 = new Friend { Id = Guid.NewGuid(), UserId = request.RequesterId, FriendUserId = currentUserId };

            _context.Friends.AddRange(friend1, friend2);
            await _context.SaveChangesAsync();
        }

        public async Task RejectFriendRequestAsync(Guid requestId, Guid currentUserId)
        {
            var request = await _context.FriendRequests.FindAsync(requestId);
            if (request == null || request.ReceiverId != currentUserId) throw new Exception("Request not found or unauthorized.");

            request.Status = FriendRequestStatus.Rejected;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteFriendAsync(Guid userId, Guid friendUserId)
        {
            // 找到两条记录，一条是 userId -> friendUserId，另一条是 friendUserId -> userId
            var friend1 = await _context.Friends.FirstOrDefaultAsync(f => f.UserId == userId && f.FriendUserId == friendUserId);
            var friend2 = await _context.Friends.FirstOrDefaultAsync(f => f.UserId == friendUserId && f.FriendUserId == userId);

            if (friend1 != null)
                _context.Friends.Remove(friend1);
            if (friend2 != null)
                _context.Friends.Remove(friend2);

            await _context.SaveChangesAsync();
        }

    }

}
