exports.handel = (req, res)=>{
	const m_id = req.body.meter_id;
	const m_name = req.body.meter_name;
	const f_l_i = req.body.full_load_i;
	const n_l_i = req.body.no_load_i;
	const f_i = req.body.off_i;
	const unit = req.body.unit;
	const currency = req.body.currency;

	global.pool.getConnection((err, conn)=>{

		if(err){
			global.logerr.log(err);
			res.status(500).end();
		}
		
		let query = `
		UPDATE METER_CONFIG SET M_NAME = '${m_name}' ,
		FULL_LOAD_I = ${f_l_i},
		NO_LOAD_I = ${n_l_i},
		OFF_I = ${f_i},
		UNIT_RATE = ${unit},
		CURRENCY = '${currency}' WHERE M_ID = '${m_id}' AND C_ID = '${req.client_id}';
		UPDATE METER_LIST SET M_NAME = '${m_name}' 
		WHERE M_ID = '${m_id}' AND C_ID = '${req.client_id}';
		`
		;
		conn.query(query, (err, result)=>{
			conn.release();
			if(err){
				global.logerr.log(err);
				res.status(500).end();
			}else
			res.status(200).json({'status':'update done'});
		})
			
			



	})
}


exports.get = (req, res)=>{
	let meter_id = req.params.meter_id;
	let query = `SELECT * FROM METER_CONFIG WHERE M_ID = '${meter_id}' AND C_ID = '${req.client_id}'`;
	global.call.make_call(query)
	.then((data)=>{
		res.json(data);
	})
	.catch((err)=>{
		res.status(500).end();
	})
}