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
// NewtonsoftJson 사용을 위한 네임스페이스 (패키지 설치 후 활성화)
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

        // 이 메서드는 런타임에 의해 호출됩니다. 컨테이너에 서비스를 추가하는 데 사용합니다.
        public void ConfigureServices(IServiceCollection services)
        {
            // 1. JSON 순환 참조 방지 설정 (계층형 메뉴 구조 전송 시 필수)
            // .NET 5.0 패키지 설치 후 .AddNewtonsoftJson()을 연결합니다.
            services.AddControllers()
                .AddNewtonsoftJson(options =>
                {
                    // 부모-자식 간의 무한 순환 참조를 방지하여 트리 구조 데이터를 정상적으로 직렬화합니다.
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                    // 속성 이름을 카멜 케이스(camelCase)로 유지하고 싶다면 아래 설정을 추가할 수 있습니다.
                    // options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
                });

            // 2. DB 연결 등록 (appsettings.json의 DefaultConnection 사용)
            services.AddDbContext<ErdDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // 3. CORS 설정 (React Vite 포트 5173 허용)
            services.AddCors(options =>
            {
                options.AddPolicy("AllowReact",
                    builder => builder.WithOrigins("http://localhost:5173")
                                      .AllowAnyMethod()
                                      .AllowAnyHeader()
                                      .AllowCredentials()); // 쿠키나 인증 헤더 사용 시 필요
            });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ErdProject.Server", Version = "v1" });
            });
        }

        // 이 메서드는 런타임에 의해 호출됩니다. HTTP 요청 파이프라인을 구성하는 데 사용합니다.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ErdProject.Server v1"));
            }

            // 개발 환경에서 HTTPS 인증서 문제가 번거롭다면 잠시 주석 처리 가능합니다.
            app.UseHttpsRedirection();

            app.UseRouting();

            // ✨ 중요: UseCors는 반드시 UseRouting과 UseEndpoints 사이에 위치해야 합니다.
            app.UseCors("AllowReact");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}