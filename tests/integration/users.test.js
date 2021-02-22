const _ = require("lodash");
const { User } = require("../../models/user");
const config = require("config");
const jwt = require("jsonwebtoken");
const app = require("../../app");
const request = require("supertest");
const mongoose = require("mongoose");
const auth = require("../../middleware/auth");

describe("/api/users", () => {
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

  describe("GET /", () => {
    const token = jwt.sign(
      { _id: mongoose.Types.ObjectId(), isAdmin: true },
      config.get("jwtPrivateKey")
    );

    const exec = async () => {
      return await request(app).get("/api/users").set("x-auth-token", token);
    };

    it("should return an array of users", async () => {
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

  describe("POST /", () => {
    let firstName;
    let lastName;
    let eMail;
    let password;

    const exec = async () => {
      return await request(app)
        .post("/api/users")
        .send({ firstName, lastName, eMail, password });
    };

    it("should save the user if it is valid", async () => {
      firstName = "name1";
      lastName = "name2";
      eMail = "name@server.com";
      password = "12345";

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
      firstName = "name1";
      lastName = "name2";
      eMail = "name@server.com";
      password = "12345";

      await exec();

      const user = await User.findOne({ eMail: "name@server.com" });

      expect(user.password).not.toBe(password);
    });

    it("should return 400 if eMail already exists", async () => {
      const user1 = new User({
        firstName: "name1",
        lastName: "name2",
        eMail: "name1@server.com",
        password: "12345",
        isAdmin: false,
      });

      await user1.save();

      eMail = user1.eMail;

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("shoul return 400 if invalid user is passed", async () => {
      const res = await request(app).post("/api/users").send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("PUT /me", () => {
    let _id;
    let firstName;
    let lastName;
    let eMail;
    let password;
    let isAdmin;

    it("should update user", async () => {
      const user = new User({
        firstName: "name1",
        lastName: "name2",
        eMail: "name1@server.com",
        password: "12345",
        isAdmin: false,
      });

      await user.save();

      _id = user._id.toHexString();

      const token = jwt.sign(
        { _id, isAdmin: true },
        config.get("jwtPrivateKey")
      );

      firstName = "updatedName1";
      lastName = "updatedNamem2";
      eMail = "updatedName1@server.com";
      password = "updated12345";
      isAdmin = true;

      const res = await request(app)
        .put("/api/users/me")
        .set("x-auth-token", token)
        .send({
          firstName,
          lastName,
          eMail,
          password,
          isAdmin,
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ _id, firstName, lastName, eMail });
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

      const res = await request(app)
        .put("/api/users/me")
        .set("x-auth-token", token)
        .send({
          firstName,
          lastName,
          eMail,
          password,
          isAdmin,
        });

      const newUser = await User.findById(_id);

      expect(res.status).toBe(200);
      expect(password).not.toBe(newUser.password);
    });

    it("should return 404 if user is not found", async () => {
      const token = jwt.sign(
        { _id: mongoose.Types.ObjectId, isAdmin: true },
        config.get("jwtPrivateKey")
      );

      const res = await request(app)
        .put("/api/users/me")
        .set("x-auth-token", token)
        .send({
          firstName,
          lastName,
          eMail,
          password,
          isAdmin,
        });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });

    it("should update user", async () => {
      const token = jwt.sign(
        { _id: mongoose.Types.ObjectId(), isAdmin: true },
        config.get("jwtPrivateKey")
      );

      const res = await request(app)
        .put("/api/users/me")
        .set("x-auth-token", token)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("PUT /:id", () => {
    let _id;
    let firstName;
    let lastName;
    let eMail;
    let password;
    let isAdmin;

    const token = jwt.sign(
      { _id: mongoose.Types.ObjectId(), isAdmin: true },
      config.get("jwtPrivateKey")
    );

    const exec = async () => {
      return await request(app)
        .put(`/api/users/${_id}`)
        .set("x-auth-token", token)
        .send({
          firstName,
          lastName,
          eMail,
          password,
          isAdmin,
        });
    };

    it("should update user", async () => {
      const user = new User({
        firstName: "name1",
        lastName: "name2",
        eMail: "name1@server.com",
        password: "12345",
        isAdmin: false,
      });

      await user.save();

      _id = user._id.toHexString();
      firstName = "name1Updated";
      lastName = "name2Updated";
      eMail = "name1Updated@server.com";
      password = "12345";
      isAdmin = true;

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ _id, firstName, lastName, eMail });
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

      _id = user._id.toHexString();
      firstName = "name1Updated";
      lastName = "name2Updated";
      eMail = "name1Updated@server.com";
      password = "12345";
      isAdmin = true;

      const res = await exec();
      const newUser = await User.findById(_id);

      expect(res.status).toBe(200);
      expect(password).not.toBe(newUser.password);
    });

    it("should return 400 if invalid user is passed", async () => {
      const res = await request(app)
        .put(`/api/users/${mongoose.Types.ObjectId()}`)
        .set("x-auth-token", token)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 404 if user is not found", async () => {
      _id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("DELETE /me", () => {
    it("should delete user", async () => {
      let user = new User({
        firstName: "name1",
        lastName: "name2",
        eMail: "name1@server.com",
        password: "12345",
        isAdmin: false,
      });

      await user.save();

      _id = user._id.toHexString();

      const token = jwt.sign(
        { _id, isAdmin: false },
        config.get("jwtPrivateKey")
      );
      const res = await request(app)
        .delete("/api/users/me")
        .set("x-auth-token", token);

      user = await User.findById(_id);

      expect(res.status).toBe(200);
      expect(user).toBe(null);
    });

    it("status should be 404 if not user is found", async () => {
      const token = jwt.sign(
        { _id, isAdmin: false },
        config.get("jwtPrivateKey")
      );
      const res = await request(app)
        .delete("/api/users/me")
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("DELETE /:id", () => {
    it("should delete user", async () => {
      let user = new User({
        firstName: "name1",
        lastName: "name2",
        eMail: "name1@server.com",
        password: "12345",
      });
      await user.save();

      const token = jwt.sign(
        { _id: mongoose.Types.ObjectId(), isAdmin: true },
        config.get("jwtPrivateKey")
      );

      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set("x-auth-token", token);

      user = await User.findById(user._id);

      expect(res.status).toBe(200);
      expect(user).toBe(null);
    });
  });

  describe("DELETE /:id", () => {
    it("should return 404 if user is not found", async () => {
      const token = jwt.sign(
        { _id: mongoose.Types.ObjectId(), isAdmin: true },
        config.get("jwtPrivateKey")
      );

      const res = await request(app)
        .delete(`/api/users/${mongoose.Types.ObjectId()}`)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /me", () => {
    it("should return a valid user", async () => {
      const user = new User({
        firstName: "name1",
        lastName: "name2",
        eMail: "name1@server.com",
        password: "12345",
      });
      await user.save();

      _id = user._id.toHexString();

      const token = jwt.sign(
        { _id, isAdmin: false },
        config.get("jwtPrivateKey")
      );

      const res = await request(app)
        .get("/api/users/me")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        _id,
        firstName: "name1",
        lastName: "name2",
        eMail: "name1@server.com",
      });
    });

    it("should return 404 if user is not found", async () => {
      const token = jwt.sign(
        { _id: mongoose.Types.ObjectId(), isAdmin: false },
        config.get("jwtPrivateKey")
      );

      const res = await request(app)
        .get("/api/users/me")
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /:id", () => {
    it("should return a valid user", async () => {
      const user = new User({
        firstName: "name1",
        lastName: "name2",
        eMail: "name1@server.com",
        password: "12345",
      });
      await user.save();

      const token = jwt.sign(
        { _id: mongoose.Types.ObjectId(), isAdmin: true },
        config.get("jwtPrivateKey")
      );

      const res = await request(app)
        .get(`/api/users/${user._id}`)
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        _id: user._id.toHexString(),
        firstName: "name1",
        lastName: "name2",
        eMail: "name1@server.com",
      });
    });

    it("should return a valid user", async () => {
      const token = jwt.sign(
        { _id: mongoose.Types.ObjectId(), isAdmin: true },
        config.get("jwtPrivateKey")
      );

      const res = await request(app)
        .get(`/api/users/${mongoose.Types.ObjectId()}`)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });
});
