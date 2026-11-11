using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BeeMart.API.Models
{
    [Table("TrTransactionDetail")]
    public class TrTransactionDetail
    {
        [Key]
        [StringLength(36)]
        public string IdTransactionDetail { get; set; } = string.Empty;

        [Required]
        [StringLength(36)]
        public string IdTransaction { get; set; } = string.Empty;

        [Required]
        [StringLength(36)]
        public string IdProduct { get; set; } = string.Empty;

        public int Qty { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal Discount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal SubTotal { get; set; }

        public bool Stsrc { get; set; }
        public DateTime Datein { get; set; }

        [StringLength(36)]
        public string Userin { get; set; } = string.Empty;

        public DateTime? Dateup { get; set; }

        [StringLength(36)]
        public string? Userup { get; set; }

        [ForeignKey("IdTransaction")]
        public virtual TrTransaction? Transaction { get; set; }

        [ForeignKey("IdProduct")]
        public virtual MsProduct? Product { get; set; }
    }
}