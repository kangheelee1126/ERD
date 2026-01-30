using ErdProject.Server.Models.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ErdProject.Server.Services
{
    public interface IUserService
    {
        Task<List<UserDto>> GetUsersAsync();
        Task<UserDto?> GetUserAsync(int id);
        Task<bool> SaveUserAsync(UserDto userDto);
        Task<bool> DeleteUserAsync(int id);
    }
}
