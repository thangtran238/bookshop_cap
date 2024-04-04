const cds = require("@sap/cds");

const connection = async () => {
  const db = await cds.connect();
  return db;
};

module.exports = async (srv) => {
  const db = await connection();

  srv.before("CREATE", "Orders", async (req) => {
    if (!req.data || req.data.quantity == 0) {
      req.reject(
        400,
        "Invalid request data: quantity must be greater than zero"
      );
      return;
    }
    const inStock = await db
      .read("my.bookshop.Books")
      .where("ID ==", req.data.books_ID);
    console.log(inStock);
    if (inStock.length == 0 || inStock[0].stock <= 0)
      req.reject(404, "This book is out of stock, sorry about that");
  });

  srv.after("CREATE", "Orders", async (req) => {
    console.log(req);
    const updatedBook = await db
      .update("my.bookshop.Books")
      .where("ID ==", req.books_ID)
      .set("stock -=", req.quantity);
  });

  srv.after("READ", "Books", (items) => {
    items.forEach((item) => {
      if (item.stock > 200) {
        item.title = `(10% discount) ${item.title}`;
      }
    });
  });
};
