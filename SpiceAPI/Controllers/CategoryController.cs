using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Data;
using SpiceAPI.Models;
using SpiceAPI.Models.Dto;
using SpiceAPI.Utility;
using System.Net;
#nullable disable
namespace SpiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private ApiResponse _response;
        public CategoryController(ApplicationDbContext db)
        {
            _db = db;
            _response = new ApiResponse();
        }
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categoryList = await _db.Categories.ToListAsync();
                _response.Result = categoryList;
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
        public async Task<IActionResult> GetCategory(int id)
        {
            try
            {
                var category = await _db.Categories.FirstOrDefaultAsync(x => x.Id == id);
                _response.Result = category;
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
        [Authorize(Roles =SD.AdminUser)]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryCreateDTO categoryDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var categoryFromDb = await _db.Categories.FirstOrDefaultAsync(x => x.Name == categoryDTO.Name);
                    if (categoryFromDb != null)
                    {
                        throw new Exception("Category already exists");
                    }
                    Category category = new()
                    {
                        Name = categoryDTO.Name,
                    };
                    _db.Categories.Add(category);
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
        [Authorize(Roles = SD.AdminUser )]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryUpdateDTO categoryDTO)
        {
            try
            {
                if (id == 0 || id != categoryDTO.Id)
                {
                    throw new Exception("Error while updating category");
                }

                Category category = await _db.Categories.FirstOrDefaultAsync(x => x.Id == id);
                if (category == null)
                {
                    throw new Exception("Category not found");
                }
                category.Name = categoryDTO.Name;
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
        [Authorize(Roles = SD.AdminUser )]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                if (id == 0)
                {
                    throw new Exception("Error while updating category");
                }
                Category category = await _db.Categories.FirstOrDefaultAsync(x => x.Id == id);
                if (category == null)
                {
                    throw new Exception("Category not found");
                }
                _db.Categories.Remove(category);
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
    }
}
