using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ErdProject.Server.Data;
// ✨ 서비스 레이어 참조를 위한 네임스페이스 추가
using ErdProject.Server.Services;
// NewtonsoftJson 사용을 위한 네임스페이스
using Newtonsoft.Json;

namespace ErdProject.Server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        /// <summary>
        /// 애플리케이션에서 사용할 서비스 부품들을 컨테이너에 등록합니다. (Dependency Injection)
        /// </summary>
        public void ConfigureServices(IServiceCollection services)
        {
            // 1. JSON 직렬화 설정 (NewtonsoftJson 활용)
            // 메뉴의 트리 구조나 공통코드의 계층 데이터 전송 시 순환 참조 에러를 방지합니다.
            services.AddControllers()
                .AddNewtonsoftJson(options =>
                {
                    // 부모-자식 객체 간의 무한 루프 참조를 무시하여 정상적인 JSON을 생성합니다.
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                });

            // 2. DB 연결 등록 (Entity Framework Core)
            // appsettings.json에 정의된 'DefaultConnection' 문자열을 사용하여 SQL Server에 연결합니다.
            services.AddDbContext<ErdDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // 3. ✨ 비즈니스 로직 서비스 등록 (의존성 주입)
            // 컨트롤러에서 ICommonCodeService를 요청할 때 CommonCodeService 인스턴스를 생성하여 제공합니다.
            // Scoped는 HTTP 요청 한 번당 하나의 인스턴스를 유지합니다.
            services.AddScoped<ICommonCodeService, CommonCodeService>();

            // 4. CORS 설정 (프론트엔드 React Vite 환경 허용)
            // 로컬 개발 환경의 Vite(5173) 포트에서 오는 API 요청을 허용합니다.
            services.AddCors(options =>
            {
                options.AddPolicy("AllowReact",
                    builder => builder.WithOrigins("http://localhost:5173")
                                      .AllowAnyMethod()
                                      .AllowAnyHeader()
                                      .AllowCredentials());
            });

            // 5. Swagger API 문서화 설정
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ErdProject.Server", Version = "v1" });
            });
        }

        /// <summary>
        /// HTTP 요청이 들어왔을 때 거쳐가는 통로(미들웨어 파이프라인)를 구성합니다.
        /// </summary>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // 개발 환경에서의 설정 (예외 페이지, 스웨거 노출)
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ErdProject.Server v1"));
            }

            // HTTPS 보안 연결 강제화 (필요 시 주석 해제)
            // app.UseHttpsRedirection();

            // 라우팅 활성화
            app.UseRouting();

            // ✨ 중요: CORS 정책 적용 (반드시 UseRouting과 UseEndpoints 사이에 위치)
            app.UseCors("AllowReact");

            // 인증 및 권한 부여 활성화
            app.UseAuthorization();

            // API 엔드포인트 매핑
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}