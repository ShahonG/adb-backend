const router = require('express').Router();
const client = require('../databases/databases').pgClient

router.get('/', (req, res) => {
    const supplier_id = req.query.supplier_id
    client.query(`
    SELECT *
    FROM 
    (
        SELECT
            st_union(order_sup.geom) order_geom
        FROM 
            (
                (
                SELECT *
                FROM
                    products
                WHERE
                    supplier_id = ${supplier_id}
                ) pl
                LEFT JOIN orders od ON pl.product_id = od.product_id
            ) order_sup
            INNER JOIN taiwan_city tc ON st_within(order_sup.geom, tc.geom)
      GROUP BY order_sup.geom
    ) dis`
    ,
    (err, result) => {
        if (err) throw err;
        res.send(result.rows);
    })
})

module.exports = router;