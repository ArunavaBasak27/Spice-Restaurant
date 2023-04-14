using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Data;
using SpiceAPI.Models;
using SpiceAPI.Models.Dto;
using SpiceAPI.Services.PhotoService;
using System.Net;
#nullable disable
namespace SpiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuItemController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private ApiResponse _response;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public MenuItemController(ApplicationDbContext db, IMapper mapper, IPhotoService photoService)
        {
            _db = db;
            _mapper = mapper;
            _response = new ApiResponse();
            _photoService = photoService;
        }
        [HttpGet]
        public async Task<IActionResult> GetMenuItems()
        {
            try
            {
                var menuItemList = await _db.MenuItems.Include(x => x.Category).Include(x => x.SubCategory).ToListAsync();
                foreach (var menuItem in menuItemList)
                {
                    menuItem.Image = menuItem.Image.Split(new char[] { ',' })[0];
                }
                _response.Result = menuItemList;
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            return Ok(_response);
        }


        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetMenuItem(int id)
        {
            try
            {
                var menuItem = await _db.MenuItems.Include(x => x.Category).Include(x => x.SubCategory).FirstOrDefaultAsync(x => x.Id == id);
                menuItem.Image = menuItem.Image.Split(new char[] { ',' })[0];
                _response.Result = menuItem;
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            return Ok(_response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMenuItem([FromForm] MenuItemCreateDTO menuItemDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var menuItemFromDb = await _db.MenuItems.FirstOrDefaultAsync(x => x.Name == menuItemDTO.Name);
                    if (menuItemFromDb != null)
                    {
                        throw new Exception("MenuItem already exists");
                    }
                    var photo = await _photoService.AddPhoto(menuItemDTO.File);
                    MenuItem menuItem = _mapper.Map<MenuItem>(menuItemDTO);
                    menuItem.Image = photo.Url + "," + photo.PublicId;
                    _db.MenuItems.Add(menuItem);
                    await _db.SaveChangesAsync();
                    _response.StatusCode = HttpStatusCode.Created;
                }
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            return Ok(_response);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateMenuItem(int id, [FromForm] MenuItemUpdateDTO menuItemDTO)
        {
            try
            {
                if (id == 0 || id != menuItemDTO.Id)
                {
                    throw new Exception("Error while updating menuItem");
                }

                MenuItem menuItemFromDb = await _db.MenuItems.FirstOrDefaultAsync(x => x.Id == id);
                if (menuItemFromDb == null)
                {
                    throw new Exception("MenuItem not found");
                }
                menuItemFromDb.Name = menuItemDTO.Name;
                menuItemFromDb.Description = menuItemDTO.Description;
                menuItemFromDb.Price = menuItemDTO.Price;
                menuItemFromDb.CategoryId = menuItemDTO.CategoryId;
                menuItemFromDb.SubCategoryId = menuItemDTO.SubCategoryId;

                if (menuItemDTO.File != null && menuItemDTO.File.Length > 0)
                {
                    await _photoService.DeletePhoto(menuItemFromDb.Image);
                    var photo = await _photoService.AddPhoto(menuItemDTO.File);
                    menuItemFromDb.Image = photo.Url + "," + photo.PublicId;
                }

                //_db.MenuItems.Update(updatedMenuItem);
                await _db.SaveChangesAsync();
                _response.StatusCode = HttpStatusCode.NoContent;
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
            }
            return Ok(_response);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteMenuItem(int id)
        {
            try
            {
                if (id == 0)
                {
                    throw new Exception("Error while updating menuItem");
                }
                MenuItem menuItem = await _db.MenuItems.FirstOrDefaultAsync(x => x.Id == id);
                if (menuItem == null)
                {
                    throw new Exception("MenuItem not found");
                }
                await _photoService.DeletePhoto(menuItem.Image);
                _db.MenuItems.Remove(menuItem);
                await _db.SaveChangesAsync();
                _response.StatusCode = HttpStatusCode.NoContent;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages = new List<string> { ex.Message };
                return BadRequest(_response);
            }
        }
    }
}
