using System.Data;

namespace backend.Models
{
    public class Schedule
    {
        public Guid Id { get; set; }
        public Guid UserId {  get; set;  }
        public DateTime Date { get; set; }
        public string Content { get; set; } = string.Empty;
    }
}
