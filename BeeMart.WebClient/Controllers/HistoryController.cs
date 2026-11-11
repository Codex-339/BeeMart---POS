using Microsoft.AspNetCore.Mvc;

namespace BeeMart.WebClient.Controllers
{
    public class HistoryController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}