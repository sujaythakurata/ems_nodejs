
//get last 30 days kwh month wise

exports.powerinfo = (req, res)=>{
	let month = req.params.month;
	let m_id  = req.params.machine_id;
	let date = new Date();
	let year = date.getFullYear();
	let start_date = `${year}-${month}-01`;
	let last_day = new Date(year, month, 0).getDate();
	let end_date = `${year}-${month}-${last_day}`;
	let query = `SELECT KWH, DAYOFMONTH(CREATED_DATE) AS DAY FROM KWH_DAILY WHERE M='${m_id}' AND C_ID='${req.client_id}' AND 
		CREATED_DATE>='${start_date}' AND CREATED_DATE<='${end_date}';
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
		});


	});
}


//get last 12 months kwh year wise
exports.powerinfo_yearly = (req, res)=>{
	let year = req.params.year;
	let m_id  = req.params.machine_id;
	let query = `SELECT KWH, MONTH FROM KWH_MONTHLY WHERE M='${m_id}' AND C_ID='${req.client_id}' AND 
		YEAR = ${year};
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
		});


	});
}

//get average
function get_average(minute, m_id, month, field, table, req, res){
	let date = new Date();
	let year = date.getFullYear();
	let start_date = `${year}-${month}-01 00:00:00`;
	let last_day = new Date(year, month, 0).getDate();
	let end_date = `${year}-${month}-${last_day} 23:59:59`;
	let quries = '';
	for(let i = 0; i<field.length; i++){
		let query = `
		SELECT ROUND(AVG(${field[i]}), 2) AS ${field[i]}, FLOOR(UNIX_TIMESTAMP(INSERTDATETIME)/(${minute}*60)) AS TIME_, 
		INSERTDATETIME AS TIME  FROM ${table} WHERE M='${m_id}' AND C_ID='${req.client_id}'
		AND INSERTDATETIME >= '${start_date}' AND INSERTDATETIME<='${end_date}'
		GROUP BY TIME_;
		`;
		quries += query;

	}

	quries = `SET SQL_MODE="";`+quries;

	global.pool.getConnection((err, conn)=>{

		if(err){
			global.logerr.log(err);
			res.status(500).end();
		}
		conn.query(quries, (err, result)=>{
			conn.release();
			if(err){
				global.logerr.log(err);
				res.status(500).end();
			}else{
				result = result.slice(1);
				res.status(200).json(result);
			}
		})
	});
}

//get mode
function get_mode(minute, m_id, month, field, table, req, res) {
	let date = new Date();
	let year = date.getFullYear();
	let start_date = `${year}-${month}-01 00:00:00`;
	let last_day = new Date(year, month, 0).getDate();
	let end_date = `${year}-${month}-${last_day} 23:59:59`;
	let quries = '';
	for(let i = 0; i< field.length; i++){
		let query = `
		SELECT MAX(C) AS FREQUENCY, ${field[i]}, TIME AS TIME_, INSERTDATETIME AS TIME FROM 
		(SELECT group_concat(${field[i]}) as g, COUNT(${field[i]}) AS C, ${field[i]}, FLOOR(UNIX_TIMESTAMP(INSERTDATETIME)/(${minute}*60)) AS TIME, 
		INSERTDATETIME  FROM ${table} 
		WHERE M='${m_id}' AND C_ID='${req.client_id}'
		AND INSERTDATETIME >= '${start_date}' AND INSERTDATETIME<='${end_date}'
		GROUP BY TIME, ${field[i]} ORDER BY C DESC)MYTABLE GROUP BY MYTABLE.TIME;
		`;
		quries += query;
	}
	quries = `SET SQL_MODE="";`+quries;
	global.pool.getConnection((err, conn)=>{

		if(err){
			global.logerr.log(err);
			res.status(500).end();
		}
		conn.query(quries, (err, result)=>{
			conn.release();
			if(err){
				global.logerr.log(err);
				res.status(500).end();
			}else
			{	
				result = result.slice(1);
				res.status(200).json(result);
			}
		})
	});
}

//get median
function get_median(minute, m_id, month,field, table, req, res) {
	let date = new Date();
	let year = date.getFullYear();
	let start_date = `${year}-${month}-01 00:00:00`;
	let last_day = new Date(year, month, 0).getDate();
	let end_date = `${year}-${month}-${last_day} 23:59:59`;
	let quries = '';
	for(let i = 0; i<field.length;i++){
		let query = `
			SELECT GROUP_CONCAT(${field[i]}) AS ${field[i]}, FLOOR(UNIX_TIMESTAMP(INSERTDATETIME)/(${minute}*60)) AS TIME_, 
			INSERTDATETIME AS TIME  FROM ${table} WHERE M='${m_id}' AND C_ID='${req.client_id}'
			AND INSERTDATETIME >= '${start_date}' AND INSERTDATETIME<='${end_date}'
			GROUP BY TIME_;
		`;
		quries += query;
	}
	quries = `SET SQL_MODE="";`+quries;
	global.pool.getConnection((err, conn)=>{

		if(err){
			global.logerr.log(err);
			res.status(500).end();
		}
		conn.query(quries, (err, result)=>{
			conn.release();
			if(err){
				global.logerr.log(err);
				res.status(500).end();
			}else{
				let index = 0;
				if(result){
					result = result.slice(1);
					for(let i = 0; i<result.length; i++){
						if(result[i].length != undefined){
							for(let j = 0; j<result[i].length; j++){
								let mid = 0;
								let arr = result[i][j][`${field[index]}`].split(",");
								let len = arr.length;
								if(len % 2 == 0){
									mid = Math.floor(len/2);
									let mid_value = Math.floor((parseInt(arr[mid])+parseInt(arr[mid-1]))/2);
									result[i][j][field[i]]= mid_value;

								}else{
									mid = Math.floor(len/2);
									let mid_value = arr[mid];
									result[i][j][field[i]]= mid_value;
								}
							}
							index += 1;
						}
					}
				}
				
				res.status(200).json(result);
			}
			
		})
	});
}

//get phase1 vs phase2 vs phase3, cal_type average, mode, median
// SELECT MAX(C), V1, TIME, INSERTDATETIME FROM (SELECT COUNT(V1) AS C, V1, FLOOR(UNIX_TIMESTAMP(INSERTDATETIME)/(15*60)) AS TIME, INSERTDATETIME  FROM EMS_T1 GROUP BY TIME, V1 ORDER BY C DESC)MYTABLE GROUP BY MYTABLE.TIME
// SELECT AVG(V1),AVG(V2), AVG(V3), FLOOR(UNIX_TIMESTAMP(INSERTDATETIME)/(15*60)) AS TIME, INSERTDATETIME  FROM EMS_T1 GROUP BY TIME;
// SELECT GROUP_CONCAT(V1) , FLOOR(UNIX_TIMESTAMP(INSERTDATETIME)/(15*60)) AS TIME, INSERTDATETIME  FROM EMS_T1 GROUP BY TIME;
exports.phaseinfo = (req, res)=>{
	let cal_type = req.params.cal_type;
	let minute = req.params.minute;
	let m_id = req.params.machine_id;
	let month = req.params.month;
	if(cal_type == "average"){
		get_average(minute, m_id, month, ['V1', 'V2', 'V3'], 'EMS_T1', req, res);

	}else if (cal_type == 'mode'){
		get_mode(minute, m_id, month, ['V1', 'V2', 'V3'], 'EMS_T1', req, res);

	}else{
		get_median(minute, m_id, month, ['V1', 'V2', 'V3'], 'EMS_T1', req, res);

	}
}


//get line 1 vs line 2 vs line 3 cal_type average, mode, median
exports.voltagelineinfo = (req, res)=>{
	let cal_type = req.params.cal_type;
	let minute = req.params.minute;
	let m_id = req.params.machine_id;
	let month = req.params.month;
	if(cal_type == "average"){
		get_average(minute, m_id, month, ['VL_12', 'VL_23', 'VL_31'], 'EMS_T2', req, res);

	}else if (cal_type == 'mode'){
		get_mode(minute, m_id, month, ['VL_12', 'VL_23', 'VL_31'], 'EMS_T2', req, res);

	}else{
		get_median(minute, m_id, month, ['VL_12', 'VL_23', 'VL_31'], 'EMS_T2', req, res);

	}
}


//get i1 vs i2 vs i3 cal_type average, mode, median

exports.currentinfo = (req, res)=>{
	let cal_type = req.params.cal_type;
	let minute = req.params.minute;
	let m_id = req.params.machine_id;
	let month = req.params.month;
	if(cal_type == "average"){
		get_average(minute, m_id, month, ['I1', 'I2', 'I3'], 'EMS_T1', req, res);

	}else if (cal_type == 'mode'){
		get_mode(minute, m_id, month, ['I1', 'I2', 'I3'], 'EMS_T1', req, res);

	}else{
		get_median(minute, m_id, month, ['I1', 'I2', 'I3'], 'EMS_T1', req, res);

	}
}


//get i_thd vs v_thd vs, frequency, pf cal_type average, mode, median

exports.harmonicsinfo = (req, res)=>{
	let cal_type = req.params.cal_type;
	let minute = req.params.minute;
	let m_id = req.params.machine_id;
	let month = req.params.month;
	if(cal_type == "average"){
		get_average(minute, m_id, month, ['I_THD', 'V_THD', 'PF', 'Frequency'], 'EMS_T2', req, res);

	}else if (cal_type == 'mode'){
		get_mode(minute, m_id, month, ['I_THD', 'V_THD', 'PF', 'Frequency'], 'EMS_T2', req, res);

	}else{
		get_median(minute, m_id, month, ['I_THD', 'V_THD', 'PF', 'Frequency'], 'EMS_T2', req, res);

	}
}