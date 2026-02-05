using ErdProject.Server.Models.Entities.System;
using System;

namespace ErdProject.Server.Utils
{
    public static class dataUtils
    {
        /// <summary>
        /// 엔티티에 감사(Audit) 필드를 주입합니다.
        /// </summary>
        public static void injectAuditFields(object entity)
        {
            var now = DateTime.Now;
            var userId = "SYSTEM"; // 실제 환경에서는 세션 또는 토큰에서 사용자 ID 추출

            // Reflection을 사용하여 필드 주입 (CrtBy, CrtDt 등)
            var type = entity.GetType();

            // 등록 정보 설정 (최초 1회)
            type.GetProperty("CrtDt")?.SetValue(entity, now);
            type.GetProperty("CrtBy")?.SetValue(entity, userId);

            // 수정 정보 설정
            type.GetProperty("UpdDt")?.SetValue(entity, now);
            type.GetProperty("UpdBy")?.SetValue(entity, userId);
        }
    }
}