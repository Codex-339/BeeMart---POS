using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeeMart.API.Models
{
    [Table("TrTransaction")]
    public class TrTransaction
    {
        [Key]
        [StringLength(36)]
        public string IdTransaction { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string InvoiceNo { get; set; } = string.Empty;

        public DateTime TransactionDate { get; set; }

        [Required]
        [StringLength(5)]
        public string IdUser { get; set; } = string.Empty;

        public int IdPaymentMethod { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        public bool Stsrc { get; set; }
        public DateTime Datein { get; set; }

        [StringLength(36)]
        public string Userin { get; set; } = string.Empty;

        public DateTime? Dateup { get; set; }

        [StringLength(36)]
        public string? Userup { get; set; }

        [ForeignKey("IdUser")]
        public virtual MsUser? User { get; set; }

        [ForeignKey("IdPaymentMethod")]
        public virtual LtPaymentMethod? PaymentMethod { get; set; }

        public virtual ICollection<TrTransactionDetail> Details { get; set; } = new List<TrTransactionDetail>();
    }
}