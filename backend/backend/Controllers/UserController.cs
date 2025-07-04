using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using backend.Data;
using backend.Dtos;
namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _db;

        public UserController(AppDbContext db)
        {
            _db = db;
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdStr);
            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return NotFound();

            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                displayName = user.DisplayName,
                avatarUrl = user.AvatarUrl,
            });
        }

        [Authorize]
        [HttpPut("profile/display-name")]
        public async Task<IActionResult> UpdateDisplayName([FromBody] UpdateDisplayNameRequest request)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdStr == null)
                return Unauthorized();

            var userId = Guid.Parse(userIdStr);
            var user = await _db.Users.FindAsync(userId);
            if (user == null)
                return NotFound();

            user.DisplayName = request.NewDisplayName;
            await _db.SaveChangesAsync();

            return NoContent();
        }


    }
}
