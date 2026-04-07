namespace ConvenienceStoreAPI.Infrastructure.Logging
{
    /// <summary>
    /// Singleton Lazy Initialization Logger
    /// Ghi lịch sử thêm/sửa/xóa Category và Product ra file .txt
    /// </summary>
    public class ActivityLogger
    {
        // -------------------------------------------------------
        // SINGLETON: Lazy Initialization + Double-Check Locking
        // -------------------------------------------------------
        private static ActivityLogger? _instance;
        private static readonly object _lock = new object();

        public static ActivityLogger Instance
        {
            get
            {
                if (_instance == null)                  // Lần kiểm tra 1 (không lock → nhanh)
                {
                    lock (_lock)
                    {
                        if (_instance == null)          // Lần kiểm tra 2 (bên trong lock → an toàn)
                        {
                            _instance = new ActivityLogger();
                        }
                    }
                }
                return _instance;
            }
        }

        // -------------------------------------------------------
        // PRIVATE CONSTRUCTOR — ngăn tạo instance từ bên ngoài
        // -------------------------------------------------------
        private readonly string _filePath;

        private ActivityLogger()
        {
            // File log nằm ở: <project_root>/Logs/activity_log.txt
            string logDir = Path.Combine(Directory.GetCurrentDirectory(), "Logs");
            Directory.CreateDirectory(logDir); // Tạo thư mục nếu chưa có
            _filePath = Path.Combine(logDir, "activity_log.txt");
        }

        // -------------------------------------------------------
        // CORE METHOD — ghi 1 dòng log vào file
        // -------------------------------------------------------
        public void Log(string action, string target, string detail)
        {
            string timestamp = DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss");
            string line = $"[{timestamp}] [{action.ToUpper()}] [{target}] {detail}";

            // AppendAllText: ghi thêm vào cuối file, không xóa nội dung cũ
            File.AppendAllText(_filePath, line + Environment.NewLine);
        }

        // -------------------------------------------------------
        // HELPER METHODS — tiện gọi trong controller
        // -------------------------------------------------------
        public void LogCreate(string target, string detail) => Log("CREATE", target, detail);
        public void LogUpdate(string target, string detail) => Log("UPDATE", target, detail);
        public void LogDelete(string target, string detail) => Log("DELETE", target, detail);
    }
}