const jwt = require("jsonwebtoken");
const config = require("config");
const app = require("../../app");
const mongoose = require("mongoose");
const { Book } = require("../../models/book");
const { Genre } = require("../../models/genre");
const { Publisher } = require("../../models/publisher");
const { Author } = require("../../models/author");
const request = require("supertest");

describe("/api/books", () => {
  beforeEach(async () => {
    await mongoose.connect("mongodb://localhost:27017/bibloDB_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Book.remove({});
    await Author.remove({});
    await Genre.remove({});
    await Publisher.remove({});

    await mongoose.connection.close();
  });

  describe("GET /", () => {
    it("should return all books", async () => {
      await Book.collection.insertMany([
        {
          title: "title1",
          author: {
            _id: mongoose.Types.ObjectId(),
            name: "author1",
          },
          price: 10,
          publisher: {
            _id: mongoose.Types.ObjectId(),
            name: "publisher1",
          },
          itemStock: 0,
          genre: {
            _id: mongoose.Types.ObjectId(),
            name: "genre1",
          },
          isbn: 1111111111111,
          available: true,
          bookCover: "bookcover1",
        },
        {
          title: "title2",
          author: {
            _id: mongoose.Types.ObjectId(),
            name: "author2",
          },
          price: 10,
          publisher: {
            _id: mongoose.Types.ObjectId(),
            name: "publisher2",
          },
          itemStock: 0,
          genre: {
            _id: mongoose.Types.ObjectId(),
            name: "genre2",
          },
          isbn: 1111111111111,
          available: true,
          bookCover: "bookcover2",
        },
      ]);

      const res = await request(app).get("/api/books");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((b) => b.title == "title1")).toBeTruthy();
      expect(res.body.some((b) => b.title == "title2")).toBeTruthy();
    });
  });

  describe("POST /", () => {
    let authorId;
    let genreId;
    let publisherId;

    const token = jwt.sign(
      { _id: mongoose.Types.ObjectId(), isAdmin: true },
      config.get("jwtPrivateKey")
    );

    const exec = async () => {
      return await request(app)
        .post("/api/books")
        .set("x-auth-token", token)
        .send({
          title: "title1",
          authorId: authorId,
          price: 1,
          publisherId: publisherId,
          itemStock: 1,
          genreId: genreId,
          isbn: 1111111111111,
          available: true,
          bookCover: "bookCover1",
        });
    };
    it("should create a new book", async () => {
      author = new Author({
        name: "author1",
        bio: "bio1",
        authorPhoto: "authorPhoto1",
        born: "0001-01-01",
        death: "0001-01-01",
      });
      await author.save();
      authorId = author._id;

      genre = new Genre({ name: "genre1" });
      await genre.save();
      genreId = genre._id;

      publisher = new Publisher({ name: "publisher1" });
      await publisher.save();
      publisherId = publisher._id;

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "_id",
        "title",
        "author",
        "price",
        "publisher",
        "itemStock",
        "genre",
        "isbn",
        "available",
        "bookCover"
      );
    });

    it("should return 400 is invalid book is passed", async () => {
      const res = await request(app)
        .post("/api/books")
        .set("x-auth-token", token)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 if not author is found", async () => {
      authorId = mongoose.Types.ObjectId();

      genre = new Genre({ name: "genre1" });
      await genre.save();
      genreId = genre._id;

      publisher = new Publisher({ name: "publisher1" });
      await publisher.save();
      publisherId = publisher._id;

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 not genre was found", async () => {
      author = new Author({
        name: "author1",
        bio: "bio1",
        authorPhoto: "authorPhoto1",
        born: "0001-01-01",
        death: "0001-01-01",
      });
      await author.save();
      authorId = author._id;

      genreId = mongoose.Types.ObjectId();

      publisher = new Publisher({ name: "publisher1" });
      await publisher.save();
      publisherId = publisher._id;

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 if not publisher is found", async () => {
      author = new Author({
        name: "author1",
        bio: "bio1",
        authorPhoto: "authorPhoto1",
        born: "0001-01-01",
        death: "0001-01-01",
      });
      await author.save();
      authorId = author._id;

      genre = new Genre({ name: "genre1" });
      await genre.save();
      genreId = genre._id;

      publisherId = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("PUT /:id", () => {
    let genre1;
    let genre2;
    let publisher1;
    let publisher2;
    let author1;
    let author2;

    let bookId;

    const token = jwt.sign(
      { _id: mongoose.Types.ObjectId(), isAdmin: true },
      config.get("jwtPrivateKey")
    );

    const exec = async () => {
      return request(app)
        .put(`/api/books/${bookId}`)
        .set("x-auth-token", token)
        .send({
          title: "name2",
          authorId: author2._id,
          price: 2,
          publisherId: publisher2._id,
          itemStock: 2,
          genreId: genre2._id,
          isbn: 2222222222222,
          available: false,
          bookCover: "bookCover2",
        });
    };

    it("should update book", async () => {
      [genre1, genre2] = await Genre.insertMany([
        { name: "genre1" },
        { name: "gener2" },
      ]);

      [publisher1, publisher2] = await Publisher.insertMany([
        { name: "publisher1" },
        { name: "publisher2" },
      ]);

      [author1, author2] = await Author.insertMany([
        {
          name: "author1",
          bio: "bio1",
          authorPhoto: "authorPhoto1",
          born: "0001-01-01",
          death: "0001-01-01",
        },
        {
          name: "author2",
          bio: "bio2",
          authorPhoto: "authorPhoto2",
          born: "2000-01-01",
          death: "2000-01-01",
        },
      ]);

      const book = new Book({
        title: "title1",
        author: {
          _id: author1._id,
          name: author1.name,
        },
        price: 1,
        publisher: {
          _id: publisher1._id,
          name: publisher1.name,
        },
        itemStock: 1,
        genre: {
          _id: genre1._id,
          name: genre1.name,
        },
        isbn: 1111111111111,
        available: true,
        bookCover: "bookCover1",
      });
      await book.save();

      bookId = book._id;
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty(
        "title",
        "name2",
        "author._id",
        author2._id,
        "price",
        2,
        "publisher._id",
        publisher2._id,
        "itemStock",
        2,
        "genre._id",
        genre2._id,
        "isbn",
        2222222222222,
        "available",
        false,
        "bookCover",
        "bookCover2"
      );
    });

    it("should return 400 if invalid book is passed", async () => {
      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .set("x-auth-token", token)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 if no genre is found", async () => {
      genre2._id = mongoose.Types.ObjectId()[
        (publisher1, publisher2)
      ] = await Publisher.insertMany([
        { name: "publisher1" },
        { name: "publisher2" },
      ]);

      [author1, author2] = await Author.insertMany([
        {
          name: "author1",
          bio: "bio1",
          authorPhoto: "authorPhoto1",
          born: "0001-01-01",
          death: "0001-01-01",
        },
        {
          name: "author2",
          bio: "bio2",
          authorPhoto: "authorPhoto2",
          born: "2000-01-01",
          death: "2000-01-01",
        },
      ]);

      const book = new Book({
        title: "title1",
        author: {
          _id: author1._id,
          name: author1.name,
        },
        price: 1,
        publisher: {
          _id: publisher1._id,
          name: publisher1.name,
        },
        itemStock: 1,
        genre: {
          _id: genre1._id,
          name: genre1.name,
        },
        isbn: 1111111111111,
        available: true,
        bookCover: "bookCover1",
      });
      await book.save();

      bookId = book._id;
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 if no author is found", async () => {
      [genre1, genre2] = await Genre.insertMany([
        { name: "genre1" },
        { name: "gener2" },
      ]);

      [publisher1, publisher2] = await Publisher.insertMany([
        { name: "publisher1" },
        { name: "publisher2" },
      ]);

      author2._id = mongoose.Types.ObjectId();

      const book = new Book({
        title: "title1",
        author: {
          _id: author1._id,
          name: author1.name,
        },
        price: 1,
        publisher: {
          _id: publisher1._id,
          name: publisher1.name,
        },
        itemStock: 1,
        genre: {
          _id: genre1._id,
          name: genre1.name,
        },
        isbn: 1111111111111,
        available: true,
        bookCover: "bookCover1",
      });
      await book.save();

      bookId = book._id;
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 400 if no publisher is found", async () => {
      [genre1, genre2] = await Genre.insertMany([
        { name: "genre1" },
        { name: "gener2" },
      ]);

      publisher2._id = mongoose.Types.ObjectId();

      [author1, author2] = await Author.insertMany([
        {
          name: "author1",
          bio: "bio1",
          authorPhoto: "authorPhoto1",
          born: "0001-01-01",
          death: "0001-01-01",
        },
        {
          name: "author2",
          bio: "bio2",
          authorPhoto: "authorPhoto2",
          born: "2000-01-01",
          death: "2000-01-01",
        },
      ]);

      const book = new Book({
        title: "title1",
        author: {
          _id: author1._id,
          name: author1.name,
        },
        price: 1,
        publisher: {
          _id: publisher1._id,
          name: publisher1.name,
        },
        itemStock: 1,
        genre: {
          _id: genre1._id,
          name: genre1.name,
        },
        isbn: 1111111111111,
        available: true,
        bookCover: "bookCover1",
      });
      await book.save();

      bookId = book._id;
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("should return 404 if no book is found", async () => {
      [genre1, genre2] = await Genre.insertMany([
        { name: "genre1" },
        { name: "gener2" },
      ]);

      [publisher1, publisher2] = await Publisher.insertMany([
        { name: "publisher1" },
        { name: "publisher2" },
      ]);

      [author1, author2] = await Author.insertMany([
        {
          name: "author1",
          bio: "bio1",
          authorPhoto: "authorPhoto1",
          born: "0001-01-01",
          death: "0001-01-01",
        },
        {
          name: "author2",
          bio: "bio2",
          authorPhoto: "authorPhoto2",
          born: "2000-01-01",
          death: "2000-01-01",
        },
      ]);

      bookId = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("DELETE /:id", () => {
    const token = jwt.sign(
      { _id: mongoose.Types.ObjectId(), isAdmin: true },
      config.get("jwtPrivateKey")
    );

    it("should delete user", async () => {
      const book = new Book({
        title: "title1",
        author: {
          _id: mongoose.Types.ObjectId(),
          name: "author1",
        },
        price: 10,
        publisher: {
          _id: mongoose.Types.ObjectId(),
          name: "publisher1",
        },
        itemStock: 0,
        genre: {
          _id: mongoose.Types.ObjectId(),
          name: "genre1",
        },
        isbn: 1111111111111,
        available: true,
        bookCover: "bookcover1",
      });
      await book.save();

      const bookId = book._id;
      const res = await await request(app)
        .delete(`/api/books/${bookId}`)
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
    });

    it("should return 404 if no user is found", async () => {
      const bookId = mongoose.Types.ObjectId();
      const res = await await request(app)
        .delete(`/api/books/${bookId}`)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });

  describe("GET /:id", () => {
    it("should return requested book", async () => {
      const book = new Book({
        title: "title1",
        author: {
          _id: mongoose.Types.ObjectId(),
          name: "author1",
        },
        price: 10,
        publisher: {
          _id: mongoose.Types.ObjectId(),
          name: "publisher1",
        },
        itemStock: 0,
        genre: {
          _id: mongoose.Types.ObjectId(),
          name: "genre1",
        },
        isbn: 1111111111111,
        available: true,
        bookCover: "bookcover1",
      });
      await book.save();

      bookId = book._id;
      const res = await request(app).get(`/api/books/${bookId}`);

      expect(res.status).toBe(200);
    });

    it("should return 404 if no book is found", async () => {
      bookId = mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/books/${bookId}`);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("error");
    });
  });
});
