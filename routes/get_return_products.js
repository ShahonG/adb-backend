const router = require("express").Router();
const client = require("../databases/databases").pgClient;

function build_condition(city, district) {
  if (district) {
    return `o.district = '${district}'`;
  } else if (city) {
    return `o.city = '${city}'`;
  }
}

router.get("/", (req, res) => {
  const season = req.query.season;
  var left = undefined;
  var right = undefined;
  const condition = build_condition(
    req.query.city.trim(),
    req.query.district.trim()
  );
  var is_no_season = false;
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

  var query = `
  SELECT 
      o.supplier_id,
      o.supplier_name,
      o.product_id,
      o.product_name,
      rg.return_reason,
      count(*) frequency
  FROM
      return_goods rg
      INNER JOIN orders o ON rg.rg_number = o.rg_number
      WHERE 1=1  `;

  if (condition) {
    query += ` AND ${condition}`;
  }

  if (!is_no_season) {
    query += ` AND EXTRACT(MONTH FROM order_create_date::timestamp) BETWEEN ${left} AND ${right}`;
  }

  query += `GROUP BY o.supplier_id, o.supplier_name, o.product_id, o.product_name, rg.return_reason
  ORDER BY frequency DESC;`;

  client.query(query, (err, result) => {
    if (err) throw err;
    console.log(result.rows);
    res.send(result.rows);
  });
});

module.exports = router;
