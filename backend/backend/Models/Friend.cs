using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Friend
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid FriendUserId { get; set; }
    }
}
