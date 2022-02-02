using System;

namespace MeteoriteLandings.Models
{
    public class MeteoriteLanding
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string NameType { get; set; }

        public string RecClass { get; set; }

        public string Mass { get; set; }

        public string Fall { get; set; }

        public DateTime Year { get; set; }

        public float RecLat { get; set; }

        public float RecLong { get; set; }
    }
}
