const router = require("express").Router();
const client = require("../databases/databases").pgClient;

router.get("/", (req, res) => {
  const season = req.query.season;
  const supplier_id = req.query.supplier_id;
  var left = undefined;
  var right = undefined;
  var is_no_season = false;
  const radius = req.query.radius;

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
  } else {
    is_no_season = true;
  }

  var query = `SELECT
          co.rg_number,
          co.cancel_reason,
          o.product_id,
          o.product_name,
          co.address,
          co.latitude::float,
          co.longitude::float
  FROM cancel_orders co
  INNER JOIN orders o ON co.rg_number = o.rg_number
  JOIN suppliers s
  ON ST_DWithin(
      Geography(ST_MakePoint(o.longitude, o.latitude)),
      Geography(ST_MakePoint(s.longitude, s.latitude)),
      ${radius})
      AND o.supplier_id = s.supplier_id
  WHERE
    co.supplier_id = ${supplier_id} `;

  if (!is_no_season) {
    query += ` AND EXTRACT(MONTH FROM cancel_date::timestamp) BETWEEN ${left} AND ${right};`;
  }

  client.query(query, (err, result) => {
    if (err) throw err;
    console.log(result.rows);
    res.send(result.rows)
  });
});

module.exports = router;
