const mongoose = require("mongoose");
const { Publisher } = require("../../models/publisher");
const request = require("supertest");
const app = require("../../app");

describe("api/publishers", () => {
  beforeEach(async () => {
    await mongoose.connect("mongodb://localhost:27017/bibloDB_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Publisher.remove({});
    await mongoose.connection.close();
  });

  describe("GET /", () => {
    it("should return all publishers", async () => {
      await Publisher.collection.insertMany([
        { name: "publisher1" },
        { name: "publisher2" },
      ]);
      const res = await request(app).get("/api/publishers");

      expect(res.body.length).toBe(2);
      expect(res.body.some((p) => p.name == "publisher1")).toBeTruthy();
      expect(res.body.some((p) => p.name == "publisher2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("Should return a publisher if valid id is passed", async () => {
      const publisher = new Publisher({ name: "publisher1" });
      await publisher.save();

      const res = await request(app).get("/api/publishers/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", publisher.name);
    });

    it("Should return 404 if ivalid id is passed", async () => {
      const res = await request(app).get("/api/genres/1");
      expect(res.status).toBe(404);
    });
  });
});
