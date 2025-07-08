using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public enum FriendRequestStatus
    {
        Pending,
        Accepted,
        Rejected
    }

    public class FriendRequest
    {
        [Key]
        public Guid Id { get; set; }
        public Guid RequesterId { get; set; }   // 发起请求的用户
        public Guid ReceiverId { get; set; }    // 接收请求的用户

        public FriendRequestStatus Status { get; set; } = FriendRequestStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

}
