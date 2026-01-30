using Microsoft.AspNetCore.Mvc;
using ErdProject.Server.Models.Dtos;
using ErdProject.Server.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace ErdProject.Server.Controllers
{
    [ApiController]
    [Route("api/system/customer")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<CustomerDto>>> GetCustomers(
            [FromQuery] int page = 1,
            [FromQuery] int size = 10,
            [FromQuery] string? keyword = null)
        {
            var result = await _customerService.GetCustomersAsync(page, size, keyword);
            return Ok(result);
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveCustomers([FromBody] List<CustomerDto> dtos)
        {
            try
            {
                if (dtos == null || dtos.Count == 0) return BadRequest("저장할 데이터가 없습니다.");
                await _customerService.SaveCustomersAsync(dtos);
                return Ok(new { message = "성공적으로 저장되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(long id)
        {
            try
            {
                await _customerService.DeleteCustomerAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}