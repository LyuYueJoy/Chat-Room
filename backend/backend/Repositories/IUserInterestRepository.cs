using backend.Models;

namespace backend.Repositories
{
    public interface IUserInterestRepository
    {
        Task<List<UserInterest>> GetUserInterests(Guid userId);
        Task AddInterest(Guid userId, string interest);
        Task UpdateInterest(Guid userId, Guid interestId, string newInterest);
        Task DeleteInterest(Guid userId, Guid interestId);
        Task<List<User>> GetUsersWithInterest(string interest);
        Task<int> GetUserInterestCount(Guid userId);
        Task<List<User>> GetOtherUsersWithSameInterests(Guid userId);

    }
}
