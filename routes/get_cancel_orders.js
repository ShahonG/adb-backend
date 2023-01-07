const router = require("express").Router();
const client = require("../databases/databases").pgClient;

router.get("/", (req, res) => {
  const season = req.query.season;
  const supplier_id = req.query.supplier_id;
  var left = undefined;
  var right = undefined;
  if (season == "spring") {
    left = 1;
    right = 3;
  } else if (season == "summer") {
    left = 4;
    right = 6;
  } else if (season == "autumn") {
    left = 7;
    right = 9;
  } else if (season == "winter") {
    left = 10;
    right = 12;
  }
  client.query(
    `
    SELECT
        co.rg_number,
        co.cancel_reason,
        o.product_name,
        co.address,
        co.latitude,
        co.longitude
    FROM
        cancel_orders co
        INNER JOIN orders o ON co.rg_number = o.rg_number
    WHERE
        co.supplier_id = ${supplier_id} AND EXTRACT(MONTH FROM cancel_date::timestamp) BETWEEN ${left} AND ${right};`,
    (err, result) => {
      if (err) throw err;
      console.log(result.rows);
      res.send(response_data);
    }
  );
});

module.exports = router;
