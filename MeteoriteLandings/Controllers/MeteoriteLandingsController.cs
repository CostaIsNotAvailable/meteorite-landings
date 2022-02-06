using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;
using MeteoriteLandings.Models;
using MeteoriteLandings.Enums;


namespace MeteoriteLandings.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MeteoriteLandingsController : ControllerBase
    {
        private readonly ILogger<MeteoriteLandingsController> Logger;

        public MeteoriteLandingsController(ILogger<MeteoriteLandingsController> logger)
        {
            Logger = logger;
        }

        [HttpPost]
        public ActionResult<IEnumerable<MeteoriteLanding>> Process([FromQuery] string continents, [FromQuery] int minMass, [FromQuery] int maxMass, [FromQuery] int minDate, [FromQuery] int maxDate, [FromQuery] bool isSorted, [FromQuery] SortBy sortedBy, [FromQuery] Order order)
        {
            try
            {
                List<MeteoriteLanding> meteoriteLandings = new List<MeteoriteLanding>();
                foreach (IFormFile file in HttpContext.Request.Form.Files)
                {
                    Stream fileStream = file.OpenReadStream();
                    StreamReader streamReader = new StreamReader(fileStream);
                    string fileContent = streamReader.ReadToEnd();

                    string extension = Path.GetExtension(file.FileName);
                    List<MeteoriteLanding> fileMeteoriteLandings;
                    switch (extension)
                    {
                        case ".json":
                            fileMeteoriteLandings = JsonConvert.DeserializeObject<List<MeteoriteLanding>>(fileContent);
                            break;
                        case ".yml":
                            IDeserializer deserializer = new DeserializerBuilder()
                                .IgnoreUnmatchedProperties()
                                .Build();
                            List<YamlMeteoriteLanding> yamlMeteoriteLandings = deserializer.Deserialize<List<YamlMeteoriteLanding>>(fileContent);
                            fileMeteoriteLandings = yamlMeteoriteLandings
                                .Select(yamlMeteoriteLanding => MapYamlMeteoriteLanding(yamlMeteoriteLanding))
                                .ToList();
                            break;
                        default:
                            throw new ArgumentException("Invalid file format");
                    }

                    meteoriteLandings.AddRange(fileMeteoriteLandings);
                }

                Continent[] serializedContinents = JsonConvert.DeserializeObject<Continent[]>(continents);

                meteoriteLandings = meteoriteLandings
                    .Where(m => m.Mass >= minMass && m.Mass <= maxMass)
                    .Where(m => m.Year.Year >= minDate && m.Year.Year <= maxDate)
                    .Where(m => isInContinent(serializedContinents))
                    .ToList();

                if (isSorted)
                {
                    meteoriteLandings = meteoriteLandings.OrderBy(m =>
                    {
                        switch (sortedBy)
                        {
                            case (SortBy.Date):
                                return m.Year.Year;
                            case (SortBy.Mass):
                                return m.Mass;
                            default:
                                return m.Id;
                        }
                    }).ToList();
                }

                return Ok(meteoriteLandings);
            } 
            catch (Exception e)
            {
                return Problem(title: e.Message , detail: e.ToString());
            }
        }

        private MeteoriteLanding MapYamlMeteoriteLanding(YamlMeteoriteLanding yamlMeteoriteLanding)
        {
            return new MeteoriteLanding
            {
                Id = yamlMeteoriteLanding.id,
                Name = yamlMeteoriteLanding.name,
                NameType = yamlMeteoriteLanding.nametype,
                RecClass = yamlMeteoriteLanding.recclass,
                Mass = yamlMeteoriteLanding.mass,
                Fall = yamlMeteoriteLanding.fall,
                Year = yamlMeteoriteLanding.year,
                RecLat = yamlMeteoriteLanding.reclat,
                RecLong = yamlMeteoriteLanding.reclong
            };
        }

        private bool isInContinent(Continent[] continents)
        {
            return true;
        }
    }
}
