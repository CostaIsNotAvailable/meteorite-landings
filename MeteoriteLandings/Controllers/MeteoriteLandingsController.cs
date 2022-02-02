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
        public ActionResult<IEnumerable<MeteoriteLanding>> Process()
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
                            List<YamlMeteoriteLanding>  yamlMeteoriteLandings = deserializer.Deserialize<List<YamlMeteoriteLanding>>(fileContent);
                            fileMeteoriteLandings = yamlMeteoriteLandings
                                .Select(yamlMeteoriteLanding => MapYamlMeteoriteLanding(yamlMeteoriteLanding))
                                .ToList();
                            break;
                        default:
                            throw new ArgumentException("Invalid format file");
                    }

                    meteoriteLandings.AddRange(fileMeteoriteLandings);
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
    }
}
