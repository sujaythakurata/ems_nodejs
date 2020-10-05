/*

SELECT * FROM (SELECT EMS_T2.* FROM (SELECT M, C_ID,  MAX(INSERTDATETIME)AS TIME FROM EMS_T2  WHERE EMS_T2.INSERTDATETIME<=NOW() AND EMS_T2.INSERTDATETIME >CONCAT(CURDATE(), ' ', "00:00:00") GROUP BY C_ID, M)MYTABLE, EMS_T2 WHERE EMS_T2.INSERTDATETIME = MYTABLE.TIME)T1   INNER JOIN SELECT * FROM ( SELECT EMS_T2.* FROM (SELECT M, C_ID,  MIN(INSERTDATETIME)AS TIME FROM EMS_T2  WHERE EMS_T2.INSERTDATETIME<=NOW() AND EMS_T2.INSERTDATETIME >CONCAT(CURDATE(), ' ', "00:00:00") GROUP BY C_ID, M)MYTABLE, EMS_T2 WHERE EMS_T2.INSERTDATETIME = MYTABLE.TIME)T2
    -> ON T1.C_ID = T2.C_ID;
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'SELECT * FROM ( SELECT EMS_T2.* FROM (SELECT M, C_ID,  MIN(INSERTDATETIME)AS TIM' at line 1
mysql> SELECT * FROM (SELECT EMS_T2.* FROM (SELECT M, C_ID,  MAX(INSERTDATETIME)AS TIME FROM EMS_T2  WHERE EMS_T2.INSERTDATETIME<=NOW() AND EMS_T2.INSERTDATETIME >CONCAT(CURDATE(), ' ', "00:00:00") GROUP BY C_ID, M)MYTABLE, EMS_T2 WHERE EMS_T2.INSERTDATETIME = MYTABLE.TIME)T1   INNER JOIN ( SELECT EMS_T2.* FROM (SELECT M, C_ID,  MIN(INSERTDATETIME)AS TIME FROM EMS_T2  WHERE EMS_T2.INSERTDATETIME<=NOW() AND EMS_T2.INSERTDATETIME >CONCAT(CURDATE(), ' ', "00:00:00") GROUP BY C_ID, M)MYTABLE, EMS_T2 WHERE EMS_T2.INSERTDATETIME = MYTABLE.TIME)T2 ON T1.C_ID = T2.C_ID;


*/
/*
 SELECT * FROM (SELECT EMS_T2.ID, EMS_T2.M, EMS_T2.C_ID, EMS_T2.E AS E1, EMS_T2.INSERTDATETIME AS TIME_1 FROM (SELECT M, C_ID,  MAX(INSERTDATETIME)AS TIME FROM EMS_T2  WHERE EMS_T2.INSERTDATETIME<=NOW() AND EMS_T2.INSERTDATETIME >CONCAT(CURDATE(), ' ', "00:00:00") GROUP BY C_ID, M)MYTABLE, EMS_T2 WHERE EMS_T2.INSERTDATETIME = MYTABLE.TIME)T1   INNER JOIN ( SELECT EMS_T2.ID, EMS_T2.M, EMS_T2.C_ID, EMS_T2.E AS E2, EMS_T2.INSERTDATETIME AS TIME_2 FROM (SELECT M, C_ID,  MIN(INSERTDATETIME)AS TIME FROM EMS_T2  WHERE EMS_T2.INSERTDATETIME<=NOW() AND EMS_T2.INSERTDATETIME >CONCAT(CURDATE(), ' ', "00:00:00") GROUP BY C_ID, M)MYTABLE, EMS_T2 WHERE EMS_T2.INSERTDATETIME = MYTABLE.TIME)T2 ON T1.C_ID = T2.C_ID AND T1.M = T2.M
*/
//log daily status
const path = require('path');
const kwh_daily_log = require(path.join(process.env.PWD, 'modules/logsuccess/log_kwh_daily.js'));



//get meter list
const get_meter_list = (conn, data)=>{
	return new Promise((resolve, reject)=>{
		let query = `SELECT * FROM METER_LIST`;
		conn.query(query, (err, result)=>{
			if(err){
				reject(err);
			}
			if(result.length>0)
			resolve(result);
			else
				reject(0);
		});
	});
}


//get max date from kwh_daily table
const  get_max_date= (conn, meter_list)=>{
	return new Promise((resolve, reject)=>{
		let query = `SELECT MAX(CREATED_DATE) AS DATE FROM KWH_DAILY`;
		conn.query(query, function(err, result){
			if(err){
				reject(err);
			}
			resolve([meter_list, result[0].DATE]);
		});
	});
}


const insert_daily_data = (conn, data)=>{
	return new Promise((resolve, reject)=>{
		let date = new Date();
		let t_ = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
		let today= new Date(t_);
		let max_day = new Date(data[1]);
		if(today>max_day || data[1] == null){
			let array = new Array();
			for(let i = 0; i<data[0].length; i++){
				array.push([data[0][i].M_ID, data[0][i].C_ID, 0, t_])
			}
			let query= "INSERT INTO KWH_DAILY(M, C_ID, KWH, CREATED_DATE)VALUES ?";
			conn.query(query, [array], (err, result)=>{
				if(err)
					reject(err);
				resolve(result);
			})
		}
		else{
			resolve(data);

		}

		

	});
}

const get_today_e_values = (conn)=>{

	return new Promise((resolve, reject)=>{
		let date = new Date();
		let t_ = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
		let query = `SELECT * FROM 
		(SELECT EMS_T2.ID, EMS_T2.M, EMS_T2.C_ID, EMS_T2.E AS E1, EMS_T2.INSERTDATETIME AS TIME_1 FROM 
		(SELECT M, C_ID,  MAX(INSERTDATETIME)AS TIME FROM EMS_T2  WHERE EMS_T2.INSERTDATETIME<=NOW() AND EMS_T2.INSERTDATETIME >CONCAT(CURDATE(), ' ', "00:00:00") GROUP BY C_ID, M)
		MYTABLE, EMS_T2 WHERE EMS_T2.INSERTDATETIME = MYTABLE.TIME)T1   
		INNER JOIN 
		( SELECT EMS_T2.ID, EMS_T2.M, EMS_T2.C_ID, EMS_T2.E AS E2, EMS_T2.INSERTDATETIME AS TIME_2 FROM 
		(SELECT M, C_ID,  MIN(INSERTDATETIME)AS TIME FROM EMS_T2  WHERE EMS_T2.INSERTDATETIME<=NOW() AND EMS_T2.INSERTDATETIME >CONCAT(CURDATE(), ' ', "00:00:00") GROUP BY C_ID, M)MYTABLE, 
		EMS_T2 WHERE EMS_T2.INSERTDATETIME = MYTABLE.TIME)
		T2 ON T1.C_ID = T2.C_ID AND T1.M = T2.M`;
		conn.query(query, (err, result)=>{
			if(err)
				reject(err);
			let array = new Array();
			for(let i = 0; i < result.length; i++){
				let t1 = new Date(result[i].TIME_1);
				let t2 = new Date(result[i].TIME_2);
				if(t1 > t2 ){
					array.push([result[i].M, result[i].C_ID, result[i].E1-result[i].E2, t_]);

				}else{
					array.push([result[i].M, result[i].C_ID, result[i].E1, t_]);
				}
			}

			resolve(array);
		});
	});

}

const update_kwh_daily = (conn, array)=>{
	return new Promise((resolve, reject)=>{
		let quries = '';
		for(let i = 0; i<array.length; i++){
			let query = `UPDATE KWH_DAILY SET KWH = ${array[i][2]} WHERE M='${array[i][0]}' 
			AND C_ID = "${array[i][1]}" AND CREATED_DATE = "${array[i][3]}";`;
			quries += query;
		}
		if(array.length>0){
			conn.query(quries,(err, result)=>{
				if(err)
					reject(err);
				resolve(array);
			});
		}else{
			resolve(array);
		}
	});
}

function start_service(){
	global.pool.getConnection((err, conn)=>{
		if(err){
			conn.release();
			global.logerr.log(err);
		}else{
			get_meter_list(conn)
			.then((data)=>{
				return get_max_date(conn, data);
			}).
			then((day_list)=>{
				return insert_daily_data(conn, day_list);
			})
			.then((data)=>{
				return get_today_e_values(conn);
			})
			.then((data)=>{
				return update_kwh_daily(conn, data);
			})
			.then((data)=>{
				//kwh_daily_log.log(data);
				conn.release();
			})
			.catch((err)=>{
				conn.release();
				global.logerr.log(err);
			});
		}
	})
}


exports.start = ()=>{
	setInterval(()=>{
		start_service();
	}, process.env.kwh_daily_update_interval_sec*1000);
	
}