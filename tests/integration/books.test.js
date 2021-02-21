const app = require("../../app");
const mongoose = require("mongoose");
const { Book } = require("../../models/book");
const request = require("supertest");

describe("/api/books", () => {
  beforeEach(async () => {
    await mongoose.connect("mongodb://localhost:27017/bibloDB_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Book.remove({});
    await mongoose.connection.close();
  });

  describe("GET /", () => {
    it("should return all books", async () => {
      await Book.collection.insertMany([
        {
          title: "title1",
          author: {
            _id: mongoose.Types.ObjectId(),
            name: "author1",
          },
          price: 10,
          publisher: {
            _id: mongoose.Types.ObjectId(),
            name: "publisher1",
          },
          itemStock: 0,
          genre: {
            _id: mongoose.Types.ObjectId(),
            name: "genre1",
          },
          isbn: 1111111111111,
          available: true,
          bookCover: "bookcover1",
        },
        {
          title: "title2",
          author: {
            _id: mongoose.Types.ObjectId(),
            name: "author2",
          },
          price: 10,
          publisher: {
            _id: mongoose.Types.ObjectId(),
            name: "publisher2",
          },
          itemStock: 0,
          genre: {
            _id: mongoose.Types.ObjectId(),
            name: "genre2",
          },
          isbn: 1111111111111,
          available: true,
          bookCover: "bookcover2",
        },
      ]);

      const res = await request(app).get("/api/books");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((b) => b.title == "title1")).toBeTruthy();
      expect(res.body.some((b) => b.title == "title2")).toBeTruthy();
    });
  });
});
