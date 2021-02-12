const { User } = require("../../../models/user");
const config = require("config");
const jwt = require("jsonwebtoken");
const app = require("../../../app");
const request = require("supertest");
const mongoose = require("mongoose");
const { iteratee, toNumber } = require("lodash");
const { expectCt } = require("helmet");

describe("GET /me", () => {
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

  let _id;
  let firstName;
  let lastName;
  let eMail;
  let password;

  let token;

  const exec = async () => {
    return await request(app).get("/api/users/me").set("x-auth-token", token);
  };

  beforeEach(() => {
    _id = new mongoose.Types.ObjectId().toHexString();
    firstName = "name1";
    lastName = "name2";
    eMail = "name1@server.com";
    password = "12345";

    token = jwt.sign({ _id, isAdmin: false }, config.get("jwtPrivateKey"));
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).get("/api/users/me");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if not a valid token", async () => {
    token = "1";
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 when passed an invalid Id", async () => {
    _id = "1";
    token = jwt.sign({ _id, isAdmin: false }, config.get("jwtPrivateKey"));

    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 404 if not user is found", async () => {
    const res = await exec();

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return a valid user", async () => {
    const user = new User({
      firstName,
      lastName,
      eMail,
      password,
    });
    await user.save();

    _id = user._id.toHexString();
    token = jwt.sign({ _id, isAdmin: false }, config.get("jwtPrivateKey"));

    const res = await exec();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ _id, firstName, lastName, eMail });
  });
});
