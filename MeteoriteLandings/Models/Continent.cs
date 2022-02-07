using System;
using Name = MeteoriteLandings.Enums.Continent;

namespace MeteoriteLandings.Models
{
    public class Continent
    {
        public Name Name { get; set; }

        public float[][] Coordinates { get; set; }
    }
}
