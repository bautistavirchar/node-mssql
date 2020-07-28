const mssql = require('../db/db.mssql')
const express = require('express');
const router = express.Router();

router.get('/',(req,res) => {
    mssql.get('select * from AllGameUser').then((queryResult) => {
        res.send(queryResult)
    });
})

router.get('/:username',(req,res) => {
    const command = `
        SELECT * FROM AllGameUser
        WHERE userid=@username
    `;
    var params = [
        {
            name: 'username',
            type: mssql.type.VARCHAR,
            value: req.params.username
        }
    ]
    mssql.get(command,params).then((queryResult) => {
        res.send(queryResult)
    });
})

router.post('/register',(req,res) => {
    const defaultColumns = "[userid],[Passwd],[RegistDay],[DisuseDay],[inuse],[Grade],[EventChk],[SelectChk],[BlockChk],[SpecialChk],[Credit],[DelChk],[Channel]";
    const defaultValues = "GETDATE(),DATEADD(YEAR,10,GETDATE()),'0','U','0','0','0','0','0','0','0.0.0.0'"
    const command = `
        INSERT INTO AllGameUser(${defaultColumns})
        VALUES(@username,@password,${ defaultValues })
        INSERT INTO ${req.body.username.substr(0,1).toUpperCase()}GameUser(${defaultColumns})
        VALUES(@username,@password,${defaultValues})
    `;
    var params = [
        {
            name: 'username',
            type: mssql.type.VARCHAR,
            value: req.body.username
        },
        {
            name: 'password',
            type: mssql.type.VARCHAR,
            value: req.body.password
        }
    ]
    mssql.post(command,params).then((queryResult) => {
        res.send(queryResult)
    })
})

router.delete('/delete/:username',(req,res) => {
    const command = `
        DELETE AllGameUser
        WHERE userid=@username
        DELETE ${req.params.username.substr(0,1).toUpperCase()}GameUser
        WHERE userid=@username
    `;
    var params = [
        {
            name: 'username',
            type: mssql.type.VARCHAR,
            value: req.params.username
        }
    ]
    mssql.post(command,params).then((queryResult) => {
        res.send(queryResult)
    })
})

module.exports = router;