using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController:ControllerBase
    {
        private readonly AppDbContext _db;

        public TestController(AppDbContext db)
        {
            _db = db;
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _db.Users
                .Select(u => new
                {
                    id = u.Id,
                    email = u.Email,
                    displayName = u.DisplayName,
                    avatarUrl = u.AvatarUrl,
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}
