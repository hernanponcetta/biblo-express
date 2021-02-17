const request = require("supertest");
const { Author } = require("../../models/author");
const mongoose = require("mongoose");
const app = require("../../app");

describe("/api/authors", () => {
  beforeEach(async () => {
    await mongoose.connect("mongodb://localhost:27017/bibloDB_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Author.remove({});
    await mongoose.connection.close();
  });

  describe("GET /", () => {
    it("should return all authors", async () => {
      await Author.collection.insertMany([
        {
          name: "author1",
          bio: "bio1",
          authorPhoto: "authorPhoto1",
          born: "0001-01-01",
          death: "0001-01-01",
        },
        {
          name: "author2",
          bio: "bio2",
          authorPhoto: "authorPhoto2",
          born: "2000-01-01",
          death: "2000-01-01",
        },
      ]);
      const res = await request(app).get("/api/authors");

      expect(res.body.length).toBe(2);
      expect(res.body.some((a) => a.name == "author1")).toBeTruthy();
      expect(res.body.some((a) => a.name == "author2")).toBeTruthy();
    });
  });
});
