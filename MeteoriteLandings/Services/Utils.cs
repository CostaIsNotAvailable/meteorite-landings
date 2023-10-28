using MeteoriteLandings.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.IO;
using Name = MeteoriteLandings.Enums.Continent;
using Model = MeteoriteLandings.Models.Continent;
using MeteoriteLandings.Models;
using Newtonsoft.Json;

namespace MeteoriteLandings.Services
{
    public static class Utils
    {
        public static Name? GetContinent(float latitude, float longitude)
        {
            StreamReader streamReader = new StreamReader("./Data/continents.json");
            string fileContent = streamReader.ReadToEnd();
            List<Model> continents = JsonConvert.DeserializeObject<List<Model>>(fileContent);

            int i = 0;
            bool continentFound = false; 

            while (i < (continents.Count-1) || !continentFound)
            {
                continentFound = IsInContinent(latitude, longitude, continents[0]);
                i++;
            }

            if (!continentFound)
            {
                return null;
            }

            return continents[i].Name;
        }

        private static bool IsInContinent(float latitude, float longitude, Model continent)
        {
            int lastIndex = continent.Coordinates.Length - 1;
            float[][] coordinates = continent.Coordinates;
            
            double AngleSum = GetAngle(
                coordinates[lastIndex][0], coordinates[lastIndex][1],
                latitude, longitude,
                coordinates[0][0], coordinates[0][1]);

            for (int i = 0; i < lastIndex; i++)
            {
                AngleSum += GetAngle(
                    coordinates[i][0], coordinates[i][1],
                    latitude, longitude,
                    coordinates[i + 1][0], coordinates[i + 1][1]);
            }

            Console.WriteLine(AngleSum);

            return (Math.Abs(AngleSum) > 1);
        }

        private static double GetAngle(float ax, float ay, float bx, float by, float cx, float cy)
        {

            float dotProduct = DotProduct(ax, ay, bx, by, cx, cy);

            double lengthAB = DistanceBetweenPoints(ax, ay, bx, by); 
            double lengthBC = DistanceBetweenPoints(bx, by, cx, cy);

            return Math.Acos(dotProduct / (lengthAB * lengthBC));
        }

        private static float DotProduct(float ax, float ay, float bx, float by, float cx, float cy)
        {
            float BAx = ax - bx;
            float BAy = ay - by;
            float BCx = cx - bx;
            float BCy = cy - by;

            return (BAx * BCx + BAy * BCy);
        }

        private static double DistanceBetweenPoints(float ax, float ay, float bx, float by)
        {
            return Math.Sqrt(Math.Pow(bx - ax, 2) + Math.Pow(by - ay, 2));
        }
    }
}
