using backend.Models;

namespace backend.Repositories
{
    public interface IFriendRepository
    {
        Task<IEnumerable<User>> GetAllUsersExceptCurrentAsync(Guid currentUserId);
        Task<IEnumerable<User>> SearchUsersByInterestAsync(Guid currentUserId, string interest);
        Task<IEnumerable<User>> GetFriendsAsync(Guid currentUserId);
        Task<bool> AreFriendsAsync(Guid userId, Guid friendUserId);
        Task<bool> FriendRequestExistsAsync(Guid requesterId, Guid receiverId);
        Task SendFriendRequestAsync(Guid requesterId, Guid receiverId);
        Task<IEnumerable<FriendRequest>> GetReceivedFriendRequestsAsync(Guid receiverId);
        Task AcceptFriendRequestAsync(Guid requestId, Guid currentUserId);
        Task RejectFriendRequestAsync(Guid requestId, Guid currentUserId);
        Task DeleteFriendAsync(Guid userId, Guid friendUserId);
    }
}
