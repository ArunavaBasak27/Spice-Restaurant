using Microsoft.EntityFrameworkCore;
using SpiceAPI.Data;
using SpiceAPI.Mapper;
using SpiceAPI.Services.Models;
using SpiceAPI.Services.PhotoService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAutoMapper(typeof(Mappings));
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.AddCors();
var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUI();
}
else
{
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API v1");
        options.RoutePrefix = string.Empty;
    });

}

app.UseHttpsRedirection();
app.UseCors(options => options.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod().WithExposedHeaders());
app.UseAuthorization();

app.MapControllers();

app.Run();
