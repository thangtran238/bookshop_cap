const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.ID,
      role: user.role,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "1h" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.ID,
      role: user.role,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "1h" }
  );
};

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    return decoded;
  } catch (err) {
    const decoded = jwt.decode(token);
    return {
      id: decoded.id,
      exp: decoded.exp,
    };
  }
};

const verifyRefreshToken = (refresh_token) => {
  try {
    const secret = process.env.JWT_REFRESH_KEY;
    const decoded = jwt.verify(refresh_token, secret);
    return decoded;
  } catch (err) {
    console.log(err);

    return {
      expired: true,
    };
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
