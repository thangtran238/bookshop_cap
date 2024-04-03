const cds = require("@sap/cds");

const connection = async () => {
  const db = await cds.connect();
  return db;
};

module.exports = connection;
