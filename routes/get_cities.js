const router = require("express").Router();
const client = require("../databases/databases").pgClient;

router.get("/", (req, res) => {
  client.query(
    `
    SELECT
        city, COUNT(*)
    FROM 
        suppliers
    GROUP BY
        city`,
    (err, result) => {
      if (err) throw err;
      res.send(result.rows);
    }
  );
});

module.exports = router;
