const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { json } = require('express/lib/response');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const database = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "etterem"
});



app.get('/', (req,res)=>{
    res.send(JSON.stringify(availableEndpoints))
})


// ETLAP RELATED

app.get('/food/list', (req, res)=>{
    database.query("SELECT * FROM etlap", function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result))
    });
})



app.post('/food/create', (req, res)=>{
    const food = req.body;
    const sql = `INSERT INTO etlap (nev, kategoria, allergenek, ar) VALUES ('${food.name}', '${food.category}', '${food.allergens}', '${food.price}')`;
    
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result))
    });
})

app.put('/food/edit/:id', (req, res)=>{
    const food = req.body;
    const sql = `UPDATE etlap SET nev="${food.name}", allergenek="${food.allergens}", kategoria="${food.category}", ar="${food.price}" WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
    
})

app.delete('/food/remove/:id', (req, res)=>{
    const sql = `DELETE FROM etlap WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send({success: "true"});
    });
})

// ITALLAP RELATED

app.get('/drink/list', async (req, res)=>{
    
    database.query("SELECT * FROM itallap", function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result))
    })
})



app.post('/drink/create', (req, res)=>{
    const drink = req.body;
    const sql = `INSERT INTO itallap (nev, kategoria, allergenek, ar) VALUES ('${drink.name}', '${drink.category}', '${drink.allergens}', '${drink.price}')`;
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
})

app.put('/drink/edit/:id', (req, res)=>{
    const drink = req.body;
    const sql = `UPDATE itallap SET nev="${drink.name}", allergenek="${drink.allergens}", kategoria="${drink.category}", ar="${drink.price}" WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
    
})

app.delete('/drink/remove/:id', (req, res)=>{
    const sql = `DELETE FROM itallap WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send({success: "true"});
    });
})

// FELHASZNALO RELATED

app.get('/users/list', (req, res)=>{
    database.query("SELECT * FROM felhasznalok", function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result))
    });
})


app.post('/users/create', (req, res)=>{
    const user = req.body;
    const sql = `INSERT INTO felhasznalok (felhasznalonev, jelszo, admin, vezeteknev, keresztnev) VALUES ('${user.felhasznalonev}', '${user.jelszo}', '${user.admin}', '${user.vezeteknev}', '${user.keresztnev}')`;
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
})

app.put('/users/edit/:id', (req, res)=>{
    const user = req.body;
    const sql = `UPDATE felhasznalok SET felhasznalonev="${user.felhasznalonev}", vezeteknev="${user.vezeteknev}", keresztnev="${user.keresztnev}", admin="${user.admin}", jelszo="${user.jelszo}" WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
})

app.delete('/users/remove/:id', (req, res)=>{
    const sql = `DELETE FROM felhasznalok WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send({success: "true"})
    });
})

// LOGIN & LOGOUT
app.post('/login', (req, res)=>{
    const session = req.body;
    const sql = `SELECT * FROM felhasznalok WHERE felhasznalonev='${session.felhasznalonev}' AND jelszo='${session.jelszo}' AND admin=${session.jogosultsag};`;
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        if (result.length == 1){
            res.send(JSON.stringify({success: true}))
        } else {
            res.send(JSON.stringify({success: false}))
        }
    });
})




// ASZTAL RELATED

app.get('/tables/list', (req, res)=>{
    database.query("SELECT * FROM asztalok", function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result))
    });
})

app.put('/tables/edit/:id', (req, res)=>{
    const table = req.body;
    const sql = `UPDATE asztalok SET alsoSzekFoglalt="${table.alsoSzekFoglalt}", alsoSzekZarolva="${table.alsoSzekZarolva}", felsoSzekFoglalt="${table.felsoSzekFoglalt}", felsoSzekZarolva="${table.felsoSzekZarolva}", rendelesAllapot="${table.rendelesAllapot}" WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
})

app.put('/tables/:id/:state', (req, res)=>{
    const table = req.body;
    let sql = `UPDATE asztalok SET rendelesAllapot="${req.params.state}" WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
    });

    if(req.params.state == 'paid'){
        sql = `SELECT aktivRendeles FROM asztalok WHERE id=${req.params.id}`
        database.query(sql, function (err, result, fields) {
            if (err) throw err;
            let activeOrder = JSON.parse(JSON.stringify(result))[0]

            sql = `UPDATE rendeles SET fizetve=1 WHERE id=${activeOrder.aktivRendeles};`
            database.query(sql, function (err, result, fields) {
                if (err) throw err;
                sql = `UPDATE asztalok SET aktivRendeles=0 WHERE id=${req.params.id};`
                database.query(sql, function (err, result, fields) {
                    if (err) throw err;
                });
            });
        });
    }
    res.send(JSON.stringify({success: true}));
})

app.put('/tables/:id/chair/:pos/:state/:lock', (req, res)=>{
    const table = req.body;
    let whichOneState = req.params.pos == 0 ? 'felsoSzekFoglalt' : 'alsoSzekFoglalt';
    let whichOneLock = req.params.pos == 0 ? 'felsoSzekZarolva' : 'alsoSzekZarolva';

    const sql = `UPDATE asztalok SET  ${whichOneState} ="${req.params.state}", ${whichOneLock} ="${req.params.lock}"  WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
})

app.post('/tables/:id/chair/:pos/state/:state/', (req, res)=>{
    let whichOneState = req.params.pos == 0 ? 'felsoSzekFoglalt' : 'alsoSzekFoglalt';
    const sql = `UPDATE asztalok SET  ${whichOneState} ="${req.params.state}" WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
})
app.post('/tables/:id/chair/:pos/lock/:state/', (req, res)=>{
    let whichOneState = req.params.pos == 0 ? 'felsoSzekZarolva' : 'alsoSzekZarolva';
    const sql = `UPDATE asztalok SET  ${whichOneState} ="${req.params.state}" WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
})

// RENDELES RELATED
app.get('/tables/:id/orders', (req, res)=>{
    let allOrders = []
    sql = `SELECT id FROM rendeles WHERE asztalAzonosito=${req.params.id} AND fizetve=0 AND visszavonva=0`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        let activeOrder = JSON.parse(JSON.stringify(result))[0]

        if (activeOrder.id >= 1){
            orderId = activeOrder.id
            sql = `SELECT etelDarabszam, etelAzonosito FROM rendelesreszlet WHERE rendelesAzonosito=${orderId}`
            database.query(sql, function (err, result, fields) {
                if (err) throw err;
                res.send(JSON.stringify(result))
            });
        }
    })
})

app.post('/orders/create/:tableId', (req, res)=>{
    const orders = req.body;
    let sql = `SELECT COUNT(*) AS total FROM rendeles WHERE asztalAzonosito=${req.params.tableId} AND fizetve=0 AND visszavonva=0`;
    let orderId
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        if(JSON.parse(JSON.stringify(result))[0].total == 0){
            sql = `INSERT INTO rendeles (asztalAzonosito) VALUES ('${req.params.tableId}')`;
            database.query(sql, function (err, result, fields) {
                if (err) throw err;
                if(result){
                    sql = `SELECT id FROM rendeles WHERE asztalAzonosito=${req.params.tableId} AND fizetve=0 AND visszavonva=0`
                    database.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        let activeOrder = JSON.parse(JSON.stringify(result))[0]

                        if (activeOrder.id >= 1){
                            orderId = activeOrder.id
                            orders.forEach(order => {
                                sql = `INSERT INTO rendelesreszlet (rendelesAzonosito, asztalAzonosito, etelDarabszam, etelAzonosito) VALUES ('${orderId}', '${req.params.tableId}', '${order.orderCount}', '${order.orderId}')`
                                database.query(sql, function (err, result, fields) {
                                    if (err) throw err;
                                });
                            })
                            sql = `UPDATE asztalok SET rendelesAllapot='ordered', aktivRendeles=${orderId} WHERE id=${req.params.tableId}`
                            database.query(sql, function (err, result, fields) {
                                if (err) throw err;
                            });
                            res.send(JSON.stringify(result))
                        }
                    })
                };
            });
        } else {
            sql = `SELECT id FROM rendeles WHERE asztalAzonosito=${req.params.tableId} AND fizetve=0 AND visszavonva=0`
            database.query(sql, function (err, result, fields) {
                if (err) throw err;
                let activeOrder = JSON.parse(JSON.stringify(result))[0]

                console.log(activeOrder)
                console.log(activeOrder.id)
                if (activeOrder.id >= 1){
                    orderId = activeOrder.id
                    console.log("Az orderId most: ", orderId)
                    orders.forEach(order => {
                        sql = `INSERT INTO rendelesreszlet (rendelesAzonosito, asztalAzonosito, etelDarabszam, etelAzonosito) VALUES ('${orderId}', '${req.params.tableId}', '${order.orderCount}', '${order.orderId}')`
                        database.query(sql, function (err, result, fields) {
                            if (err) throw err;
                            console.log('Inserted.')
                        });
                    })
                    sql = `UPDATE asztalok SET rendelesAllapot='ordered', aktivRendeles=${orderId} WHERE id=${req.params.tableId}`
                    database.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        console.log('Table state updated.')
                    });
                    res.send(JSON.stringify(result))
                }
            })
        }
    });
});

app.listen(port, () => console.log(`Listenning on port ${port}`))