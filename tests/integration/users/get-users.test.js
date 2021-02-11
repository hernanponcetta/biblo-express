const { User } = require("../../../models/user");
const config = require("config");
const jwt = require("jsonwebtoken");
const app = require("../../../app");
const request = require("supertest");
const mongoose = require("mongoose");

describe("GET /", () => {
  beforeEach(async () => {
    await mongoose.connect("mongodb://localhost:27017/bibloDB_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await User.remove({});
    await mongoose.connection.close();
  });

  const exec = async () => {
    return await request(app).get("/api/users").set("x-auth-token", token);
  };

  let token = jwt.sign({ isAdmin: false }, config.get("jwtPrivateKey"));

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if token is not valid", async () => {
    token = "1";

    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 403 if user is not admin", async () => {
    token = jwt.sign({ isAdmin: false }, config.get("jwtPrivateKey"));

    const res = await exec();

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty("error");
  });

  it("should an array of users", async () => {
    token = jwt.sign({ isAdmin: true }, config.get("jwtPrivateKey"));

    await User.collection.insertMany([
      {
        firstName: "name1",
        lastName: "name2",
        eMail: "name1@server.com",
        password: "12345",
      },
      {
        firstName: "name3",
        lastName: "name4",
        eMail: "name2@server.com",
        password: "12345",
      },
    ]);

    const res = await exec();

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
});
