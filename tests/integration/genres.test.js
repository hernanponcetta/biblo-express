const config = require("config");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

describe("/api/genre", () => {
  beforeEach(async () => {
    await mongoose.connect("mongodb://localhost:27017/bibloDB_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Genre.remove({});
    await mongoose.connection.close();
  });

  describe("GET /", () => {
    it("Should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);
      const res = await request(app).get("/api/genres");

      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name == "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name == "genre2")).toBeTruthy();
    });
  });

  describe("POST /", () => {
    let name;

    const token = jwt.sign(
      { _id: mongoose.Types.ObjectId(), isAdmin: true },
      config.get("jwtPrivateKey")
    );

    const exec = async () => {
      return await request(app)
        .post("/api/genres/")
        .set("x-auth-token", token)
        .send({ name });
    };

    it("Should save the genre", async () => {
      name = "genre1";
      _id = mongoose.Types.ObjectId();

      await exec();

      const genre = await Genre.findOne({ name: "genre1" });

      expect(genre).not.toBe(null);
    });

    it("Should return 400 if invalid genre is passed", async () => {
      _id = mongoose.Types.ObjectId();
      name = {};

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("PUT /:id", () => {
    let genreId;
    let name;

    const token = jwt.sign(
      { _id: mongoose.Types.ObjectId(), isAdmin: true },
      config.get("jwtPrivateKey")
    );

    const exec = async () => {
      return await request(app)
        .put(`/api/genres/${genreId}`)
        .set("x-auth-token", token)
        .send({ name });
    };

    it("should update genre", async () => {
      let genre = new Genre({ name: "genre1" });
      await genre.save();

      genreId = genre._id.toHexString();

      name = "genre1Updated";
      const res = await exec();

      genre = await Genre.findOne({ name: "genre1Updated" });

      expect(res.status).toBe(200);
      expect(genre.name).not.toBe(null);
    });

    it("shoul return 400 if an invalida genre is passed", async () => {
      genreId = mongoose.Types.ObjectId();
      name = {};

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 404 if no genre is found", async () => {
      genreId = mongoose.Types.ObjectId();

      name = "genre1";
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("DELETE /:id", () => {
    let _id;
    let token;
    let name;

    const exec = async () => {
      return await request(app)
        .delete(`/api/genres/${_id}`)
        .set("x-auth-token", token);
    };

    it("should delete the genre", async () => {
      let genre = new Genre({ name: "genre1" });
      await genre.save();

      _id = genre._id.toHexString();
      token = jwt.sign(
        { _id: mongoose.Types.ObjectId(), isAdmin: true },
        config.get("jwtPrivateKey")
      );

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ _id, name: genre.name });
    });

    it("should return 404 if not genre is found", async () => {
      _id = mongoose.Types.ObjectId();
      token = jwt.sign(
        { _id: mongoose.Types.ObjectId(), isAdmin: true },
        config.get("jwtPrivateKey")
      );

      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /:id", () => {
    let genreId;
    const exec = async () => {
      return request(app).get(`/api/genres/${genreId}`);
    };
    it("Should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      genreId = genre._id;
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        _id: genre._id.toHexString(),
        name: genre.name,
      });
    });

    it("Should return 404 if genre was not found", async () => {
      genreId = mongoose.Types.ObjectId().toHexString();
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });
});
