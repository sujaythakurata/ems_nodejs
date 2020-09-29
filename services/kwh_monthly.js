
/*
 SELECT M, C_ID, CREATED_DATE, UPDATE_TIME, AVG(KWH) FROM KWH_DAILY WHERE CREATED_DATE>="2020-09-01" AND CREATED_DATE<"2020-10-01" GROUP BY C_ID, M;
*/
//log daily status
const path = require('path');
const kwh_monthly_log = require(path.join(process.env.PWD, 'modules/logsuccess/log_kwh_monthly.js'));



//get meter list
const get_meter_list = (conn, data)=>{
	return new Promise((resolve, reject)=>{
		let query = `SELECT * FROM METER_LIST`;
		conn.query(query, (err, result)=>{
			if(err){
				reject(err);
			}
			resolve(result);
		});
	});
}


//get max date from kwh_daily table
const  get_max_date= (conn, meter_list)=>{
	return new Promise((resolve, reject)=>{
		let query = `SELECT MAX(MONTH) AS MONTH,  MAX(YEAR) AS YEAR FROM KWH_MONTHLY`;
		conn.query(query, function(err, result){
			if(err){
				reject(err);
			}
			resolve([meter_list, result[0].MONTH, result[0].YEAR]);
		});
	});
}


const insert_daily_data = (conn, data)=>{
	return new Promise((resolve, reject)=>{
		let date = new Date();
		let m_ = date.getMonth()+1;
		let y_ = date.getFullYear();
		if((y_==data[2] && m_>data[1]) || (data[2]==null && data[1]==null)){
			let array = new Array();
			for(let i = 0; i<data[0].length; i++){
				array.push([data[0][i].M_ID, data[0][i].C_ID, 0, y_, m_]);
			}
			let query= "INSERT INTO KWH_MONTHLY(M, C_ID, KWH, YEAR, MONTH)VALUES ?";
			conn.query(query, [array], (err, result)=>{
				if(err)
					reject(err);
				resolve(result);
			})
		}else{
			resolve(data);

		}

		

	});
}

const get_today_e_values = (conn)=>{

	return new Promise((resolve, reject)=>{
		let date = new Date();
		let t_ = `${date.getFullYear()}-${date.getMonth()+1}-01`;
		let after_t = `${date.getFullYear()}-${date.getMonth()+2}-01`;
		let m_ = date.getMonth()+1;
		let y_ = date.getFullYear();
		let query = `SET SQL_MODE='';SELECT M, C_ID, CREATED_DATE, UPDATE_TIME, AVG(KWH) AS KWH FROM KWH_DAILY WHERE 
		CREATED_DATE>="${t_}" AND CREATED_DATE<"${after_t}" GROUP BY C_ID, M;`;
		conn.query(query, (err, result)=>{
			if(err)
				reject(err);
			let array = new Array();
			for(let i = 0; i < result[1].length; i++){
				array.push([result[1][i].M, result[1][i].C_ID, result[1][i].KWH, m_, y_]);
			}

			resolve(array);
		});
	});

}

const update_kwh_monthly = (conn, array)=>{
	return new Promise((resolve, reject)=>{
		let quries = '';
		for(let i = 0; i<array.length; i++){
			let query = `UPDATE KWH_MONTHLY SET KWH = ${array[i][2]} WHERE M='${array[i][0]}' 
			AND C_ID = "${array[i][1]}" AND MONTH = ${array[i][3]} AND YEAR = ${array[i][4]};`;
			quries += query;
		}
		conn.query(quries,(err, result)=>{
			if(err)
				reject(err);
			resolve(array);
		});
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
				return update_kwh_monthly(conn, data);
			})
			.then((data)=>{
				kwh_monthly_log.log(data);
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
	}, process.env.kwh_monthly_update_interval_sec*1000);
	
}