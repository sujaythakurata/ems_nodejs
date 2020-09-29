
//INSERT INTO EMS_T2(M, C_ID, PF, Frequency, VL_12, VL_23, VL_31, I_N, V_THD, I_THD, E)values('m_1', '7c92d6', 22, 12, 32, 22, 4.22, 32, 22, 22.34, 42); 


//get live and hitorical page 4 cards data i_n and frequency
exports.meter_energyinfo = (req, res)=>{
	let m_id = req.params.machine_id;
	let date = new Date();
	let month = date.getMonth()+1;
	let year = date.getFullYear();
	let start_date = `${year}-${month}-01`;
	let last_day = new Date(year, month, 0).getDate();
	let end_date = `${year}-${month}-${last_day}`;
	let query = `

	SELECT KWH AS TODAY_POWER FROM KWH_DAILY WHERE CREATED_DATE = CURRENT_DATE AND M = '${m_id}' AND C_ID = '${req.client_id}';
	SELECT KWH AS DAILY_AVG FROM KWH_MONTHLY WHERE MONTH = ${month} AND M = '${m_id}' AND C_ID = '${req.client_id}';
	SELECT KWH AS MONTHLY_AVG FROM KWH_YEARLY WHERE YEAR = ${year} AND M = '${m_id}' AND C_ID = '${req.client_id}';
	SELECT SUM(KWH) AS TOTAL_MONTHLY_CONSUMPTION FROM KWH_DAILY WHERE CREATED_DATE >='${start_date}' AND CREATED_DATE<='${end_date}'
	AND M = '${m_id}' AND C_ID = '${req.client_id}';
	SELECT PF FROM EMS_T2  WHERE M = '${m_id}' AND C_ID = '${req.client_id}' ORDER BY INSERTDATETIME DESC LIMIT 1;
	SELECT I_N, Frequency FROM EMS_T2 WHERE M = '${m_id}' AND C_ID = '${req.client_id}'
	AND INSERTDATETIME<=NOW() AND INSERTDATETIME>=CONCAT(CURRENT_DATE, ' ', '00:00:00') ORDER BY INSERTDATETIME DESC LIMIT 1;
	`; 

	global.pool.getConnection((err, conn)=>{
		if(err){
			global.logerr.log(err);
			res.status(500).end();
		}
		conn.query(query, (err, result)=>{
			conn.release();
			if(err){
				global.logerr.log(err);
				res.status(500).end();
			}else
			{result.machine_id = m_id;
			result.client_id = req.client_id;
			result.push({"machine_id":m_id});
			result.push({"client_id":req.client_id});
			res.status(200).json(result);}
		});

	});
}


///get active power vs reactive power vs apparent power
exports.powerinfo=(req, res)=>{
	let m_id  = req.params.machine_id;
	let minute = req.params.minute;
	let query = `

	SELECT M, C_ID, W_sum, VA_sum, VAR_sum, INSERTDATETIME AS TIME FROM EMS_T1 WHERE M = '${m_id}' AND C_ID = '${req.client_id}'
	And INSERTDATETIME <= NOW() AND INSERTDATETIME >= DATE_SUB(NOW(), INTERVAL ${minute} MINUTE);
	`;
	global.pool.getConnection((err, conn)=>{
		if(err){
			global.logerr.log(err);
			res.status(500).end();
		}
		conn.query(query, (err, result)=>{
			conn.release();
			if(err){
				global.logerr.log(err);
				res.status(500).end();
			}else
			res.status(200).json(result);
		})

	});
}


//get phase1 vs phase2 vs phase3
exports.voltageinfo=(req, res)=>{
	let m_id  = req.params.machine_id;
	let minute = req.params.minute;
	let query = `

	SELECT M, C_ID, V1, V2, V3, INSERTDATETIME AS TIME FROM EMS_T1 WHERE M = '${m_id}' AND C_ID = '${req.client_id}'
	And INSERTDATETIME <= NOW() AND INSERTDATETIME >= DATE_SUB(NOW(), INTERVAL ${minute} MINUTE);
	`;
	global.pool.getConnection((err, conn)=>{
		if(err){
			global.logerr.log(err);
			res.status(500).end();
		}
		conn.query(query, (err, result)=>{
			conn.release();
			if(err){
				global.logerr.log(err);
				res.status(500).end();
			}else
			res.status(200).json(result);
		})

	});
}

//get voltage line1 vs voltage line2 vs voltage line3
exports.voltagelineinfo=(req, res)=>{
	let m_id  = req.params.machine_id;
	let minute = req.params.minute;
	let query = `

	SELECT M, C_ID, VL_12, VL_23, VL_31 , INSERTDATETIME AS TIME FROM EMS_T2 WHERE M = '${m_id}' AND C_ID = '${req.client_id}'
	And INSERTDATETIME <= NOW() AND INSERTDATETIME >= DATE_SUB(NOW(), INTERVAL ${minute} MINUTE);
	`;
	global.pool.getConnection((err, conn)=>{
		if(err){
			global.logerr.log(err);
			res.status(500).end();
		}
		conn.query(query, (err, result)=>{
			conn.release();
			if(err){
				global.logerr.log(err);
				res.status(500).end();
			}else
			res.status(200).json(result);
		})

	});
}

//GET I1 VS I2 VS I3

exports.currentinfo=(req, res)=>{
	let m_id  = req.params.machine_id;
	let minute = req.params.minute;
	let query = `

	SELECT M, C_ID, I1, I2, I3, INSERTDATETIME AS TIME FROM EMS_T1 WHERE M = '${m_id}' AND C_ID = '${req.client_id}'
	And INSERTDATETIME <= NOW() AND INSERTDATETIME >= DATE_SUB(NOW(), INTERVAL ${minute} MINUTE);
	`;
	global.pool.getConnection((err, conn)=>{
		if(err){
			global.logerr.log(err);
			res.status(500).end();
		}
		conn.query(query, (err, result)=>{
			conn.release();
			if(err){
				global.logerr.log(err);
				res.status(500).end();
			}else
			res.status(200).json(result);
		})

	});
}


//get voltage harmonics vs current harmonics
exports.harmonicsinfo=(req, res)=>{
	let m_id  = req.params.machine_id;
	let minute = req.params.minute;
	let query = `

	SELECT M, C_ID, I_THD, V_THD, INSERTDATETIME AS TIME FROM EMS_T2 WHERE M = '${m_id}' AND C_ID = '${req.client_id}'
	And INSERTDATETIME <= NOW() AND INSERTDATETIME >= DATE_SUB(NOW(), INTERVAL ${minute} MINUTE);
	`;
	global.pool.getConnection((err, conn)=>{
		if(err){
			global.logerr.log(err);
			res.status(500).end();
		}
		conn.query(query, (err, result)=>{
			conn.release();
			if(err){
				global.logerr.log(err);
				res.status(500).end();
			}else
			res.status(200).json(result);
		})

	});
}