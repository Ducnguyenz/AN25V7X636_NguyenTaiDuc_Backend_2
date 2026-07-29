const { ObjectId } = require("mongodb");

class ContactService {
  constructor(client) {
    this.Contact = client.db().collection("contacts");
  }

  // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API

  // Hàm trích xuất và làm sạch dữ liệu đầu vào
  extractContactData(payload) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite,
    };

    // Loại bỏ các trường có giá trị undefined
    Object.keys(contact).forEach(
      (key) => contact[key] === undefined && delete contact[key]
    );
    return contact;
  }

  // 1. Hàm tạo mới hoặc cập nhật nếu đã tồn tại (Upsert)
  async create(payload) {
    const contact = this.extractContactData(payload);
    const result = await this.Contact.findOneAndUpdate(
      contact,
      { $set: { favorite: contact.favorite === true } },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }

  // 2. Hàm tìm kiếm tất cả liên hệ dựa trên bộ lọc (filter)
  async find(filter) {
    const cursor = await this.Contact.find(filter);
    return await cursor.toArray();
  }

  // 3. Hàm tìm kiếm liên hệ theo tên (Không phân biệt hoa thường)
  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  // 4. Tìm một liên hệ duy nhất theo ID
  async findById(id) {
    return await this.Contact.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // 5. Cập nhật liên hệ theo ID
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractContactData(payload);
    const result = await this.Contact.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  // 6. Xóa liên hệ theo ID
  async delete(id) {
    const result = await this.Contact.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  // 7. Tìm tất cả liên hệ yêu thích (favorite = true)
  async findFavorite() {
    return await this.find({ favorite: true });
  }

  // 8. Xóa toàn bộ liên hệ
  async deleteAll() {
    const result = await this.Contact.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = ContactService;
