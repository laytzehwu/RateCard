'use strict';

let express = require('express');
let app = express();
let path = require('path');
//node sets ---------------------------------------------------------------
app.set('port', (process.env.PORT || 5000));

//node use ---------------------------------------------------------------
// Static folder
let __parentDir = path.join(__dirname, '..');
app.use(express.static(__parentDir + '/app'));

// APIS --------------------------------------------------------------------
app.get('/api/customers', (req,res) => {
    let customers = require(__dirname + '/jsons/customers.json');
    res.setHeader('Content-Type', 'application/json');
    res.json(customers);
});

app.get('/api/products', (req, res) => {
    let products = require(__dirname + '/jsons/products.json');
    res.setHeader('Content-Type', 'application/json');
    res.json(products);
});

//node listen ---------------------------------------------------------------
app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});