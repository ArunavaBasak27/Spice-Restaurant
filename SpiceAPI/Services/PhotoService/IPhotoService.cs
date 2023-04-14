using SpiceAPI.Services.Models;

namespace SpiceAPI.Services.PhotoService
{
    public interface IPhotoService
    {
        Task<Photo> AddPhoto(IFormFile file);
        Task<string> DeletePhoto(string image);
    }
}
