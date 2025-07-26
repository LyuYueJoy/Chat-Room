using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ScheduleController(AppDbContext context)
        {
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

        // add schedule
        [HttpPost]
        public async Task<IActionResult> CreateSchedule([FromBody] Schedule schedule)
        {
            schedule.Id = Guid.NewGuid(); 
            schedule.UserId = CurrentUserId;

            _context.Schedules.Add(schedule);
            await _context.SaveChangesAsync();

            return Ok(schedule);
        }

        // get schedule
        [HttpGet]
        public async Task<IActionResult> GetMySchedules()
        {
            var schedules = await _context.Schedules
                .Where(s => s.UserId == CurrentUserId)
                .OrderBy(s => s.Date)
                .ToListAsync();

            return Ok(schedules);
        }

        //renew
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSchedule(Guid id, [FromBody] Schedule updated)
        {
            var schedule = await _context.Schedules.FindAsync(id);

            if (schedule == null || schedule.UserId != CurrentUserId)
                return NotFound();

            schedule.Date = updated.Date;
            schedule.Content = updated.Content;

            await _context.SaveChangesAsync();
            return Ok(schedule);
        }

        // delete
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSchedule(Guid id)
        {
            var schedule = await _context.Schedules.FindAsync(id);

            if (schedule == null || schedule.UserId != CurrentUserId)
                return NotFound();

            _context.Schedules.Remove(schedule);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
