const { User } = require("../../../models/user");
const config = require("config");
const jwt = require("jsonwebtoken");
const app = require("../../../app");
const request = require("supertest");
const mongoose = require("mongoose");

describe("POST /", () => {
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

  let firstName;
  let lastName;
  let eMail;
  let password;

  const exec = async () => {
    return await request(app)
      .post("/api/users")
      .send({ firstName, lastName, eMail, password });
  };

  beforeEach(() => {
    firstName = "name1";
    lastName = "name2";
    eMail = "name@server.com";
    password = "12345";
  });

  it("sholud return 400 if firstName is less than 5 characters", async () => {
    firstName = "1234";

    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if firstName more than 50 characters", async () => {
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

  it("should return 400 if lastName more than 50 characters", async () => {
    lastName = new Array(52).join("a");

    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if email is less than 5 characters", async () => {
    eMail = "1234";

    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if email is more than 255 characters", async () => {
    eMail = new Array(257).join("a");

    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if email is not valid", async () => {
    eMail = new Array(30).join("a");

    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if password is less than 5 characters", async () => {
    password = "1234";

    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if password is more than 1024 characters", async () => {
    password = new Array(1026).join("a");

    const res = await exec();

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should save the user if it is valid", async () => {
    const res = await exec();

    const user = await User.findOne({ eMail: "name@server.com" });

    expect(res.status).toBe(200);
    expect(user).toHaveProperty(
      "_id",
      "firstName",
      "lastName",
      "eMail",
      "password",
      "isAdmin"
    );
  });

  it("should hash the password", async () => {
    await exec();

    const user = await User.findOne({ eMail: "name@server.com" });

    expect(user.password).not.toBe(password);
  });
});
