using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Budget.Models;

public class Transaction
{
    public int Id { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 3)]
    public string? Name { get; set; }

    [DataType(DataType.Currency)]
    [Column(TypeName = "decimal(18, 2)")]
    public decimal Amount { get; set; }

    [Display(Name = "Transaction Date")]
    [DataType(DataType.Date)]
    public DateOnly Date { get; set; }

    public int CategoryId { get; set; }
}
