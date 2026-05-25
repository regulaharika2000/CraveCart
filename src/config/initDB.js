const fs = require("fs");
const path = require("path");
const db = require("./db");

//const schemaPath = path.join(__dirname, "../../../database/schema.sql");
const schemaPath = path.resolve(process.cwd(), "database", "schema.sql")
const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema, (err) => {
  if (err) {
    console.log("Table creation error", err);
  } else {
    console.log("Tables Created Successfully");
  }
});
