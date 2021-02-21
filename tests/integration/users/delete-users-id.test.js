const { User } = require("../../../models/user");
const config = require("config");
const jwt = require("jsonwebtoken");
const app = require("../../../app");
const request = require("supertest");
const mongoose = require("mongoose");

describe("DELETE /:id", () => {
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

  const exec = async () => {
    return await request(app)
      .delete(`/api/users/${_id}`)
      .set("x-auth-token", token);
  };

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).delete(`/api/users/${_id}`);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("should return 400 if not a valid token", async () => {
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

  it("status should be 404 if not user is found", async () => {
    _id = mongoose.Types.ObjectId();
    token = jwt.sign({ isAdmin: true }, config.get("jwtPrivateKey"));

    const res = await exec();

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("should delete user", async () => {
    const user = new User({
      firstName: "name1",
      lastName: "name2",
      eMail: "name1@server.com",
      password: "12345",
    });
    await user.save();

    _id = user._id.toHexString();
    token = jwt.sign({ isAdmin: true }, config.get("jwtPrivateKey"));

    const res = await exec();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      _id,
      firstName: user.firstName,
      lastName: user.lastName,
      eMail: user.eMail,
    });
  });
});
