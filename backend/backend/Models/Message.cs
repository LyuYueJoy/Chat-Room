using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Message
    {
        [Key]
        public Guid Id { get; set; }
        public Guid ChatRoomId { get; set; }
        public Guid SenderId { get; set; }
        public string Content { get; set; } = null!;
        public DateTime Timestamp { get; set; }
    }
}
