const mssql = require('mssql')
const config = {
    user: 'sa',
    password: 'Password1234',
    server: 'localhost',
    database: 'AccountDB',
    requestTimeout: 1000 * 60 * 60,
    pool: {
      max: 1,
      min: 0,
      idleTimeoutMillis: 1000,
    },
};

function executeGet(command, params = null){
    const rows = [];
    return new Promise((resolve, reject) => {
        const pool = new mssql.ConnectionPool(config,(err) => {
            if(err) return reject(err);

            const request = new mssql.Request(pool);
            request.stream = true;
            if(params != null){
                params.forEach(param => {
                    request.input(param.name,param.type,param.value)
                });
            }
            request.query(command);

            request.on('row',(row) => {
                rows.push(row)
            })

            request.on('done',() => {
                resolve(rows)
                pool.close()
            })
        });

        pool.on('error', (err) => reject(err));
    })
}

function executePost(command, params){
    const rows = [];
    return new Promise((resolve, reject) => {
        const pool = new mssql.ConnectionPool(config,(err) => {
            if(err) return reject(err);

            const request = new mssql.Request(pool);
            request.stream = true;

            params.forEach(param => {
                request.input(param.name,param.type,param.value)
            });

            request.query(command).then((recordSet) => {
                rows.push(recordSet)
            })

            request.on('done',() => {
                resolve(rows)
                pool.close()
            })
        });

        pool.on('error', (err) => reject(err));
    })
}

module.exports = {
    get: executeGet,
    post: executePost,
    type: {
        NVARCHAR: mssql.NVarChar,
        INT: mssql.Int,
        VARCHAR: mssql.VarChar,
    }
};