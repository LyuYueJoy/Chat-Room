using backend.Data;
using backend.Dtos;
using backend.Hubs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(AppDbContext context, IHubContext<ChatHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] MessageDto dto)
        {
            // Verify if you are a friend
            if (!await AreUsersFriends(dto.SenderId, dto.ReceiverId))
            {
                return Forbid("You are not friends.");
            }

            var message = new Message
            {
                Id = Guid.NewGuid(),
                SenderId = dto.SenderId,
                ReceiverId = dto.ReceiverId,
                Content = dto.Content,
                SentAt = DateTime.UtcNow
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // SignalR
            await _hubContext.Clients.User(dto.ReceiverId.ToString())
                .SendAsync("ReceiveMessage", dto.SenderId.ToString(), dto.Content);

            return Ok();
        }

        private async Task<bool> AreUsersFriends(Guid userId1, Guid userId2)
        {
            return await _context.Friends.AnyAsync(f =>
                (f.UserId == userId1 && f.FriendUserId == userId2) ||
                (f.UserId == userId2 && f.FriendUserId == userId1));
        }
    }
}
