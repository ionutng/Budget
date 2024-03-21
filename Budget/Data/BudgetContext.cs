using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Budget.Models;

namespace Budget.Data
{
    public class BudgetContext : DbContext
    {
        public BudgetContext (DbContextOptions<BudgetContext> options)
            : base(options)
        {
        }

        public DbSet<Budget.Models.Category> Category { get; set; } = default!;
        public DbSet<Budget.Models.Transaction> Transaction { get; set; } = default!;
    }
}
