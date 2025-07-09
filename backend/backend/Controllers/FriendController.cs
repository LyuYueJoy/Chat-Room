using backend.Data;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FriendController : ControllerBase
    {
        private readonly IFriendRepository _friendRepo;
        private readonly AppDbContext _context;

        public FriendController(IFriendRepository friendRepo, AppDbContext context)
        {
            _friendRepo = friendRepo;
            _context = context;
        }

        private Guid GetUserId()
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (idStr == null)
                throw new UnauthorizedAccessException();
            return Guid.Parse(idStr);
        }
        private Guid CurrentUserId => GetUserId();
        //find all user except profile
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _friendRepo.GetAllUsersExceptCurrentAsync(CurrentUserId);
            return Ok(users);
        }
        //search user with interest
        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers(string interest)
        {
            var users = await _friendRepo.SearchUsersByInterestAsync(CurrentUserId, interest);
            return Ok(users);
        }
        // find all friend
        [HttpGet("list")]
        public async Task<IActionResult> GetFriends()
        {
            var friends = await _friendRepo.GetFriendsAsync(CurrentUserId);
            return Ok(friends);
        }
        //send add friend request
        [HttpPost("request")]
        public async Task<IActionResult> SendFriendRequest([FromBody] Guid receiverId)
        {
            if (receiverId == CurrentUserId) return BadRequest("Cannot add yourself.");

            if (await _friendRepo.AreFriendsAsync(CurrentUserId, receiverId))
                return BadRequest("Already friends.");

            if (await _friendRepo.FriendRequestExistsAsync(CurrentUserId, receiverId))
                return BadRequest("Friend request already sent.");

            await _friendRepo.SendFriendRequestAsync(CurrentUserId, receiverId);
            return Ok();
        }//get the add friend request

        [HttpGet("requests")]
        public async Task<IActionResult> GetFriendRequests()
        {
            var currentUserId = GetUserId();

            var requests = await _friendRepo.GetReceivedFriendRequestsAsync(currentUserId);

            var requesterIds = requests.Select(r => r.RequesterId).Distinct().ToList();
            var requesters = await _context.Users
                .Where(u => requesterIds.Contains(u.Id))
                .ToDictionaryAsync(u => u.Id);

            var result = requests.Select(r => new
            {
                r.Id,
                requesterDisplayName = requesters.ContainsKey(r.RequesterId) ? requesters[r.RequesterId].DisplayName : "",
                requesterEmail = requesters.ContainsKey(r.RequesterId) ? requesters[r.RequesterId].Email : ""
            });

            return Ok(result);
        }

        //accept friend
        [HttpPost("request/{requestId}/accept")]
        public async Task<IActionResult> AcceptFriendRequest(Guid requestId)
        {
            await _friendRepo.AcceptFriendRequestAsync(requestId, CurrentUserId);
            return Ok();
        }
        //reject friend
        [HttpPost("request/{requestId}/reject")]
        public async Task<IActionResult> RejectFriendRequest(Guid requestId)
        {
            await _friendRepo.RejectFriendRequestAsync(requestId, CurrentUserId);
            return Ok();
        }
        // delet friend
        [HttpDelete("{friendUserId}")]
        public async Task<IActionResult> DeleteFriend(Guid friendUserId)
        {
            await _friendRepo.DeleteFriendAsync(CurrentUserId, friendUserId);
            return NoContent();
        }

        //search by email
        [HttpGet("search-by-email")]
        public async Task<IActionResult> SearchByEmail([FromQuery] string email)
        {
            var currentUserId = GetUserId();
            var user = await _friendRepo.FindUserByEmailExcludingSelfAsync(email, currentUserId);

            if (user == null)
                return NotFound("User not found or is yourself");

            return Ok(new
            {
                user.Id,
                user.DisplayName,
                user.Email
            });
        }


    }

}
