using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;


namespace backend.Repositories
{
    public class UserInterestRepository:IUserInterestRepository
    {
        private readonly AppDbContext _context;

        public UserInterestRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserInterest>> GetUserInterests(Guid userId)
        {
            return await _context.UserInterests
                .Where(x => x.UserId == userId)
                .ToListAsync();
        }

        public async Task<int> GetUserInterestCount(Guid userId)
        {
            return await _context.UserInterests
                .CountAsync(x => x.UserId == userId);
        }

        public async Task AddInterest(Guid userId, string interest)
        {
            var entity = new UserInterest
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Interest = interest
            };
            _context.UserInterests.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateInterest(Guid userId, Guid interestId, string newInterest)
        {
            var entity = await _context.UserInterests
                .FirstOrDefaultAsync(x => x.Id == interestId && x.UserId == userId);

            if (entity == null)
                throw new Exception("Interest not found.");

            entity.Interest = newInterest;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteInterest(Guid userId, Guid interestId)
        {
            var entity = await _context.UserInterests
                .FirstOrDefaultAsync(x => x.Id == interestId && x.UserId == userId);

            if (entity == null)
                throw new Exception("Interest not found.");

            _context.UserInterests.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<List<User>> GetUsersWithInterest(string interest)
        {
            return await _context.UserInterests
                .Where(x => x.Interest == interest)
                .Include(x => x.User)
                .Select(x => x.User)
                .Distinct()
                .ToListAsync();
        }

        public async Task<List<User>> GetOtherUsersWithSameInterests(Guid userId)
        {
            var myInterests = await _context.UserInterests
                .Where(ui => ui.UserId == userId)
                .Select(ui => ui.Interest)
                .Distinct()
                .ToListAsync();

            if (!myInterests.Any())
            {
                return new List<User>();
            }

            var users = await _context.UserInterests
                .Where(ui => myInterests.Contains(ui.Interest) && ui.UserId != userId)
                .Include(ui => ui.User)
                .Select(ui => ui.User)
                .Distinct()
                .ToListAsync();

            return users;
        }

    }
}
