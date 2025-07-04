namespace backend.Dtos
{
    public class UpdateInterestRequest
    {
        public Guid InterestId { get; set; }
        public string NewInterest { get; set; } = null!;
    }
}
