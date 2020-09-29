

//sujay thakurata | test1@gmail.com   | test          | 7c92d6
//sujay thakurata | test10@gmail.com  | test          | 02022b 

/*

 SELECT * FROM (SELECT EMS_T1.* FROM EMS_T1, 
 (SELECT EMS_T1.M, MAX(EMS_T1.INSERTDATETIME) AS TIME  FROM EMS_T1 WHERE EMS_T1.M IN 
 ( SELECT METER_LIST.M_ID FROM METER_LIST WHERE METER_LIST.C_ID = '7c92d6') 
 AND C_ID = '7c92d6' GROUP BY EMS_T1.M) 
 MYTABLE WHERE EMS_T1.M = MYTABLE.M AND EMS_T1.INSERTDATETIME = MYTABLE.TIME) 
 FINAL_TABLE ORDER BY FINAL_TABLE.M 


*/
function get_meter_info(data, res){
	data = data.slice(1);
	let result = new Array();
	for(let i = 0; i<data[0].length; i++){
		let i1 = parseFloat(data[0][i].I1==undefined?0:data[0][i].I1);
		let i2 = parseFloat(data[0][i].I2==undefined?0:data[0][i].I2);
		let i3 = parseFloat(data[0][i].I3==undefined?0:data[0][i].I3);
		let i_net = ((i1+i2+i3)/3).toFixed(2);

		let obj = {
			meter_name:data[0][i].M_NAME,
			meter_id:data[0][i].M == undefined?0:data[0][i].M,
			i:i_net,
			w_sum:data[0][i].W_sum==undefined?0:data[0][i].W_sum,
			i_thd:data[1][i].I_THD==undefined?0:data[1][i].I_THD,
			v_thd:data[1][i].V_THD==undefined?0:data[1][i].V_THD,
			f:data[1][i].Frequency==undefined?0:data[1][i].Frequency
		}
		result.push(obj);
		
	}

	res.json(result);
	
}



exports.handel = (req, res)=>{
	const query = `
	SET SQL_MODE='';
		SELECT * FROM (
		SELECT MYTABLE.M_NAME, EMS_T1.M, EMS_T1.C_ID, EMS_T1.I1, EMS_T1.I2, EMS_T1.I3, EMS_T1.W_sum FROM EMS_T1, 
	 (SELECT METER_LIST.M_NAME, EMS_T1.M, MAX(EMS_T1.INSERTDATETIME) AS TIME  FROM EMS_T1, METER_LIST WHERE EMS_T1.M IN 
	 ( SELECT METER_LIST.M_ID FROM METER_LIST WHERE METER_LIST.C_ID = '${req.client_id}') 
	 AND EMS_T1.C_ID = '${req.client_id}' AND METER_LIST.M_ID = EMS_T1.M AND METER_LIST.C_ID = EMS_T1.C_ID GROUP BY EMS_T1.M) 
	 MYTABLE WHERE EMS_T1.M = MYTABLE.M AND EMS_T1.INSERTDATETIME = MYTABLE.TIME)
	 FINAL_TABLE ORDER BY FINAL_TABLE.M
	 ;
	 SELECT * FROM (SELECT  METER_LIST.M_NAME, EMS_T2.M, EMS_T2.C_ID, EMS_T2.Frequency, EMS_T2.I_THD, EMS_T2.V_THD FROM EMS_T2, 
	 (SELECT EMS_T2.M, MAX(EMS_T2.INSERTDATETIME) AS TIME  FROM EMS_T2 WHERE EMS_T2.M IN 
	 ( SELECT METER_LIST.M_ID FROM METER_LIST WHERE METER_LIST.C_ID = '${req.client_id}') 
	 AND C_ID = '${req.client_id}' GROUP BY EMS_T2.M) 
	 MYTABLE, METER_LIST WHERE EMS_T2.M = MYTABLE.M AND EMS_T2.INSERTDATETIME = MYTABLE.TIME 
	 AND METER_LIST.M_ID = EMS_T2.M AND METER_LIST.C_ID = EMS_T2.C_ID)
	 FINAL_TABLE ORDER BY FINAL_TABLE.M
	`;
	
	global.pool.getConnection((err, conn)=>{
		if(err){
			conn.release();
			global.logerr.log(err);
			res.status(500).end();
		}
		conn.query(query, (err, result)=>{
			conn.release();
			if(err){
				global.logerr.log(err);
				res.status(500).end();
			}else
			get_meter_info(result, res)

		});
	});
	
}