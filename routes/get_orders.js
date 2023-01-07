const router = require("express").Router();
const client = require("../databases/databases").pgClient;

router.get("/", (req, res) => {
  const season = req.query.season;
  const supplier_id = req.query.supplier_id;
  const radius = req.query.radius;
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
        DISTINCT 
        o.rs_number,
        o.product_id,
        o.product_name,
        o.longitude,
        o.latitude,
        o.address,
        EXTRACT(DAYS FROM o.shipment_date::TIMESTAMP - o.latest_shipment_date::TIMESTAMP)::NUMERIC(9, 2) AS delay
    FROM 
        orders o
        JOIN suppliers s
        ON ST_DWithin(
            Geography(ST_MakePoint(o.longitude, o.latitude)),
            Geography(ST_MakePoint(s.longitude, s.latitude)),
            ${radius}
            )
        AND o.supplier_id = s.supplier_id
    WHERE 
        o.shipment_date IS NOT NULL
        AND o.supplier_id = ${supplier_id}
        AND EXTRACT(MONTH FROM order_create_date::timestamp) BETWEEN ${left} AND ${right}`,
    (err, result) => {
      if (err) throw err;
      console.log(result.rows);
      res.send(result.rows);
    }
  );
});

module.exports = router;
