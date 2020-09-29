

exports.handel = (req, res)=>{
	const m_id = req.body.meter_id;
	const m_name = req.body.meter_name;
	const brand = req.body.brand;
	const f_l_i = req.body.full_load_i;
	const n_l_i = req.body.no_load_i;
	const f_i = req.body.off_i;
	const unit = req.body.unit;
	const currency = req.body.currency;
	const c_id = req.client_id;

	global.pool.getConnection((err, conn)=>{

		if(err){
			global.logerr.log(err);
			res.status(500).end();
		}

		//same meter is exists
		let query = `SELECT M_ID FROM METER_LIST WHERE M_ID = '${m_id}' AND C_ID='${c_id}'`;
		conn.query(query, (err, result)=>{
			if(err){
				conn.release();
				global.logerr.log(err);
				res.status(500).end();
			}
			if(result.length == 0){

				let query = `
				INSERT INTO METER_LIST(M_ID, C_ID, M_NAME, BRAND)VALUES(
				'${m_id}',
				'${c_id}',
				'${m_name}',
				'${brand}'
				);
				INSERT INTO METER_CONFIG(M_ID, C_ID, M_NAME,
				FULL_LOAD_I,
				NO_LOAD_I,
				OFF_I,
				UNIT_RATE,
				CURRENCY
				)VALUES(
				'${m_id}',
				'${c_id}',
				'${m_name}',
				${f_l_i},
				${n_l_i},
				${f_i},
				${unit},
				'${currency}'
				);
				INSERT INTO EMS_T1(M, C_ID, V1, V2, V3, I1, I2, I3, W_sum, VA_sum, VAR_sum)VALUES(
				'${m_id}', '${c_id}', 0, 0, 0, 0, 0,0, 0, 0, 0
				);
				INSERT INTO EMS_T2	(M, C_ID, PF, Frequency, VL_12, VL_23, VL_31, I_N, V_THD, I_THD, E)VALUES(
				'${m_id}', '${c_id}', 0, 0, 0, 0, 0,0, 0, 0, 0
				);
				INSERT INTO KWH_DAILY( M, C_ID, KWH, CREATED_DATE)VALUES(
				'${m_id}', '${c_id}', 0, CURRENT_DATE
				);
				INSERT INTO KWH_MONTHLY( M, C_ID, KWH, MONTH, YEAR)VALUES(
				'${m_id}', '${c_id}', 0, MONTH(CURRENT_DATE), YEAR(CURRENT_DATE)
				);
				INSERT INTO KWH_YEARLY( M, C_ID, KWH, YEAR)VALUES(
				'${m_id}', '${c_id}', 0, YEAR(CURRENT_DATE)
				);
				`;
				conn.query(query, (err, result)=>{
					conn.release();
					if(err){
						global.logerr.log(err);
						res.status(500).end();
					}else
					res.status(201).json({"status":"new meter created"});
				})
			}else{
				conn.release();
				res.status(409).end();
			}
			
		})


	})

}