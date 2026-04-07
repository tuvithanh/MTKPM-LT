using ConvenienceStoreAPI.Data;
using ConvenienceStoreAPI.Infrastructure.Logging;
using ConvenienceStoreAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/products")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ActivityLogger _logger = ActivityLogger.Instance;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/products
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.Products
            .Include(p => p.Category)
            .ToListAsync());
    }

    // POST: api/products
    [HttpPost]
    public async Task<IActionResult> Create(Product product)
    {
          product.Id = 0;
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        _logger.LogCreate("PRODUCT", $"Đã thêm sản phẩm: Id={product.Id}, Name=\"{product.Name}\", Price={product.Price:N0}đ, CategoryId={product.CategoryId}");
        return Ok(product);
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
public async Task<IActionResult> Update(int id, Product dto)
{
    var product = await _context.Products.FindAsync(id);
    if (product == null)
        return NotFound("Product not found");

    // kiểm tra Category tồn tại
    var categoryExists = await _context.Categories
        .AnyAsync(c => c.Id == dto.CategoryId);

    if (!categoryExists)
        return BadRequest("CategoryId does not exist");

        string oldName = product.Name;
        decimal oldPrice = product.Price;
        product.Name = dto.Name;
    product.Price = dto.Price;
    product.CategoryId = dto.CategoryId;

    await _context.SaveChangesAsync();
        _logger.LogUpdate("PRODUCT", $"Đã sửa sản phẩm Id={id}: Name \"{oldName}\"→\"{product.Name}\", Price {oldPrice:N0}→{product.Price:N0}đ");
        return Ok(product);
}
    // DELETE: api/products/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null) return NotFound();

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
        _logger.LogDelete("PRODUCT", $"Đã xóa sản phẩm: Id={id}, Name=\"{product.Name}\", Price={product.Price:N0}đ");
        return Ok();
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0) return BadRequest("File không hợp lệ");

        var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
        if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(folderPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // CHỈ TRẢ VỀ ĐƯỜNG DẪN TƯƠNG ĐỐI
        var relativeUrl = $"/images/{fileName}";
        return Ok(new { url = relativeUrl });
    }
}
