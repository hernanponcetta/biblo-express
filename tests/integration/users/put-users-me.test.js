const { User } = require("../../../models/user");
const config = require("config");
const jwt = require("jsonwebtoken");
const app = require("../../../app");
const request = require("supertest");
const mongoose = require("mongoose");

describe("PUT /me", () => {
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
  let token;
  let firstName;
  let lastName;
  let eMail;
  let password;
  let isAdmin;

  const exec = async () => {
    return await request(app)
      .put("/api/users/me")
      .set("x-auth-token", token)
      .send({
        firstName,
        lastName,
        eMail,
        password,
        isAdmin,
      });
  };

  beforeEach(() => {
    _id = new mongoose.Types.ObjectId().toHexString();
    firstName = "updatedName1";
    lastName = "updatedNamem2";
    eMail = "updatedName1@server.com";
    password = "updated12345";
    isAdmin = true;

    token = jwt.sign({ _id: _id, isAdmin: false }, config.get("jwtPrivateKey"));
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).put("/api/users/me");

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if not a valid token", async () => {
    token = "1";
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if is send a not valid Id", async () => {
    token = jwt.sign({ _id: "1", isAdmin: false }, config.get("jwtPrivateKey"));
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 404 if user is not found", async () => {
    const res = await exec();

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if firstName is less than 5 characters", async () => {
    firstName = "1234";
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if firstName is more than 50 characters", async () => {
    firstName = new Array(52).join("a");
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if lastName is less than 5 characters", async () => {
    lastName = "1234";
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if lastName is more than 50 characters", async () => {
    lastName = new Array(52).join("a");
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if eMail is invalid", async () => {
    eMail = "name1.server";
    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if eMail already exists", async () => {
    const user1 = new User({
      firstName: "name1",
      lastName: "name2",
      eMail: "name1@server.com",
      password: "12345",
      isAdmin: false,
    });

    const user2 = new User({
      firstName: "name3",
      lastName: "name4",
      eMail: "name3@server.com",
      password: "12345",
      isAdmin: false,
    });

    await user1.save();
    await user2.save();

    token = jwt.sign({ _id: _id, isAdmin: false }, config.get("jwtPrivateKey"));
    eMail = user2.eMail;

    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("shoul update user", async () => {
    const user = new User({
      firstName: "name1",
      lastName: "name2",
      eMail: "name1@server.com",
      password: "12345",
      isAdmin: false,
    });

    await user.save();

    token = jwt.sign(
      { _id: user._id, isAdmin: false },
      config.get("jwtPrivateKey")
    );

    const res = await exec();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ firstName, lastName, eMail });
  });

  it("password should be hashed", async () => {
    const user = new User({
      firstName: "name1",
      lastName: "name2",
      eMail: "name1@server.com",
      password: "12345",
      isAdmin: false,
    });

    await user.save();

    token = jwt.sign(
      { _id: user._id, isAdmin: false },
      config.get("jwtPrivateKey")
    );

    _id = user._id;

    const res = await exec();
    const newUser = await User.findById(_id);

    expect(res.status).toBe(200);
    expect(password).not.toBe(newUser.password);
  });
});
