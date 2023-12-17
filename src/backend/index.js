//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var cors = require("cors");
var corsOptions = {origin:"*",optionSucessStatus:200};

var app     = express();
app.use(cors(corsOptions));

var utils   = require('./mysql-connector');

// to parse application/json
app.use(express.json()); 
// to serve static files
app.use(express.static('/home/node/app/static/'));

//=======[ Main module code ]==================================================
app.post('/updateStatus/', function(req, res){
    if(req.body.id==undefined || req.body.id==null){
        res.status(409);
        res.send("Invalid ID");
    }else{
        var query = `UPDATE Devices SET state=${Boolean(req.body.status)} WHERE id=${req.body.id}`
        utils.query(query, function(err, rsp,fields){
            if(err==null){
                res.status(200)
                res.send("Updated successfully!");
            } else {
                res.status(500);
                res.send("An error has happened when trying to update status.");
            }
        });     
    } 
});

app.post('/updateIntensity/', function(req, res){
    if(req.body.id==undefined || req.body.id==null){
        res.status(409);
        res.send("Invalid ID");
    }else{
        var query = `UPDATE Devices SET intensity=${req.body.intensity} WHERE id=${req.body.id}`
        utils.query(query, function(err, rsp,fields){
            if(err==null){
                res.status(200)
                res.send("Updated successfully!");
            } else {
                res.status(500);
                res.send("An error has happened when trying to update intensity.");
            }
        });     
    }
});

app.post('/deleteDevice/', function(req, res){
    if(req.body.id==undefined || req.body.id==null){
        res.status(409);
        res.send("Invalid ID");
    }else{
        var query = `DELETE FROM Devices WHERE id=${req.body.id}`
        utils.query(query, function(err, rsp,fields){
            if(err==null){
                res.status(200)
                res.send("Deleted successfully!");
            } else {
                res.status(500);
                res.send("An error has happened when trying to update status.");
            }
        });
        
    } 
});

app.post('/addDevice/', function(req, res){
    if(req.body.name==undefined || req.body.name==null || 
        req.body.description==undefined || req.body.description==null) {
        res.status(409);
        res.send("Invalid name or description.");
    } else {
        var query = `INSERT INTO Devices (name, description, state, type, intensity) VALUES 
            ('${req.body.name}', '${req.body.description}', ${req.body.state}, ${req.body.type}, ${req.body.intensity});`
        utils.query(query, function(err, rsp,fields){
            if(err==null){
                res.status(200)
                res.send("Added successfully!");
            } else {
                res.status(500);
                res.send("An error has happened when trying to update status.");
            }
        });    
    } 
});


app.get('/devices/', function(req,res) {
    utils.query("select * from Devices",function(err,rsp,fields){
        if(err==null){
            res.send(JSON.stringify(rsp)).status(200);
        }
    });
});

app.get('/getDeviceInfo/', function(req, res) {
    var device_id = req.query.id;
    var query = `SELECT * FROM Devices WHERE id=${device_id}`
    utils.query(query, function(err,rsp,fields){
        if(err==null){
            res.send(JSON.stringify(rsp)).status(200);
        }
    });
});

app.post('/updateDevice/', function(req, res){
    if(req.body.name==undefined || req.body.name==null || 
        req.body.description==undefined || req.body.description==null) {
        res.status(409);
        res.send("Invalid name or description.");
    } else {
        var query = `UPDATE Devices SET name='${req.body.name}', description='${req.body.description}', type=${req.body.type} WHERE id=${req.body.id}`
        utils.query(query, function(err, rsp,fields){
            if(err==null){
                res.status(200)
                res.send("Added successfully!");
            } else {
                res.status(500);
                res.send("An error has happened when trying to update status.");
            }
        });    
    } 
});

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================