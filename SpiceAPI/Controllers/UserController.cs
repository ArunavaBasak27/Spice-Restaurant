using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SpiceAPI.Data;
using SpiceAPI.Models;
using SpiceAPI.Models.Dto;
using SpiceAPI.Utility;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
#nullable disable

namespace SpiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly ApiResponse _response;
        private string _secretKey;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public UserController(ApplicationDbContext db,
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            _db = db;
            _secretKey = configuration.GetValue<string>("ApiSettings:Secret");
            _response = new ApiResponse();
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost("register")]
        public async Task<object> Register([FromBody] RegisterRequestDTO model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var userFromDb = await _db.ApplicationUsers
                        .FirstOrDefaultAsync(x => x.UserName.ToLower() == model.UserName.ToLower());
                    if (userFromDb != null)
                    {
                        throw new Exception("User already exists");
                    }
                    if (string.IsNullOrEmpty(model.Role))
                    {
                        model.Role = SD.CustomerUser;
                    }
                    var newUser = new ApplicationUser()
                    {
                        UserName = model.UserName,
                        Email = model.UserName,
                        NormalizedEmail = model.UserName.ToUpper(),
                        Name = model.Name,
                        PhoneNumber = model.PhoneNumber,
                        StreetAddress = model.StreetAddress,
                        City = model.City,
                        State = model.State,
                        PostalCode = model.PostalCode,
                    };
                    var result = await _userManager.CreateAsync(newUser, model.Password);
                    if (result.Succeeded)
                    {
                        if (!await _roleManager.RoleExistsAsync(SD.AdminUser))
                        {
                            await _roleManager.CreateAsync(new IdentityRole(SD.AdminUser));
                            await _roleManager.CreateAsync(new IdentityRole(SD.CustomerUser));
                            await _roleManager.CreateAsync(new IdentityRole(SD.KitchenUser));
                            await _roleManager.CreateAsync(new IdentityRole(SD.FrontDeskUser));
                            await _roleManager.CreateAsync(new IdentityRole(SD.ManagerUser));
                        }

                        if (model.Role.ToLower() == SD.AdminUser.ToLower())
                        {
                            await _userManager.AddToRoleAsync(newUser, SD.AdminUser);
                        }
                        else if (model.Role.ToLower() == SD.ManagerUser.ToLower())
                        {
                            await _userManager.AddToRoleAsync(newUser, SD.ManagerUser);
                        }
                        else if (model.Role.ToLower() == SD.KitchenUser.ToLower())
                        {
                            await _userManager.AddToRoleAsync(newUser, SD.KitchenUser);
                        }
                        else if (model.Role.ToLower() == SD.FrontDeskUser.ToLower())
                        {
                            await _userManager.AddToRoleAsync(newUser, SD.FrontDeskUser);
                        }
                        else
                        {
                            await _userManager.AddToRoleAsync(newUser, SD.CustomerUser);
                        }
                        _response.Result = newUser;
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

        [HttpPost("login")]
        public async Task<object> Login([FromBody] LoginRequestDTO model)
        {
            try
            {
                if (ModelState.IsValid)
                {

                    var userFromDb = await _db.ApplicationUsers
                            .FirstOrDefaultAsync(x => x.UserName.ToLower() == model.UserName.ToLower());
                    bool isValid = await _userManager.CheckPasswordAsync(userFromDb, model.Password);
                    if (!isValid)
                    {
                        throw new Exception("Username or password is incorrect");
                    }

                    #region Generate Token
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.ASCII.GetBytes(_secretKey);
                    var roles = await _userManager.GetRolesAsync(userFromDb);
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[]
                        {
                        new Claim("fullName", userFromDb.Name),
                        new Claim("id", userFromDb.Id.ToString()),
                        new Claim(ClaimTypes.Email, userFromDb.Email),
                        new Claim(ClaimTypes.Role, roles.FirstOrDefault()),
                        }),
                        Expires = DateTime.UtcNow.AddDays(1),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                    };
                    var token = tokenHandler.CreateToken(tokenDescriptor);
                    #endregion

                    var response = new LoginResponseDTO()
                    {
                        Email = userFromDb.Email,
                        Token = tokenHandler.WriteToken(token)
                    };

                    if (string.IsNullOrEmpty(response.Email) || string.IsNullOrEmpty(response.Token))
                    {
                        throw new Exception("Username or password is incorrect");
                    }
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.Result = response;
                }
                else
                {
                    throw new Exception("Username or password is incorrect");
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
    }
}
