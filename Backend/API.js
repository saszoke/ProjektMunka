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
    let sql = `INSERT INTO etlap (nev, kategoria, allergenek, ar) VALUES ('${food.name}', '${food.category}', '${food.allergens}', '${food.price}')`;
    
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        if (result){
            sql = `SELECT * FROM etlap ORDER BY id DESC LIMIT 1;`
            database.query(sql,function (err,result,fields){
                if (err) throw err;
                res.send(JSON.stringify(result));
            })
        }
    });
})

app.put('/food/edit/:id', (req, res)=>{
    const food = req.body;
    let sql = `UPDATE etlap SET nev="${food.name}", allergenek="${food.allergens}", kategoria="${food.category}", ar="${food.price}" WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        if (result){
            sql = `SELECT * FROM etlap WHERE id=${req.params.id};;`
            database.query(sql,function (err,result,fields){
                if (err) throw err;
                res.send(JSON.stringify(result));
            })
        }

    });
    
})

app.delete('/food/remove/:id', (req, res)=>{
    const sql = `DELETE FROM etlap WHERE id=${req.params.id};`
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
    let sql = `INSERT INTO felhasznalok (felhasznalonev, jelszo, admin, vezeteknev, keresztnev) VALUES ('${user.felhasznalonev}', '${user.jelszo}', '${user.admin}', '${user.vezeteknev}', '${user.keresztnev}')`;
    database.query(sql, function (err, result, fields) {
        if (err) res.send(JSON.stringify({response: 'Failed to create user'}));
        if (result){
            sql = `SELECT * FROM felhasznalok ORDER BY id DESC LIMIT 1;`
            database.query(sql,function (err,result,fields){
                if (err) throw err;
                res.send(JSON.stringify(result));
            })
        }
    });
})

app.put('/users/edit/:id', (req, res)=>{
    const user = req.body;
    let sql = `UPDATE felhasznalok SET felhasznalonev="${user.felhasznalonev}", vezeteknev="${user.vezeteknev}", keresztnev="${user.keresztnev}", admin="${user.admin}", jelszo="${user.jelszo}" WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) res.send(JSON.stringify({response: 'Failed to create user'}));;
        if (result){
            sql = `SELECT * FROM felhasznalok WHERE id=${req.params.id};;`
            database.query(sql,function (err,result,fields){
                if (err) throw err;
                res.send(JSON.stringify(result));
            })
        }
    });
})

app.delete('/users/remove/:id', (req, res)=>{
    const sql = `DELETE FROM felhasznalok WHERE id=${req.params.id};`
    database.query(sql, function (err, result, fields) {
        if (err) throw err;
        
        res.send({success: "true"})
    });
})

// LOGIN
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
        }
    });
});

// RENDELES RELATED

app.get('/stat/day', async (req, res)=>{
    let current = new Date()
    let formatted = current.toISOString().split('T')[0]
    let sql = `SELECT etelDarabszam,etelAzonosito FROM rendelesreszlet LEFT JOIN rendeles ON rendelesreszlet.rendelesAzonosito = rendeles.id WHERE rendeles.letrehozva='${formatted}';`
    let sum = 0
    let foodBase = []
    let foodIndexes = []
    let highest = []
    


    sqlFood = `SELECT id,ar,nev, kategoria FROM etlap;`
    database.query(sqlFood, (err,rows) => {
        rows.forEach(food => {
            foodBase.push({id: food.id, price: food.ar, name: food.nev, category: food.kategoria})
            foodIndexes.push(food.id)
        })
    })
    
    database.query(sql, (err,rows) => {
        let max = 0
        rows.forEach(rendeles => {
            sum += foodBase[foodIndexes.indexOf(rendeles.etelAzonosito)].price * rendeles.etelDarabszam
            if (rendeles.etelDarabszam >= max && foodBase[foodIndexes.indexOf(rendeles.etelAzonosito)].category != 'Ital'){
                max = rendeles.etelDarabszam
            } 

        })
        rows.forEach(rendeles => {
            if(rendeles.etelDarabszam == max && foodBase[foodIndexes.indexOf(rendeles.etelAzonosito)].category != 'Ital'){
                highest.push(rendeles.etelAzonosito)
            }
        })
        if(highest.length == 1){

            res.send(JSON.stringify({sum:sum, star: foodBase[foodIndexes.indexOf(highest[0])]}))
        } else {
            let random = Math.floor(Math.random() * highest.length);

            res.send(JSON.stringify({sum:sum, star: foodBase[foodIndexes.indexOf(highest[random])]}))
        }
    })

    
})


app.get('/stat/month', async (req, res)=>{
    const d = new Date();
    let month = d.getMonth()+1;
    let sql = `SELECT rendeles.letrehozva,etelDarabszam,etelAzonosito FROM rendelesreszlet LEFT JOIN rendeles ON rendelesreszlet.rendelesAzonosito = rendeles.id WHERE MONTH(rendeles.letrehozva) = ${month};`
    let sumTotal = 0
    let sumPerDay = []
    let foodBase = []
    let foodIndexes = []
    let highest = []
    let highestDrink = []
    let highestFood = []


    sqlFood = `SELECT id,ar,nev, kategoria FROM etlap;`
    database.query(sqlFood, (err,rows) => {
        rows.forEach(food => {
            foodBase.push({id: food.id, price: food.ar, name: food.nev, category: food.kategoria})
            foodIndexes.push(food.id)
        })
    })
    
    database.query(sql, (err,rows) => {
        let max = 0
        let maxFood = 0
        let maxDrink = 0
        let helperCounter = 0
        rows.forEach(rendeles => {
            var originalDate  = new Date(rendeles.letrehozva) 
            var correctedDate = originalDate.setDate(originalDate.getDate() + 1);

            var javaDate = new Date(correctedDate).toISOString().split('T')[0];

            sumTotal += foodBase[foodIndexes.indexOf(rendeles.etelAzonosito)].price * rendeles.etelDarabszam




            // length ? akkor tuti nincs benne 
            if (sumPerDay.length == 0){
                let dayObject = {}
                dayObject.letrehozva =javaDate
                dayObject.sum = foodBase[foodIndexes.indexOf(rendeles.etelAzonosito)].price * rendeles.etelDarabszam
                sumPerDay.push(dayObject)
            } else {
                // benne van? --> növelni meglévőt
                sumPerDay.forEach(existingDayObject => {
                    if(existingDayObject.letrehozva == javaDate){
                        existingDayObject.sum += foodBase[foodIndexes.indexOf(rendeles.etelAzonosito)].price * rendeles.etelDarabszam
                    }
                })

            let existingDates = []
            sumPerDay.forEach(sumDay => existingDates.push(sumDay.letrehozva))

                if(!existingDates.includes(javaDate)) {
                    // nincs benne? --> létrehozni, hozzáadni
                    let dayObject = {}
                    dayObject.letrehozva =javaDate
                    dayObject.sum = foodBase[foodIndexes.indexOf(rendeles.etelAzonosito)].price * rendeles.etelDarabszam
                    sumPerDay.push(dayObject)
                }

            }

            if (rendeles.etelDarabszam >= max){
                max = rendeles.etelDarabszam
            } 
            if (rendeles.etelDarabszam >= maxFood && foodBase[foodIndexes.indexOf(rendeles.etelAzonosito)].category != 'Ital'){
                maxFood = rendeles.etelDarabszam
            } 
            if (rendeles.etelDarabszam >= maxDrink && foodBase[foodIndexes.indexOf(rendeles.etelAzonosito)].category == 'Ital'){
                maxDrink = rendeles.etelDarabszam
            } 

        })
        sumPerDay = complement(sumPerDay)
        sumPerDay = sumPerDay.sort(sortIt("letrehozva"))
        rows.forEach(rendeles => {
            if(rendeles.etelDarabszam == max) highest.push(rendeles.etelAzonosito)
            if(rendeles.etelDarabszam == maxFood && foodBase[foodIndexes.indexOf(rendeles.etelAzonosito)].category != 'Ital'){
                highestFood.push(rendeles.etelAzonosito)
            }
            if(rendeles.etelDarabszam == maxDrink && foodBase[foodIndexes.indexOf(rendeles.etelAzonosito)].category == 'Ital'){
                highestDrink.push(rendeles.etelAzonosito)
            }
        })
        let star
        if(highest.length == 1){
            star = foodBase[foodIndexes.indexOf(highest[0])]
        } else {
            let random = Math.floor(Math.random() * highest.length);
            star = foodBase[foodIndexes.indexOf(highest[random])]
        }
        let starDrink
        if(highestDrink.length == 1){
            starDrink = foodBase[foodIndexes.indexOf(highestDrink[0])]
        } else {
            let random = Math.floor(Math.random() * highestDrink.length);
            starDrink = foodBase[foodIndexes.indexOf(highestDrink[random])]
        }
        let starFood
        if(highestFood.length == 1){
            starFood = foodBase[foodIndexes.indexOf(highestFood[0])]
        } else {
            let random = Math.floor(Math.random() * highest.length);
            starFood = foodBase[foodIndexes.indexOf(highestFood[random])]
        }
        res.send(JSON.stringify({sumPerDay:sumPerDay, sum:sumTotal, star: star, starFood: starFood, starDrink: starDrink}))
    })
})

function complement(sumPerDay){
    let datum = new Date()
    let formatted = datum.toISOString().split('T')[0]
    today = new Date()
    days = daysInMonth(today.getMonth()+1,today.getFullYear())
    daysDone = []
    sumPerDay.forEach(sumDay => {
        daysDone.push(sumDay.letrehozva.slice(-2))
    })


    for (let day = 1; day < days+1; day++) {
        if (!daysDone.includes(day.toString())){
            let day2insert = new Date(today.getFullYear(), today.getMonth(), day+1)
            let day2insertRightFormat = day2insert.toISOString().split('T')[0]
            sumPerDay.push({
                letrehozva: day2insertRightFormat,
                sum: 0
            })
        }
    }
    return sumPerDay
}

function sortIt(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

app.listen(port, () => console.log(`Listenning on port ${port}`))