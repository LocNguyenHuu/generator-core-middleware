using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Builder;

namespace <%- namespace %>
{
    public class <%- classname %>
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;
        private readonly <%- classname %>Options _options;

        public <%- classname %>(RequestDelegate next, ILoggerFactory loggerFactory, <%- classname %>Options options)
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<<%- classname %>>();
            _options = options;
        }

        public async Task Invoke(HttpContext context)
        {
            await context.Response.WriteAsync(_options.Message);
            await _next(context);
            
        }
    }

    public static class <%- classname %>Extension
    {
        public static IApplicationBuilder Use<%- classname %>(this IApplicationBuilder builder, <%- classname %>Options options)
        {
            return builder.UseMiddleware<<%- classname %>>(options);
        }
    }

    public class <%- classname %>Options
    {
        public <%- classname %>Options()
        {
            Message = "hello from middleware";    
        }

        public string Message { get; set; }
    }
}