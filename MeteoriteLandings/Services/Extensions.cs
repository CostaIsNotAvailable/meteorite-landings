using MeteoriteLandings.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace MeteoriteLandings.Services
{
    public static class Extensions
    {
        public static IOrderedQueryable<TSource> OrderByWithDirection<TSource, TKey>(this IEnumerable<TSource> source, Expression<Func<TSource, TKey>> keySelector, Order order)
        {
            return order == Order.Descending ? source.AsQueryable().OrderByDescending(keySelector)
                              : source.AsQueryable().OrderBy(keySelector);
        }
    }
}
