const router = require("express").Router();
const client = require("../databases/databases").pgClient;

router.get("/", (req, res) => {
  const region = req.query.city;
  client.query(
    `
    SELECT 
        sp.supplier_id, sp.supplier_name, sp.latitude, sp.longitude
    FROM
        public.suppliers as sp
    INNER JOIN
        taiwan_city tc ON ST_Within(sp.geom, tc.geom)
    WHERE
        sp.city = '${region}'
    GROUP BY
        tc.geom, tc.countyname,
        sp.geom, sp.supplier_id, sp.supplier_name, sp.latitude, sp.longitude;`,
    (err, result) => {
      if (err) throw err;
      res.send(result.rows);
    }
  );
});

module.exports = router;
