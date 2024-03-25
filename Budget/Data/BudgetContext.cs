using Budget.Models;
using Microsoft.EntityFrameworkCore;

namespace Budget.Data
{
    public class BudgetContext : DbContext
    {
        public BudgetContext(DbContextOptions<BudgetContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Category { get; set; } = default!;
        public DbSet<Transaction> Transaction { get; set; } = default!;
    }
}
