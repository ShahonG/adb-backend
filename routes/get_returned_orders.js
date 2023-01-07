const router = require('express').Router();
const client = require('../databases/databases').pgClient

router.get('/', (req, res) => {
    const season = req.query.season;
    const supplier_id = req.query.supplier_id;
    var left = undefined;
    var right = undefined;
    if(season == 'spring'){
        left = 1;
        right = 3
    }
    else if(season == 'summer'){
        left = 4;
        right = 6;
    }
    else if(season == 'autumn'){
        left = 7;
        right = 9;
    }
    else if(season == 'winter'){
        left = 10;
        right = 12;
    }
    client.query(`
    SELECT
        rg.rs_number,
        rg.return_reason,
        o.product_name,
        rg.address,
        rg.latitude,
        rg.longitude
    FROM
        return_goods rg
        INNER JOIN orders o ON rg.rg_number = o.rg_number
    WHERE
        rg.supplier_id = ${supplier_id} AND EXTRACT(MONTH FROM return_date::timestamp) BETWEEN ${left} AND ${right};`,
    (err, result) => {
        if (err) throw err;
        console.log(result.rows)
    })
})

module.exports = router;
/*
`
SELECT
    rg.rs_number,
    rg.return_reason,
    o.product_name,
    rg.address,
    rg.latitude,
    rg.longitude
FROM
    return_goods rg
    INNER JOIN orders o ON rg.rg_number = o.rg_number
WHERE
    rg.supplier_id = ${supplier_id} AND EXTRACT(MONTH FROM return_create_date::timestamp) BETWEEN 4 AND 7;`
*/