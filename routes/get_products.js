const router = require("express").Router();
const client = require("../databases/databases").pgClient;

function build_condition(city, district) {
  console.log("city", city, "district", district);
  if (district) {
    return `district = '${district}'`;
  } else if (city) {
    return `city = '${city}'`;
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
      supplier_id,
      supplier_name,
      product_id,
      product_name,
      count(*)::float total
  FROM
      orders
  WHERE 1=1  `;

  if (condition) {
    query+= ` AND ${condition}`
  }

  if (!is_no_season) {
    query+=  ` AND EXTRACT(MONTH FROM order_create_date::timestamp) BETWEEN ${left} AND ${right}`;
  }

  query += ` GROUP BY supplier_id, supplier_name, product_id, product_name
            ORDER BY total DESC;`;

  console.log(query);
  client.query(query, (err, result) => {
    if (err) throw err;
    console.log(result.rows);
    res.send(result.rows);
  });
});

module.exports = router;

/*
SELECT 
    upplier_id,
    supplier_name,
    product_id,
    product_name,
    count(*) frequency
FROM
    orders
WHERE
    ${condition}
    AND EXTRACT(MONTH FROM order_date::timestamp) BETWEEN ${left} AND ${right]
GROUP BY supplier_id, supplier_name, product_id, product_name
ORDER BY frequency DESC;
*/
