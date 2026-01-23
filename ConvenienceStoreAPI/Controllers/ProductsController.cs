using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConvenienceStoreAPI.Data;
using ConvenienceStoreAPI.Models;

[Route("api/products")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

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

    product.Name = dto.Name;
    product.Price = dto.Price;
    product.CategoryId = dto.CategoryId;

    await _context.SaveChangesAsync();
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
        return Ok();
    }
}
