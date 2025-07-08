using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FriendController : ControllerBase
    {
        private readonly IFriendRepository _friendRepo;

        public FriendController(IFriendRepository friendRepo)
        {
            _friendRepo = friendRepo;
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
            var requests = await _friendRepo.GetReceivedFriendRequestsAsync(CurrentUserId);
            return Ok(requests);
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
    }

}
