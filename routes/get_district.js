const router = require('express').Router();
const client = require('../databases/databases').pgClient

router.get('/', (req, res) => {
    const city = req.query.city;
    client.query(`
    SELECT
        sp.district, COUNT(*)
    FROM 
        suppliers sp
    WHERE
        sp.city = '${city}'
    GROUP BY
        sp.district`,
    (err, result) => {
        if (err) throw err;
        res.send(result.rows);
    })
})

module.exports = router;