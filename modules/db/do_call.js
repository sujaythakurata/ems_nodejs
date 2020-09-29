exports.make_call = (query)=>{
	return new Promise((resolve, reject)=>{
		global.pool.getConnection((err, conn)=>{
			if(err){
				global.logerr.log(err);
				reject(err);
			}
			conn.query(query, (err, result)=>{
				conn.release();
				if(err){
					global.logerr.log(err);
					reject(err);
				}else{
					resolve(result);
				}
			});
		});
	})
}