const express = require('express');
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended:true }))

app.use('/get_cancelled_orders_suppliers', require('./routes/get_cancelled_orders_suppliers.js'))
app.use('/get_cancelled_orders', require('./routes/get_cancelled_orders.js'))
app.use('/get_cities', require('./routes/get_cities.js'))
app.use('/get_district', require('./routes/get_district.js'))
app.use('/get_orders', require('./routes/get_orders.js'))
app.use('/get_orders_by_suppliers', require('./routes/get_orders_by_supplier.js'))
app.use('/get_returned_orders_suppliers', require('./routes/get_returned_orders_suppliers.js'))
app.use('/get_returned_orders', require('./routes/get_returned_orders.js'))
app.use('/get_suppliers_list', require('./routes/get_suppliers_list.js'))
app.use('/get_suppliers', require('./routes/get_suppliers.js'))


app.listen(port, () => {
    console.log(`Success, view the app at http://localhost:${port}`)
})