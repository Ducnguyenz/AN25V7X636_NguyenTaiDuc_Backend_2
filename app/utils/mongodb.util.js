const { MongoClient } = require("mongodb");

class MongoDB {
  static client;

  static connect = async (uri) => {
    if (this.client) return this.client;

    try {
      // 1. Thử kết nối bằng link Local mặc định truyền từ server.js trước
      console.log("Đang thử kết nối Database Local...");
      this.client = await MongoClient.connect(uri);
      console.log("Kết nối Local thành công!");
      return this.client;
    } catch (localError) {
      // 2. Nếu Local sập (trên CodeSandbox), tự nhảy vào đây ăn link Web Online
      console.log(
        "Database Local đang tắt. Tự động chuyển sang dùng link Web Online..."
      );
      try {
        const onlineUri =
          "mongodb+srv://admin:4v23uAba37fWTBW@cluster0.0c2wwgf.mongodb.net/contactbook?appName=Cluster0";
        // sẽ xóa tài khoản truy cập này sao 2 tháng
        this.client = await MongoClient.connect(onlineUri);
        console.log("Kết nối MongoDB Web Online thành công!");
        return this.client;
      } catch (onlineError) {
        console.log(
          "Sập nguồn cả 2 bên! Không kết nối được cái nào hết:",
          onlineError
        );
        throw onlineError;
      }
    }
  };
}

module.exports = MongoDB;
