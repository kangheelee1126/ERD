using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ErdProject.Server.Models.Dto
{
    public class UserRoleSaveDto
    {
        public int UserNo { get; set; }
        public List<string> RoleIds { get; set; } = new();
    }
}