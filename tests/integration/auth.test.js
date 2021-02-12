const app = require("../../app");
const mongoose = require("mongoose");
const request = require("supertest");
const { User } = require("../../models/user");
const bcrypt = require("bcrypt");

describe("POST /", () => {
  let eMail;
  let password;

  beforeEach(async () => {
    await mongoose.connect("mongodb://localhost:27017/bibloDB_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  const exec = async () => {
    return await request(app).post("/api/auth").send({
      eMail,
      password,
    });
  };

  afterEach(async () => {
    await User.remove({});
    await mongoose.connection.close();
  });

  it("should return 400 eMail is less than 5 characters", async () => {
    eMail = "1234";
    password = "userpassword";

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 eMail is more than 255 characters", async () => {
    eMail = new Array(257).join("a");
    password = "userpassword";

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if eMail is not valid", async () => {
    eMail = "123456";
    password = "userpassword";

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if password is less than 5 characters", async () => {
    eMail = "name1@server.com";
    password = "1234";

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if password is less than 5 characters", async () => {
    eMail = "name1@server.com";
    password = new Array(1026).join("a");

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if user eMail not exist", async () => {
    password = "userpassword";

    user = new User({
      firstName: "name1",
      lastName: "name2",
      eMail: "name1@server.com",
      password: bcrypt.hashSync(password, 10),
    });

    await user.save();

    eMail = "name2@server.com";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 400 if user password is not correct", async () => {
    password = "userpassword";

    user = new User({
      firstName: "name1",
      lastName: "name2",
      eMail: "name1@server.com",
      password: bcrypt.hashSync(password, 10),
    });

    await user.save();

    eMail = user.eMail;
    password = "wrongpassword";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should authenticate user", async () => {
    password = "userpassword";

    user = new User({
      firstName: "name1",
      lastName: "name2",
      eMail: "name1@server.com",
      password: bcrypt.hashSync(password, 10),
    });

    await user.save();

    eMail = user.eMail;

    const res = await exec();

    expect(res.status).toBe(200);
  });
});
