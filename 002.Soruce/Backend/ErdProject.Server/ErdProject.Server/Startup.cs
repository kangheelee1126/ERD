using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using ErdProject.Server.Data;
using ErdProject.Server.Services;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization; // ✨ 카멜 케이스 설정을 위해 추가

namespace ErdProject.Server
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            // 1. JSON 직렬화 설정 (NewtonsoftJson 활용)
            services.AddControllers()
                .AddNewtonsoftJson(options =>
                {
                    // (1) 순환 참조 무시
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;

                    // ✨ (2) [중요] 카멜 케이스(CamelCase) 자동 변환 설정 추가
                    // 프론트엔드(React)가 "custCd"로 보내면, 백엔드(C#)의 "CustCd"에 자동으로 넣어줍니다.
                    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                });

            // 2. DB 연결 등록
            services.AddDbContext<ErdDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            // 3. 비즈니스 로직 서비스 등록 (DI)
            services.AddScoped<ICommonCodeService, CommonCodeService>();

            // ✨ [추가됨] 고객사 서비스 등록 (500 에러 해결)
            services.AddScoped<ICustomerService, CustomerService>();
            services.AddScoped<IUserService, UserService>();  //사용자 정보 서비스
            // ✨ [추가] 담당자 서비스 등록
            services.AddScoped<IContactService, ContactService>();

            // 4. CORS 설정
            services.AddCors(options =>
            {
                options.AddPolicy("AllowReact",
                    builder => builder.WithOrigins("http://localhost:5173")
                                      .AllowAnyMethod()
                                      .AllowAnyHeader()
                                      .AllowCredentials());
            });

            // 5. Swagger 설정
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "ErdProject.Server", Version = "v1" });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ErdProject.Server v1"));
            }

            app.UseRouting();

            app.UseCors("AllowReact");

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}