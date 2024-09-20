const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

describe("createToken", function () {
  test("works: creates token with user email", function () {
    const token = createToken({ email: "test@example.com" });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      email: "test@example.com",
    });
  });

  test("works: creates token with different user", function () {
    const token = createToken({ email: "user@example.com" });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      email: "user@example.com",
    });
  });
});
