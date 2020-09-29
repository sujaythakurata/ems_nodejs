
/*
 SELECT M, C_ID, CREATED_DATE, UPDATE_TIME, AVG(KWH) FROM KWH_DAILY WHERE CREATED_DATE>="2020-09-01" AND CREATED_DATE<"2020-10-01" GROUP BY C_ID, M;
*/
//log daily status
const path = require('path');
const kwh_yearly_log = require(path.join(process.env.PWD, 'modules/logsuccess/log_kwh_yearly.js'));



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
		let query = `SELECT MAX(YEAR) AS YEAR FROM KWH_YEARLY`;
		conn.query(query, function(err, result){
			if(err){
				reject(err);
			}
			resolve([meter_list, result[0].YEAR]);
		});
	});
}


const insert_daily_data = (conn, data)=>{
	return new Promise((resolve, reject)=>{
		let date = new Date();
		let y_ = date.getFullYear();
		if(y_>data[1] || data[1]==null){
			let array = new Array();
			for(let i = 0; i<data[0].length; i++){
				array.push([data[0][i].M_ID, data[0][i].C_ID, 0, y_]);
			}
			let query= "INSERT INTO KWH_YEARLY(M, C_ID, KWH, YEAR)VALUES ?";
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
		let y_ = date.getFullYear();
		let query = `SET SQL_MODE='';SELECT M, C_ID, AVG(KWH) AS KWH FROM KWH_MONTHLY WHERE 
		YEAR = ${y_} GROUP BY C_ID, M;`;
		conn.query(query, (err, result)=>{
			if(err)
				reject(err);
			let array = new Array();
			for(let i = 0; i < result[1].length; i++){
				array.push([result[1][i].M, result[1][i].C_ID, result[1][i].KWH, y_]);
			}

			resolve(array);
		});
	});

}

const update_kwh_yearly = (conn, array)=>{
	return new Promise((resolve, reject)=>{
		let quries = '';
		for(let i = 0; i<array.length; i++){
			let query = `UPDATE KWH_YEARLY SET KWH = ${array[i][2]} WHERE M='${array[i][0]}' 
			AND C_ID = "${array[i][1]}" AND YEAR = ${array[i][3]};`;
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
				return update_kwh_yearly(conn, data);
			})
			.then((data)=>{
				kwh_yearly_log.log(data);
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
	}, process.env.kwh_yearly_update_interval_sec*1000);
	
}