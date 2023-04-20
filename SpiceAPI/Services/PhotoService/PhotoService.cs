using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using SpiceAPI.Services.Models;
#nullable disable
namespace SpiceAPI.Services.PhotoService
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;
        public PhotoService(IOptions<CloudinarySettings> options)
        {
            var account = new Account(options.Value.CloudName, options.Value.ApiKey, options.Value.ApiSecret);
            _cloudinary = new Cloudinary(account);
        }
        public async Task<Photo> AddPhoto(IFormFile file)
        {
            var photo = new Photo()
            {
                Url = string.Empty,
                PublicId = string.Empty,
            };
            if (file.Length > 0)
            {
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Height(500).Width(500).Crop("fill")
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if (uploadResult.Error != null)
                {
                    throw new Exception(uploadResult.Error.Message);
                }
                photo.Url = uploadResult.SecureUrl.ToString();
                photo.PublicId = uploadResult.PublicId;
            }
            return photo;
        }
        public async Task<string> DeletePhoto(string image)
        {
            var imageArray = image.Split(new char[] { ',' });
            var publicId = imageArray[1];
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok" ? result.Result : null;
        }
    }
}



