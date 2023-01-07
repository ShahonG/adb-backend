const express = require('express');
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended:true }))

// ALL
app.use('/get_suppliers', require('./routes/get_suppliers.js'))
app.use('/get_orders', require('./routes/get_orders.js'))
app.use('/get_products', require('./routes/get_products.js'))

// Return
app.use('/get_return_suppliers', require('./routes/get_return_suppliers.js'))
app.use('/get_return_orders', require('./routes/get_return_orders.js'))
app.use('/get_return_products', require('./routes/get_return_products.js'))

// Cancel
app.use('/get_cancel_suppliers', require('./routes/get_cancel_suppliers.js'))
app.use('/get_cancel_orders', require('./routes/get_cancel_orders.js'))
app.use('/get_cancel_products', require('./routes/get_cancel_products.js'))

// Other
app.use('/get_cities', require('./routes/get_cities.js'))
app.use('/get_district', require('./routes/get_district.js'))
app.use('/get_orders_by_suppliers', require('./routes/get_orders_by_supplier.js'))
app.use('/get_suppliers_list', require('./routes/get_suppliers_list.js'))


app.listen(port, () => {
    console.log(`Success, view the app at http://localhost:${port}`)
})