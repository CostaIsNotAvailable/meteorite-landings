using System;
using MeteoriteLandings.Enums;

namespace MeteoriteLandings.Models
{
    public class Params
    {
        public Continent[] continents{ get; set; }

        public int minMass { get; set; }

        public int maxMass { get; set; }

        public int minDate { get; set; }

        public int maxDate { get; set; }
    }
}
