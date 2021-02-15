const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { Publisher } = require("../../models/publisher");
const { User } = require("../../models/user");
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

      const res = await request(app).get("/api/publishers/" + publisher._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", publisher.name);
    });

    it("Should return 400 if invalid id is passed", async () => {
      const res = await request(app).get("/api/publishers/1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no publisher is found", async () => {
      const _id = mongoose.Types.ObjectId();

      const res = await request(app).get("/api/publishers/" + _id);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("POST /", () => {
    let token;
    let isAdmin;
    let name;

    const exec = async () => {
      return await request(app)
        .post("/api/publishers")
        .set("x-auth-token", token)
        .send({
          name,
        });
    };

    it("should create a new publisher", async () => {
      name = "publisher1";
      _id = mongoose.Types.ObjectId();
      token = jwt.sign({ _id, isAdmin: true }, config.get("jwtPrivateKey"));

      const res = await exec();

      const publisher = await Publisher.findOne({ name: "publisher1" });

      expect(res.status).toBe(200);
      expect(publisher).toHaveProperty("_id", "name", "publisher1");
    });

    it("should return 401 if no token is passed", async () => {
      const res = await request(app).post("/api/publishers");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 if invalid token is passed", async () => {
      token = "1";

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 403 if publisher is not an admin", async () => {
      token = jwt.sign({ _id, isAdmin: false }, config.get("jwtPrivateKey"));

      const res = await exec();

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 if publisher is less than 5 characters", async () => {
      name = "1234";
      _id = mongoose.Types.ObjectId();
      token = jwt.sign({ _id, isAdmin: true }, config.get("jwtPrivateKey"));

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 if publisher is more than 55 characters", async () => {
      name = new Array(57).join("a");
      _id = mongoose.Types.ObjectId();
      token = jwt.sign({ _id, isAdmin: true }, config.get("jwtPrivateKey"));

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("PUT /:id", () => {
    let _id;
    let token;
    let isAdmin;
    let name;

    const exec = async () => {
      return await request(app)
        .put(`/api/publishers/${_id}`)
        .set("x-auth-token", token)
        .send({
          name,
        });
    };

    it("should update a publisher", async () => {
      let publisher = new Publisher({
        name: "publisher1",
      });
      await publisher.save();

      _id = publisher._id;
      name = "publisher1Updated";

      token = jwt.sign({ _id, isAdmin: true }, config.get("jwtPrivateKey"));

      const res = await exec();

      publisher = await Publisher.findOne({ name: "publisher1Updated" });

      expect(res.status).toBe(200);
      expect(publisher).toHaveProperty("_id", "name", "publisher1Updated");
    });

    it("should return 400 if invalid Id is passed", async () => {
      token = jwt.sign({ isAdmin: true }, config.get("jwtPrivateKey"));

      _id = "1";

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 name is less than 5 characters", async () => {
      token = jwt.sign({ isAdmin: true }, config.get("jwtPrivateKey"));
      _id = mongoose.Types.ObjectId();
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 404 if not user is found", async () => {
      token = jwt.sign({ isAdmin: true }, config.get("jwtPrivateKey"));
      _id = mongoose.Types.ObjectId();
      name = "publisher1";

      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("DELETE /:id", () => {
    let _id;
    let token;

    const exec = async () => {
      return await request(app)
        .delete(`/api/publishers/${_id}`)
        .set("x-auth-token", token);
    };

    it("should delete publisher", async () => {
      const publisher = new Publisher({ name: "publisher1" });
      await publisher.save();

      token = jwt.sign({ isAdmin: true }, config.get("jwtPrivateKey"));

      _id = publisher._id.toHexString();

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ _id, name: publisher.name });
    });

    it("should return 400 if invalid Id is passed", async () => {
      _id = "1";

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("shoul return 404 if no publisher is found", async () => {
      token = jwt.sign({ isAdmin: true }, config.get("jwtPrivateKey"));

      _id = mongoose.Types.ObjectId().toHexString();

      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });
});
