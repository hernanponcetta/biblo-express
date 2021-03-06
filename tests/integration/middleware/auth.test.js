const config = require("config");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../../../app");
const request = require("supertest");
const { User } = require("../../../models/user");
const { Genre } = require("../../../models/genre");

describe("Auth middleware", () => {
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

  let token;
  let _id;

  const exec = () => {
    return request(app)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  it("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    _id = mongoose.Types.ObjectId();
    token = jwt.sign({ _id, isAdmin: true }, config.get("jwtPrivateKey"));

    const res = await exec();

    expect(res.status).toBe(200);
  });
});
