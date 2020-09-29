// SELECT * FROM(SELECT MYTABLE.M, MYTABLE.C_ID,LIST.M_NAME,  I1, I2, I3,ROUND((I1+I2+I3)/3, 2) AS I,  INSERTDATETIME FROM (SELECT * FROM METER_LIST WHERE C_ID='7c92d6')LIST, (SELECT M, C_ID,  I1, I2, I3, INSERTDATETIME FROM EMS_T1 WHERE INSERTDATETIME IN (SELECT MAX(INSERTDATETIME) FROM EMS_T1 GROUP BY M, C_ID))MYTABLE WHERE LIST.C_ID = MYTABLE.C_ID AND LIST.M_ID = MYTABLE.M)I_TABLE INNER JOIN (SELECT FULL_LOAD_I, NO_LOAD_I, OFF_I, M_ID, C_ID FROM METER_CONFIG)CONFIG ON CONFIG.M_ID = I_TABLE.M AND CONFIG.C_ID = I_TABLE.C_ID;


//GET FULL LOAD, NO LOAD, OFF LOAD HOUR OF ALL MACHINES COUNT (TODAY'S)
exports.status = (req, res)=>{

	let query = `
	SELECT * FROM(SELECT MYTABLE.M, MYTABLE.C_ID,LIST.M_NAME,  I1, I2, I3,ROUND((I1+I2+I3)/3, 2) AS I,  INSERTDATETIME FROM 
	(SELECT * FROM METER_LIST WHERE C_ID='${req.client_id}')LIST, 
	(SELECT M, C_ID,  I1, I2, I3, INSERTDATETIME FROM EMS_T1 WHERE INSERTDATETIME IN 
	(SELECT MAX(INSERTDATETIME) FROM EMS_T1 GROUP BY M, C_ID))MYTABLE 
	WHERE LIST.C_ID = MYTABLE.C_ID AND LIST.M_ID = MYTABLE.M)I_TABLE 
	INNER JOIN 
	(SELECT FULL_LOAD_I, NO_LOAD_I, OFF_I, M_ID, C_ID FROM METER_CONFIG)CONFIG ON 
	CONFIG.M_ID = I_TABLE.M AND CONFIG.C_ID = I_TABLE.C_ID;
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
			}else{
				let arr = {
					FULL_LOAD:0,
					NO_LOAD:0,
					OFF_LOAD:0
				};
				for(let i = 0; i<result.length; i++){
					let data = result[i];
					if(data.I >= data.FULL_LOAD_I)
						arr.FULL_LOAD += 1;
					else if(data.I >= data.NO_LOAD_I && data.i<data.FULL_LOAD_I)
						arr.NO_LOAD += 1;
					else
						arr.OFF_LOAD += 1;
				}
				res.status(200).json(arr);
			}

		});
	});
}

//GET FULL LOAD, NO LOAD OF LOAD HOUR OF ALL MACHINES (TODAY'S)
exports.loadinfo = (req, res)=>{
	let minute = 1440;
	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth()+1;
	let start_date = `${year}-${month}-${date.getDate()} 00:00:00`;
	let end_date = `${year}-${month}-${date.getDate()} 23:59:59`;
	let query = `
	SET SQL_MODE='';
	SELECT AVG_TABLE.M_NAME, AVG_TABLE.M, AVG_TABLE.C_ID, ROUND(COUNT(I)/60, 2) AS FULL_LOAD_HOUR,COUNT(I) AS FULL_LOAD_MINUTE,  AVG_TABLE.INSERTDATETIME FROM 
	(SELECT METERS.M_NAME, ROUND((I1+I2+I3)/3, 2) AS I,I1, I2, I3,  M , EMS_T1.C_ID, INSERTDATETIME  FROM EMS_T1, 
	(SELECT * FROM METER_LIST WHERE C_ID = '${req.client_id}')METERS WHERE EMS_T1.M = METERS.M_ID AND EMS_T1.C_ID = METERS.C_ID AND 
	INSERTDATETIME>=CONCAT(CURRENT_DATE, " ", "00:00:00") AND 
	INSERTDATETIME<=CONCAT(CURRENT_DATE, " ", "23:59:59"))AVG_TABLE, 
	(SELECT * FROM METER_CONFIG)CONFIG 
	WHERE CONFIG.M_ID = AVG_TABLE.M AND CONFIG.C_ID  = AVG_TABLE.C_ID 
	AND AVG_TABLE.I>=CONFIG.FULL_LOAD_I GROUP BY AVG_TABLE.M, AVG_TABLE.C_ID;

	SELECT AVG_TABLE.M_NAME, AVG_TABLE.M, AVG_TABLE.C_ID, ROUND(COUNT(I)/60, 2) AS NO_LOAD_HOUR,COUNT(I) AS NO_LOAD_MINUTE,  AVG_TABLE.INSERTDATETIME FROM 
	(SELECT METERS.M_NAME, ROUND((I1+I2+I3)/3, 2) AS I,I1, I2, I3,  M , EMS_T1.C_ID, INSERTDATETIME  FROM EMS_T1, 
	(SELECT * FROM METER_LIST WHERE C_ID = '${req.client_id}')METERS WHERE EMS_T1.M = METERS.M_ID AND EMS_T1.C_ID = METERS.C_ID AND 
	INSERTDATETIME>=CONCAT(CURRENT_DATE, " ", "00:00:00") AND 
	INSERTDATETIME<=CONCAT(CURRENT_DATE, " ", "23:59:59"))AVG_TABLE, 
	(SELECT * FROM METER_CONFIG)CONFIG 
	WHERE CONFIG.M_ID = AVG_TABLE.M AND CONFIG.C_ID  = AVG_TABLE.C_ID 
	AND AVG_TABLE.I>=CONFIG.NO_LOAD_I AND AVG_TABLE.I<CONFIG.FULL_LOAD_I GROUP BY AVG_TABLE.M, AVG_TABLE.C_ID;

	SELECT AVG_TABLE.M_NAME, AVG_TABLE.M, AVG_TABLE.C_ID, ROUND(COUNT(I)/60, 2) AS OFF_LOAD_HOUR,COUNT(I) AS OFF_LOAD_MINUTE,  AVG_TABLE.INSERTDATETIME FROM 
	(SELECT METERS.M_NAME, ROUND((I1+I2+I3)/3, 2) AS I,I1, I2, I3,  M , EMS_T1.C_ID, INSERTDATETIME  FROM EMS_T1, 
	(SELECT * FROM METER_LIST WHERE C_ID = '${req.client_id}')METERS WHERE EMS_T1.M = METERS.M_ID AND EMS_T1.C_ID = METERS.C_ID AND 
	INSERTDATETIME>=CONCAT(CURRENT_DATE, " ", "00:00:00") AND 
	INSERTDATETIME<=CONCAT(CURRENT_DATE, " ", "23:59:59"))AVG_TABLE, 
	(SELECT * FROM METER_CONFIG)CONFIG 
	WHERE CONFIG.M_ID = AVG_TABLE.M AND CONFIG.C_ID  = AVG_TABLE.C_ID 
	AND AVG_TABLE.I<=CONFIG.OFF_I GROUP BY AVG_TABLE.M, AVG_TABLE.C_ID;
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
			}else{
				res.status(200).json(result);
			}

		});
	});
}


//GET TODAY'S ENERGY E OF ALL MACHINES
exports.powerinfo = (req, res)=>{
	let query = `
	SELECT LIST.M_NAME, KWH, KWH_DAILY.M , KWH_DAILY.C_ID, CREATED_DATE FROM 
	(SELECT * FROM METER_LIST WHERE C_ID = '7c92d6')LIST, 
	KWH_DAILY WHERE LIST.M_ID = KWH_DAILY.M AND LIST.C_ID = KWH_DAILY.C_ID 
	AND KWH_DAILY.CREATED_DATE = CURRENT_DATE;

	SELECT * FROM (SELECT LIST.M_NAME, W_sum, EMS_T1.M , EMS_T1.C_ID, INSERTDATETIME FROM 
	(SELECT * FROM METER_LIST WHERE C_ID = '${req.client_id}')LIST, 
	EMS_T1 WHERE LIST.M_ID = EMS_T1.M AND LIST.C_ID = EMS_T1.C_ID AND EMS_T1.INSERTDATETIME >= CONCAT(CURRENT_DATE, " ", "00:00:00") 
	AND EMS_T1.INSERTDATETIME <= CONCAT(CURRENT_DATE, " ", "23:59:59"))LIST_TABLE WHERE LIST_TABLE.INSERTDATETIME IN 
	(SELECT MAX(INSERTDATETIME) FROM EMS_T1 WHERE C_ID = '${req.client_id}' GROUP BY EMS_T1.M) ORDER BY M_NAME;
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
			}else{
				res.status(200).json(result);
			}

		});
	});
}