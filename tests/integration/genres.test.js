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

  describe("GET /:id", () => {
    it("Should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(app).get("/api/genres/" + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        _id: genre._id.toHexString(),
        name: genre.name,
      });
    });

    it("Should return 400 if invalid id is passed", async () => {
      const res = await request(app).get("/api/genres/1");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("Should return 404 if genre is not found", async () => {
      _id = mongoose.Types.ObjectId().toHexString();

      const res = await request(app).get("/api/genres/" + _id);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /", () => {
    let name;
    let _id;
    let token;

    const exec = async () => {
      return await request(app)
        .post("/api/genres/")
        .set("x-auth-token", token)
        .send({ name });
    };

    it("Should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("Should return 400 if genre is less then 5 characters", async () => {
      _id = mongoose.Types.ObjectId();
      token = jwt.sign({ _id, isAdmin: true }, config.get("jwtPrivateKey"));
      name = "1234";
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should return 400 if genre is more then 50 characters", async () => {
      _id = mongoose.Types.ObjectId();
      token = jwt.sign({ _id, isAdmin: true }, config.get("jwtPrivateKey"));
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("Should save the genre if it is valid", async () => {
      name = "genre1";
      _id = mongoose.Types.ObjectId();
      token = jwt.sign({ _id, isAdmin: true }, config.get("jwtPrivateKey"));

      await exec();

      const genre = await Genre.findOne({ name: "genre1" });

      expect(genre).not.toBe(null);
    });

    it("Should save the genre name", async () => {
      name = "genre1";
      _id = mongoose.Types.ObjectId();
      token = jwt.sign({ _id, isAdmin: true }, config.get("jwtPrivateKey"));

      const res = await exec();

      const genre = await Genre.findOne({ name: "genre1" });

      expect(res.status).toBe(200);
      expect(genre).toHaveProperty("_id", "name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let _id;
    let token;
    let name;

    const exec = async () => {
      return await request(app)
        .put(`/api/genres/${_id}`)
        .set("x-auth-token", token)
        .send({ name });
    };

    it("should update genre", async () => {
      let genre = new Genre({ name: "genre1" });
      await genre.save();

      _id = genre._id.toHexString();
      token = jwt.sign(
        { _id: mongoose.Types.ObjectId(), isAdmin: true },
        config.get("jwtPrivateKey")
      );

      name = "genre1Updated";
      const res = await exec();

      genre = await Genre.findOne({ name: "genre1Updated" });

      expect(res.status).toBe(200);
      expect(genre.name).not.toBe(null);
    });

    it("shoul return 400 if genre name is less than 5 characters", async () => {
      _id = mongoose.Types.ObjectId();
      token = jwt.sign(
        { _id: mongoose.Types.ObjectId(), isAdmin: true },
        config.get("jwtPrivateKey")
      );
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("shoul return 400 if genre name is more than 55 characters", async () => {
      _id = mongoose.Types.ObjectId();
      token = jwt.sign(
        { _id: mongoose.Types.ObjectId(), isAdmin: true },
        config.get("jwtPrivateKey")
      );
      name = new Array(57).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 404 if no genre is found", async () => {
      _id = mongoose.Types.ObjectId();
      token = jwt.sign(
        { _id: mongoose.Types.ObjectId(), isAdmin: true },
        config.get("jwtPrivateKey")
      );

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
});
