const cds = require("@sap/cds");
const bcrypt = require("bcryptjs");

const connection = async () => {
  const db = await cds.connect();
  return db;
};

module.exports = async (srv) => {
  const db = await connection();

  srv.before("CREATE", "Users", async (req) => {
    const { password } = req.data;
    const salt = await bcrypt.genSalt(10);
    req.data.password = await bcrypt.hash(password, salt);
    console.log("Encrypted password...");
    console.log(req.data.password);
  });

  srv.on("READ", "Users", async (req, next) => {
    const users = await next();
    console.log(users);
    if (users) {
      const customheader = req._.req.headers["customheader"];
      if (!customheader) {
        return req.reject(403, "No custom header present...");
      }

      if (!users) {
        return req.reject(401, "No users with the given id...");
      }

      if (users[0].password) {
        const match = await bcrypt.compare(customheader, users[0].password);

        if (!match) {
          return req.reject(403, "Passwords do not match...");
        }
      }

      return { ...users[0], password: undefined };
    }
  });
};
