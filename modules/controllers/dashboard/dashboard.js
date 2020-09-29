//get today's kwh, w_sum, avg(pf)(month), kwh(last 30 days)

exports.powerinfo = (req, res)=>{
	let date = new Date();
	let start_date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} 00:00:00`
	let last_day = new Date(date.getFullYear(), date.getMonth()+1, 0);
	let end_date = `${date.getFullYear()}-${date.getMonth()+1}-${last_day} 23:59:59`
	let query = `
	SELECT SUM(KWH) AS TOTAL_ENERGY FROM KWH_DAILY WHERE CREATED_DATE = CURRENT_DATE AND C_ID = '${req.client_id}';
	SELECT SUM(W_sum) AS TOTAL_POWER FROM EMS_T1 WHERE INSERTDATETIME>=CONCAT(CURRENT_DATE, " ", "00:00:00")
	AND INSERTDATETIME<=CONCAT(CURRENT_DATE, " ", "23:59:59") AND C_ID = '${req.client_id}';
	SELECT AVG(PF) AS PF_AVG FROM EMS_T2 WHERE C_ID = '${req.client_id}' AND INSERTDATETIME>='${start_date}'
	AND INSERTDATETIME<='${end_date}';
	SELECT AVG(KWH) AS KWH_AVG FROM KWH_DAILY WHERE C_ID = '${req.client_id}' AND CREATED_DATE<=CURRENT_DATE
	AND CURRENT_DATE>=DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY);
	SELECT AVG(KWH) AS KWH_MONTHLY_AVG FROM KWH_MONTHLY WHERE C_ID = '${req.client_id}' AND 
	UPDATE_TIME<=NOW() AND UPDATE_TIME>=CONCAT(DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH), " ", "00:00:00");
	`;
	// global.pool.getConnection((err, conn)=>{
	// 	if(err){
	// 		global.logerr.log(err);
	// 		res.status(500).end();
	// 	}
	// 	conn.query(query, (err, result)=>{
	// 		conn.release();
	// 		if(err){
	// 			global.logerr.log(err);
	// 			res.status(500).end();
	// 		}else{
	// 			res.status(200).json(result);
	// 		}

	// 	});
	// });

	global.call.make_call(query)
	.then((data)=>{
		res.status(200).json(data);
	})
	.catch((err)=>{
		res.status(500).end();
	})
}

//get kwh_monthly kwh of every meter;

exports.powerinfo_monthly = (req, res)=>{
	let date = new Date();
	let month = date.getMonth()+1;
	let year = date.getFullYear();
	let query = `SELECT LIST.M_NAME, KWH, M, LIST.C_ID FROM KWH_MONTHLY, 
	(SELECT * FROM METER_LIST WHERE C_ID='${req.client_id}')LIST  
	WHERE LIST.M_ID = KWH_MONTHLY.M AND LIST.C_ID = KWH_MONTHLY.C_ID 
	AND MONTH = ${month} AND YEAR = ${year}`;

	global.call.make_call(query)
	.then((data)=>{
		res.status(200).json(data);
	})
	.catch((err)=>{
		res.status(500).end();
	})
}

//get w_sum of individual meters.
exports.power_consumption = (req, res)=>{
	let query = `
	SET SQL_MODE = '';
	SELECT M_NAME, SUM(W_sum) AS TOTAL FROM EMS_T1, METER_LIST WHERE EMS_T1.C_ID = '${req.client_id}'
	AND INSERTDATETIME>=CONCAT(DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY), " ", "00:00:00")
	AND INSERTDATETIME<=NOW()
	AND METER_LIST.M_ID = EMS_T1.M AND METER_LIST.C_ID = EMS_T1.C_ID
	GROUP BY EMS_T1.C_ID, M;
	`;

	global.call.make_call(query)
	.then((data)=>{
		res.status(200).json(data);
	})
	.catch((err)=>{
		console.log(err);
		res.status(500).end();
	})
}


//GET LAST 30 DAYS, MONTH , YEAR KWH_DAILY

exports.powerinfo_daily = (req, res)=>{
	let type = req.params.type;
	let query = '';
	let month = req.params.month;
	let year = req.params.year;
	let date = new Date(year, month, 0);
	let last_day = date.getDate();
	if(type == 'month'){
		let start_date = `${year}-${month}-01`;
		let end_date = `${year}-${month}-${last_day}`;
		query = `
		SET SQL_MODE = '';
		SELECT GROUP_CONCAT(METER_LIST.M_NAME ORDER BY M) AS NAME, 
		GROUP_CONCAT(M ORDER BY M) ID, METER_LIST.C_ID, CREATED_DATE, 
		GROUP_CONCAT(KWH ORDER BY M) AS KWH FROM KWH_DAILY, METER_LIST 
		WHERE KWH_DAILY.M = METER_LIST.M_ID AND KWH_DAILY.C_ID = METER_LIST.C_ID AND 
		METER_LIST.C_ID = '${req.client_id}'  
		AND CURRENT_DATE<='${end_date}' AND CURRENT_DATE>='${start_date}' 
		GROUP BY CREATED_DATE;
		`;
	}else{
		query = `
		SET SQL_MODE = '';
		SELECT GROUP_CONCAT(METER_LIST.M_NAME ORDER BY M) AS NAME, 
		GROUP_CONCAT(M ORDER BY M) ID, METER_LIST.C_ID, CREATED_DATE, 
		GROUP_CONCAT(KWH ORDER BY M) AS KWH FROM KWH_DAILY, METER_LIST 
		WHERE KWH_DAILY.M = METER_LIST.M_ID AND KWH_DAILY.C_ID = METER_LIST.C_ID AND 
		METER_LIST.C_ID = '${req.client_id}'  
		AND CURRENT_DATE<=CURRENT_DATE AND CURRENT_DATE>=DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) 
		GROUP BY CREATED_DATE;
		`;
	}

	global.call.make_call(query)
	.then((data)=>{
		data = data.slice(1)[0];
		for(let i = 0; i<data.length; i++){
			data[i].NAME = data[i].NAME.split(',');
			data[i].KWH = data[i].KWH.split(',');
			data[i].ID = data[i].ID.split(',');
			let date = new Date(data[i].CREATED_DATE);
			data[i].CREATED_DATE = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
		}
		res.status(200).json(data);
	})
	.catch((err)=>{
		res.status(500).end();
	})

}

//GET LAST 12 MONTHS , YEAR KWH_MONTHLY

exports.powerinfo_yearly = (req, res)=>{
	let type = req.params.type;
	let query = '';
	let year = req.params.year;
	if(type == 'year'){
		query = `
		SET SQL_MODE = '';
		SELECT GROUP_CONCAT(METER_LIST.M_NAME ORDER BY M) AS NAME, 
		GROUP_CONCAT(M ORDER BY M) ID, METER_LIST.C_ID, MONTH, 
		GROUP_CONCAT(KWH ORDER BY M) AS KWH FROM KWH_MONTHLY, METER_LIST 
		WHERE KWH_MONTHLY.M = METER_LIST.M_ID AND KWH_MONTHLY.C_ID = METER_LIST.C_ID AND 
		METER_LIST.C_ID = '${req.client_id}'  
		AND YEAR='${year}'
		GROUP BY MONTH;
		`;
	}else{
		query = `
		SET SQL_MODE = '';
		SELECT GROUP_CONCAT(METER_LIST.M_NAME ORDER BY M) AS NAME, 
		GROUP_CONCAT(M ORDER BY M) ID, METER_LIST.C_ID, MONTH, 
		GROUP_CONCAT(KWH ORDER BY M) AS KWH FROM KWH_MONTHLY, METER_LIST 
		WHERE KWH_MONTHLY.M = METER_LIST.M_ID AND KWH_MONTHLY.C_ID = METER_LIST.C_ID AND 
		METER_LIST.C_ID = '${req.client_id}'  
		AND YEAR<=YEAR(CURRENT_DATE) AND YEAR>=YEAR(DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH))
		GROUP BY MONTH;
		`;
	}
	global.call.make_call(query)
	.then((data)=>{
		data = data.slice(1)[0];
		for(let i = 0; i<data.length; i++){
			data[i].NAME = data[i].NAME.split(',');
			data[i].KWH = data[i].KWH.split(',');
			data[i].ID = data[i].ID.split(',');
		}
		res.status(200).json(data);
	})
	.catch((err)=>{
		res.status(500).end();
	})

}


//GET VOLTAGE AND CURRENT HARMONICS
exports.harmonics = (req, res)=>{
	let month = req.params.month;
	let year = req.params.year;
	let last_day = new Date(year, month, 0).getDate();
	let start_date = `${year}-${month}-01 00:00:00`;
	let end_date = `${year}-${month}-${last_day} 23:59:59`;
	let query = `
		SET SQL_MODE = '';
		SELECT M_NAME, M, METER_LIST.C_ID, ROUND(AVG(V_THD), 2) AS VOLTAGE, ROUND(AVG(I_THD), 2) AS CURRENT, INSERTDATETIME
		FROM EMS_T2, METER_LIST
		WHERE METER_LIST.M_ID = EMS_T2.M AND METER_LIST.C_ID = EMS_T2.C_ID
		AND METER_LIST.C_ID = '${req.client_id}'
		AND INSERTDATETIME>='${start_date}' AND INSERTDATETIME <='${end_date}'
		GROUP BY EMS_T2.M, EMS_T2.C_ID;
	`;

	global.call.make_call(query)
	.then((data)=>{
		data = data.slice(1)[0];
		res.status(200).json(data);
	})
	.catch((err)=>{
		res.status(500).end();
	})

}