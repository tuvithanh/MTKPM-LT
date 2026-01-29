using ConvenienceStoreAPI.Data;
using ConvenienceStoreAPI.Infrastructure.AuthStrategies;
using ConvenienceStoreAPI.Infrastructure.Factories;
using ConvenienceStoreAPI.Services.Implementations;
using ConvenienceStoreAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. Cấu hình DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Đăng ký các dịch vụ Auth (Fix lỗi Unable to resolve service)
builder.Services.AddScoped<IAuthStrategy, LocalAuthStrategy>();
builder.Services.AddScoped<IAuthFactory, AuthFactory>();
builder.Services.AddScoped<IAuthService, AuthService>();

// 3. Cấu hình Authentication với JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            // Đọc Key từ appsettings.json
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// 4. Cấu hình CORS cho React (Mặc định React chạy port 3000 hoặc 5173)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowReact", policy => {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 5. Cấu hình Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Bật CORS trước Authentication
app.UseCors("AllowReact");

app.UseAuthentication(); // Xác thực danh tính
app.UseAuthorization();  // Phân quyền

app.MapControllers();

app.Run();