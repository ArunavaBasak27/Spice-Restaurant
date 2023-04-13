using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpiceAPI.Data;
using SpiceAPI.Models;
using SpiceAPI.Models.Dto;
using System.Net;
#nullable disable
namespace SpiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubCategoryController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private ApiResponse _response;
        public SubCategoryController(ApplicationDbContext db)
        {
            _db = db;
            _response = new ApiResponse();
        }
        [HttpGet]
        public async Task<IActionResult> GetSubCategories()
        {
            try
            {
                var subCategoryList = await _db.SubCategories.Include(x => x.Category).ToListAsync();
                _response.Result = subCategoryList;
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
        public async Task<IActionResult> GetSubCategory(int id)
        {
            try
            {
                var subCategory = await _db.SubCategories.Include(x => x.Category).FirstOrDefaultAsync(x => x.Id == id);
                _response.Result = subCategory;
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
        public async Task<IActionResult> CreateSubCategory([FromBody] SubCategoryCreateDTO subCategoryDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var doesSubCategoryExists = await _db.SubCategories.Include(x => x.Category)
                        .Where(x => x.Name == subCategoryDTO.Name && x.CategoryId == subCategoryDTO.CategoryId).ToListAsync();

                    if (doesSubCategoryExists.Count() > 0)
                    {
                        throw new Exception($"Subcategory already exists under {doesSubCategoryExists.First().Category.Name} category");
                    }
                    else
                    {
                        var subCategory = new SubCategory
                        {
                            Name = subCategoryDTO.Name,
                            CategoryId = subCategoryDTO.CategoryId,
                        };
                        _db.SubCategories.Add(subCategory);
                        await _db.SaveChangesAsync();
                        _response.StatusCode = HttpStatusCode.Created;
                    }
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
        public async Task<IActionResult> UpdateSubCategory(int id, [FromBody] SubCategoryUpdateDTO subCategoryDTO)
        {
            try
            {
                if (id == 0 || id != subCategoryDTO.Id)
                {
                    throw new Exception("Error while updating subCategory");
                }

                var subCategoryList = await _db.SubCategories.Where(x => x.Id == subCategoryDTO.Id &&  x.Name.ToLower() == subCategoryDTO.Name.ToLower()).ToListAsync();
                if (subCategoryList.Count > 0)
                {
                    throw new Exception("Sub Category already exists. Try again using different name");
                }
                var subCategory = await _db.SubCategories.FirstOrDefaultAsync(x => x.Id == subCategoryDTO.Id);
                if (subCategory == null)
                {
                    throw new Exception("SubCategory not found");
                }
                subCategory.Name = subCategoryDTO.Name;
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
        public async Task<IActionResult> DeleteSubCategory(int id)
        {
            try
            {
                if (id == 0)
                {
                    throw new Exception("Error while updating Sub Category");
                }
                SubCategory subCategory = await _db.SubCategories.FirstOrDefaultAsync(x => x.Id == id);
                if (subCategory == null)
                {
                    throw new Exception("Sub Category not found");
                }
                _db.SubCategories.Remove(subCategory);
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
