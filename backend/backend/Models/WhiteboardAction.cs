using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class WhiteboardAction
    {
        [Key]
        public Guid Id { get; set; }
        public Guid SessionId { get; set; }
        public Guid UserId { get; set; }
        public string ActionType { get; set; } = null!;
        public string ActionData { get; set; } = null!;
        public DateTime Timestamp { get; set; }
    }
}
