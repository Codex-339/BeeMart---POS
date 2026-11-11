using Microsoft.AspNetCore.Mvc;

namespace BeeMart.WebClient.Controllers
{
    public class POSController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}