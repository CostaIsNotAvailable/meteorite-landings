using System;

namespace MeteoriteLandings.Models
{
    public class YamlMeteoriteLanding
    {
        public int id { get; set; }

        public string name { get; set; }

        public string nametype { get; set; }

        public string recclass { get; set; }

        public int mass { get; set; }

        public string fall { get; set; }

        public DateTime year { get; set; }

        public float reclat { get; set; }

        public float reclong { get; set; }
    }
}
