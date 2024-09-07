const pool = require("./pool");

const query = (query, data, callback) => {
    
    pool.getConnection( (err, con) =>{
        
        if (err) {
            con.release();
            callback({
                status: 408,
                message: "Se agotó el tiempo de conexión. Por favor inténtalo de nuevo.",
            }, null);
        }
        
        con.query(query, data, (error, result, fields) => {

            con.release();
            
            if (error) {
                console.log(error)
				callback({
                    status: 500,
                    message: "Error Interno del Servidor. Por favor inténtalo de nuevo.",
                }, null);
			} else {
                callback(null, result);
            }
        });
    });
}

module.exports = query;