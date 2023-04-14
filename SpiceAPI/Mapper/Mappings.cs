using AutoMapper;
using SpiceAPI.Models;
using SpiceAPI.Models.Dto;

namespace SpiceAPI.Mapper
{
    public class Mappings:Profile
    {
        public Mappings()
        {
            CreateMap<MenuItem,MenuItemCreateDTO>().ReverseMap();
            CreateMap<MenuItem,MenuItemUpdateDTO>().ReverseMap();
        }
    }
}
