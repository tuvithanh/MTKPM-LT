using ConvenienceStoreAPI.Data;     
using ConvenienceStoreAPI.Infrastructure.Logging;
using ConvenienceStoreAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/categories")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ActivityLogger _logger = ActivityLogger.Instance;
    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/categories
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _context.Categories.ToListAsync());
    }

    // POST: api/categories
    [HttpPost]
    public async Task<IActionResult> Create(Category category)
    {
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();
        _logger.LogCreate("CATEGORY", $"Đã thêm danh mục: Id={category.Id}, Name=\"{category.Name}\"");
        return Ok(category);
    }

    // PUT: api/categories/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Category category)
    {
        var existing = await _context.Categories.AsNoTracking()
                                               .FirstOrDefaultAsync(c => c.Id == id);
        string oldName = existing?.Name ?? "N/A";
        category.Id = id;

        _context.Entry(category).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        _logger.LogUpdate("CATEGORY", $"Đã sửa danh mục Id={id}: \"{oldName}\" → \"{category.Name}\"");
        return Ok(category);
    }

    // DELETE: api/categories/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        _logger.LogDelete("CATEGORY", $"Đã xóa danh mục: Id={id}, Name=\"{category.Name}\"");
        return Ok();
    }
}
