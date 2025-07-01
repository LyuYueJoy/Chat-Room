using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class WhiteboardSession
    {
        [Key]
        public Guid Id { get; set; }
        public Guid CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
