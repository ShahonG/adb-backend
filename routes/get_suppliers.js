const router = require('express').Router();
const client = require('../databases/databases').pgClient

async function merge_delay_info(data, supplier_id) {
    try {
        const delay_infos = await client.query(`
        SELECT
            DISTINCT o.rg_number,
            o.product_id,
            o.product_name,
            EXTRACT(DAYS FROM o.shipment_date::TIMESTAMP - o.latest_shipment_date::TIMESTAMP)::NUMERIC(9, 2) AS delay
        FROM
            orders o
        WHERE
            o.shipment_date IS NOT NULL
            AND o.supplier_id = ${supplier_id}`);
        var delay = 0;
        const len = delay_infos.rows.length
        for(var i = 0 ; i < len ; i++){
            if (delay_infos.rows[i].delay == '-1.00'){
                delay++;
            }
        }
        data.delay_ratio = (delay / len) * 100.0;
        data.transaction_info = delay_infos.rows;
        return data;
    } catch (e) {
        console.log(e);
    }
}

async function merge_top_product(data, supplier_id) {
    try {
        const top3_product = await client.query(`
        SELECT 
            count(*) frequency,
            product_id,
            product_name
        FROM (
            SELECT
                DISTINCT customer_id, product_id, product_name, address, longitude, latitude
            FROM
                orders
            WHERE
                supplier_id = ${supplier_id}
            ) pd
        GROUP BY product_id, product_name
        ORDER BY frequency DESC LIMIT 3;`);
        data.top_product = top3_product.rows;
        return data;
    } catch (e) {
        console.log(e);
    }
}

router.get('/', (req, res) => {
    var response_data = undefined;
    var condition = undefined;
    if (req.query.city) {
        condition = `city = '${req.query.city}'`;
    }
    else if (req.query.district) {
        condition = `district = ${req.query.district}`;
    }

    client.query(`
    SELECT
        supplier_id, supplier_name, address, longitude, latitude
    FROM
        suppliers 
    WHERE
        ${condition} LIMIT 1;`,
    async (err, result) => {
        if (err) throw err;
        response_data = result.rows;
        for(var i = 0 ; i < response_data.length ; i++){
            try {
                response_data[i] = await merge_delay_info(response_data[i], response_data[i].supplier_id);
                response_data[i] = await merge_top_product(response_data[i], response_data[i].supplier_id);
                console.log(response_data[i]);
            } catch (e) {
                console.log(e);
            }
        }
    })
})

module.exports = router;