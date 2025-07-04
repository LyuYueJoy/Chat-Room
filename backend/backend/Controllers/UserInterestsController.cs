using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Repositories;
using backend.Models;
using System.Security.Claims;
using backend.Dtos;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserInterestsController : ControllerBase
    {
        private readonly IUserInterestRepository _repo;

        public UserInterestsController(IUserInterestRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("my")]
        public async Task<IActionResult> GetMyInterests()
        {
            var userId = GetUserId();
            var interests = await _repo.GetUserInterests(userId);
            return Ok(interests.Select(x => new { x.Id, x.Interest }));
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddInterest([FromBody] AddInterestRequest request)
        {
            var userId = GetUserId();
            var count = await _repo.GetUserInterestCount(userId);
            if (count >= 5)
            {
                return BadRequest("You can have a maximum of 5 interests.");
            }

            await _repo.AddInterest(userId, request.Interest);
            return Ok(new { message = "Interest added successfully." });
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateInterest([FromBody] UpdateInterestRequest request)
        {
            var userId = GetUserId();
            await _repo.UpdateInterest(userId, request.InterestId, request.NewInterest);
            return Ok(new { message = "Interest updated successfully." });
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteInterest([FromBody] DeleteInterestRequest request)
        {
            var userId = GetUserId();
            await _repo.DeleteInterest(userId, request.InterestId);
            return Ok(new { message = "Interest delete successfully." });
        }

        [HttpGet("users-with-interest")]
        public async Task<IActionResult> GetUsersWithInterest([FromQuery] string interest)
        {
            var users = await _repo.GetUsersWithInterest(interest);
            return Ok(users.Select(u => new
            {
                u.Id,
                u.Email,
                u.DisplayName
            }));
        }

        [HttpGet("other-users-with-same-interests")]
        public async Task<IActionResult> GetOtherUsersWithSameInterests()
        {
            var userId = GetUserId();
            var users = await _repo.GetOtherUsersWithSameInterests(userId);
            return Ok(users.Select(u => new
            {
                u.Id,
                u.Email,
                u.DisplayName
            }));
        }


        private Guid GetUserId()
        {
            var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (idStr == null)
                throw new UnauthorizedAccessException();
            return Guid.Parse(idStr);
        }
    }
}
