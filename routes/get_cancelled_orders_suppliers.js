const router = require('express').Router();
const client = require('../databases/databases').pgClient

function build_query(option, type) {
    var condition = undefined;
    if (type == 'city'){
        condition = `city = '${option}'`;
    }
    if (type == 'district'){
        condition = `district = '${option}'`;
    }

    return `
    SELECT
        co.supplier_id,
        supplier_name,
        s.address,
        s.longitude,
        s.latitude
    FROM
        cancel_orders co
        INNER JOIN suppliers s ON co.supplier_id = s.supplier_id
    WHERE
        ${condition};`
}

async function merge_top_product(data, supplier_id){
    try {
        const top3_product = await client.query(`
        SELECT
            count(*) frequency,
            product_id,
            product_name,
            cancel_reason
        FROM
            cancel_orders
            INNER JOIN orders o ON cancel_orders.rg_number = o.rg_number
        WHERE
            o.supplier_id = ${supplier_id}
        GROUP BY product_id, product_name, cancel_reason
        ORDER BY frequency DESC LIMIT 3;`);
        data.top_product = top3_product.rows;
        return data;
    } catch (e) {
        console.log(e);
    }
}

async function merge_top_reason(data, supplier_id){
    try {
        const top3_reason = await client.query(`
        SELECT
            count(*) frequency,
            cancel_reason
        FROM
            cancel_orders
        WHERE
            supplier_id = ${supplier_id}
        GROUP BY cancel_reason
        ORDER BY frequency DESC LIMIT 3`);
        data.top_reason = top3_reason.rows;
        return data; 
    } catch (e) {
        console.log(e);
    }
}

router.get('/', (req, res) => {
    var option = undefined;
    var query_sentence = undefined;
    var response_data = undefined;
    if ( req.query.city ){
        option = req.query.city
        query_sentence = build_query(option, 'city');
    }
    else if ( req.query.district ){
        option = req.query.district;
        query_sentence = build_query(option, 'district');
    }
    client.query(query_sentence, async (err, result) => {
        if (err) throw err;
        response_data = result.rows;
        const len = response_data.length
        for(var i = 0 ; i < len ; i++){
            try {
                response_data[i] = await merge_top_product(response_data[i], response_data[i].supplier_id);
                response_data[i] = await merge_top_reason(response_data[i], response_data[i].supplier_id);
                // console.log(response_data[i]);
            } catch (e) {
                console.log(e);
            }
        }
    })
})

module.exports = router;