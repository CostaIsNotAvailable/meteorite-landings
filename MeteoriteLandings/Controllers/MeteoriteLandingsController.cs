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
using MeteoriteLandings.Services;
using ContinentName = MeteoriteLandings.Enums.Continent;

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
        public ActionResult<IEnumerable<MeteoriteLanding>> Process(
            [FromQuery] string continents, 
            [FromQuery] int minMass, 
            [FromQuery] int maxMass, 
            [FromQuery] int minDate, 
            [FromQuery] int maxDate, 
            [FromQuery] bool isSorted, 
            [FromQuery] SortBy sortedBy, 
            [FromQuery] Order order)
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

                ContinentName[] serializedContinents = JsonConvert.DeserializeObject<ContinentName[]>(continents);

                meteoriteLandings = meteoriteLandings
                    .Where(m => m.Mass >= minMass && m.Mass <= maxMass)
                    .Where(m => m.Year.Year >= minDate && m.Year.Year <= maxDate)
                    .Where(m => isInContinent(m.RecLat, m.RecLong, serializedContinents))
                    .ToList();

                if (isSorted)
                {
                    meteoriteLandings = meteoriteLandings
                        .OrderByWithDirection(m => Sort(m, sortedBy), order)
                        .ToList();
                }

                return Ok(meteoriteLandings);
            } 
            catch (Exception e)
            {
                return Problem(title: e.Message , detail: e.ToString());
            }
        }

        private double Sort(MeteoriteLanding meteroriteLanding, SortBy sortedBy)
        {
            switch (sortedBy)
            {
                case (SortBy.Date):
                    return meteroriteLanding.Year.Year;
                case (SortBy.Mass):
                    return meteroriteLanding.Mass;
                default:
                    return meteroriteLanding.Id;
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

        private bool isInContinent(float latitude, float longitude, ContinentName[] continents)
        {
            return true;

            // TODO Fix function
            //ContinentName? continentName = Utils.GetContinent(latitude, longitude);

            //if (continentName == null)
            //{
                //return false;
            //}

            //return continents.Contains((ContinentName)continentName);
        }
    }
}
