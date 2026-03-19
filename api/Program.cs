var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

// Configure CORS to allow Angular dev server (development only)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// In development, enable CORS for the Angular dev server
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowAngularDev");
}

// Serve Angular static files from wwwroot (production)
app.UseDefaultFiles();
app.UseStaticFiles();

// Map controllers
app.MapControllers();

// Fallback to index.html for Angular client-side routing
app.MapFallbackToFile("index.html");

app.Run();
