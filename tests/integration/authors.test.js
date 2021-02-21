const _ = require("lodash");
const config = require("config");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const { Author } = require("../../models/author");
const mongoose = require("mongoose");
const app = require("../../app");
const { json } = require("express");

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

  describe("POST /", () => {
    const _id = mongoose.Types.ObjectId();
    const token = jwt.sign({ _id, isAdmin: true }, config.get("jwtPrivateKey"));
    let author;

    const exec = async () => {
      return request(app)
        .post("/api/authors")
        .set("x-auth-token", token)
        .send(author);
    };

    it("should create a new author", async () => {
      author = {
        name: "author1",
        bio: new Array(55).join("a"),
        authorPhoto: "authorPhoto1",
        born: "0001-01-01",
        death: "0001-01-01",
      };

      const res = await exec();

      author = await Author.findOne({ name: "author1" });

      expect(res.status).toBe(200);
      expect(author).toHaveProperty("_id", "name", "bio", "born", "death");
    });

    it("should return 400 if invalid body is passed", async () => {
      author = {};

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("PUT /:id", () => {
    let authorId;
    let updatedAuthor;

    const token = jwt.sign(
      { _id: mongoose.Types.ObjectId(), isAdmin: true },
      config.get("jwtPrivateKey")
    );

    const exec = async () => {
      return await request(app)
        .put(`/api/authors/${authorId}`)
        .set("x-auth-token", token)
        .send(updatedAuthor);
    };

    it("should return an updated author", async () => {
      const author = new Author({
        name: "author1",
        bio: "bio1",
        authorPhoto: "authorPhoto1",
        born: "0001-01-01",
        death: "0001-01-01",
      });
      await author.save();

      authorId = author._id;

      updatedAuthor = {
        name: "author1-updated",
        bio: "bio1-updated",
        authorPhoto: "authorPhoto1-updated",
        born: "0001-02-02T00:00:00.000Z",
        death: "0001-02-02T00:00:00.000Z",
      };

      const res = await exec();

      updatedAuthor._id = author._id.toHexString();

      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedAuthor);
    });

    it("should return 404 if not author was found", async () => {
      authorId = mongoose.Types.ObjectId();

      updatedAuthor = {
        name: "author1-updated",
        bio: "bio1-updated",
        authorPhoto: "authorPhoto1-updated",
        born: "0001-02-02T00:00:00.000Z",
        death: "0001-02-02T00:00:00.000Z",
      };

      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 if invalid body is passed", async () => {
      const authorId = mongoose.Types.ObjectId();
      updatedAuthor = {};

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("DELETE /:id", () => {
    let authorId;
    const token = jwt.sign(
      { _id: mongoose.Types.ObjectId(), isAdmin: true },
      config.get("jwtPrivateKey")
    );

    const exec = async () => {
      return await request(app)
        .delete(`/api/authors/${authorId}`)
        .set("x-auth-token", token);
    };

    it("should delete author if valid Id is passed", async () => {
      let author = new Author({
        name: "author1",
        bio: "bio1",
        authorPhoto: "authorPhoto1",
        born: "0001-01-01",
        death: "0001-01-01",
      });
      await author.save();

      authorId = author._id;
      const res = await exec();

      author = await Author.findById(authorId);

      expect(res.status).toBe(200);
      expect(author).toBe(null);
    });

    it("should return 404 if user was not found", async () => {
      authorId = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /:id", () => {
    let authorId;

    const exec = async () => {
      return request(app).get(`/api/authors/${authorId}`);
    };

    it("should return an author is valid Id is passed", async () => {
      let author = new Author({
        name: "author1",
        bio: "bio1",
        authorPhoto: "authorPhoto1",
        born: "0001-01-01",
        death: "0001-01-01",
      });
      await author.save();

      authorId = author._id;
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "_id",
        "name",
        "bio",
        "authorPhoto",
        "born",
        "death"
      );
    });

    it("should return 404 if not user was found", async () => {
      authorId = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });
});
