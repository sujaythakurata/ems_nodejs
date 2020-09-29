
exports.powerinfo = (req, res)=>{
	let m_id = req.params.machine_id;
	let query = `
	SELECT KWH , ROUND(KWH*UNIT_RATE, 2) AS TOTAL_PRICE FROM KWH_DAILY, METER_CONFIG WHERE M = '${m_id}' AND KWH_DAILY.C_ID='${req.client_id}'
	AND CREATED_DATE = CURRENT_DATE
	AND METER_CONFIG.M_ID = '${m_id}' AND METER_CONFIG.C_ID='${req.client_id}'
	;
	SELECT ROUND((I1+I2+I3)/3, 2) AS I FROM EMS_T1 WHERE M = '${m_id}' AND C_ID='${req.client_id}'
	ORDER BY INSERTDATETIME DESC LIMIT 1;
	SELECT W_sum FROM EMS_T1
	WHERE M = '${m_id}' AND C_ID='${req.client_id}'
	ORDER BY INSERTDATETIME DESC LIMIT 1;
	`;
	global.pool.getConnection((err, conn)=>{

		if(err){
			global.logerr.log(err);
			res.status(500).end();
		}

		conn.query(query, (err, result)=>{
			if(err){
				global.logerr.log(err);
				res.status(500).end();
			}else
			res.status(200).json(result);

		});
	});
}

//get load 

function get_load(m_id, minute, start_date, end_date, req, res) {
	let query = `
	SET SQL_MODE='';
	SELECT ROUND(COUNT(I)/60, 2) AS FULL_LOAD_HOUR, I, M, C_ID, DAYOFMONTH(INSERTDATETIME) AS DAY FROM
	(SELECT ((I1+I2+I3)/3) AS I,  INSERTDATETIME, ID, M, C_ID, FLOOR(UNIX_TIMESTAMP(INSERTDATETIME)/(${minute}*60)) AS TIME 
	FROM EMS_T1 WHERE M ='${m_id}' AND C_ID = '${req.client_id}' AND INSERTDATETIME>='${start_date}' AND INSERTDATETIME<='${end_date}')
	MYTABLE WHERE MYTABLE.I>=(SELECT FULL_LOAD_I FROM METER_CONFIG WHERE M_ID='${m_id}' AND C_ID = '${req.client_id}') GROUP BY TIME;
	
	SELECT ROUND(COUNT(I)/60, 2) AS NO_LOAD_HOUR, I, M, C_ID, DAYOFMONTH(INSERTDATETIME) AS DAY FROM
	(SELECT ((I1+I2+I3)/3) AS I,  INSERTDATETIME, ID, M, C_ID, FLOOR(UNIX_TIMESTAMP(INSERTDATETIME)/(${minute}*60)) AS TIME 
	FROM EMS_T1 WHERE M ='${m_id}' AND C_ID = '${req.client_id}' AND INSERTDATETIME>='${start_date}' AND INSERTDATETIME<='${end_date}')
	MYTABLE WHERE MYTABLE.I>=(SELECT NO_LOAD_I FROM METER_CONFIG WHERE M_ID='${m_id}' AND C_ID = '${req.client_id}') 
	AND MYTABLE.I<(SELECT FULL_LOAD_I FROM METER_CONFIG WHERE M_ID='${m_id}' AND C_ID = '${req.client_id}') 
	GROUP BY TIME;

	SELECT ROUND(COUNT(I)/60, 2) AS OFF_LOAD_HOUR, I, M, C_ID, DAYOFMONTH(INSERTDATETIME) AS DAY FROM
	(SELECT ((I1+I2+I3)/3) AS I,  INSERTDATETIME, ID, M, C_ID, FLOOR(UNIX_TIMESTAMP(INSERTDATETIME)/(${minute}*60)) AS TIME 
	FROM EMS_T1 WHERE M ='${m_id}' AND C_ID = '${req.client_id}' AND INSERTDATETIME>='${start_date}' AND INSERTDATETIME<='${end_date}')
	MYTABLE WHERE MYTABLE.I<=(SELECT OFF_I FROM METER_CONFIG WHERE M_ID='${m_id}' AND C_ID = '${req.client_id}') GROUP BY TIME;

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


// SELECT COUNT(I)AS C, I, M, C_ID, DAYOFMONTH(INSERTDATETIME) AS DAY FROM (SELECT ((I1+I2+I3)/3) AS I,  INSERTDATETIME, ID, M, C_ID, FLOOR(UNIX_TIMESTAMP(INSERTDATETIME)/(30*60)) AS TIME FROM EMS_T1 WHERE M ='m_1' AND C_ID = '7c92d6' AND INSERTDATETIME>=CONCAT(CURRENT_DATE," ", "00:00:00") AND INSERTDATETIME<=CONCAT(CURRENT_DATE, " ", "23:59:59"))MYTABLE WHERE MYTABLE.I>30 GROUP BY TIME;
exports.loadinfo = (req, res)=>{
	let m_id = req.params.machine_id;
	let type = req.params.type;
	let month = req.params.month;
	let date = new Date();
	let year = date.getFullYear();
	if(type  == "month"){
		let start_date = `${year}-${month}-01 00:00:00`;
		let last_day = new Date(year, month, 0).getDate();
		let end_date = `${year}-${month}-${last_day} 23:59:59`;
		get_load(m_id, 1440, start_date, end_date,req, res);

	}else if (type == 'daily'){
		let start_date = `${year}-${month}-${date.getDate()} 00:00:00`;
		let end_date = `${year}-${month}-${date.getDate()} 23:59:59`;
		get_load(m_id, 60, start_date, end_date,req, res);
	}else{
		let start_date = `${year}-${month}-${date.getDate()} 00:00:00`;
		let end_date = `${year}-${month}-${date.getDate()} 23:59:59`;
		get_load(m_id, 1440, start_date, end_date,req, res);
	}
}