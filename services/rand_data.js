const mysql = require('mysql');
require('dotenv').config();

const env = process.env;


const db = {
	host : "localhost",
	user : "sujay_php",
	password : "Sujay@1234",
	database:'EMS_TEST',
	multipleStatements: true
}

const conn = mysql.createConnection(db);

const push_some_data = function (){
	let v1 = Math.random()*(100);
	let v2 = Math.random()*(100);
	let v3 = Math.random()*(100);
	let i1 = Math.random()*(100);
	let i2 = Math.random()*(100);
	let i3 = Math.random()*(100);
	let w_sum = Math.random()*(100);
	let va_sum = Math.random()*(100);
	let var_sum = Math.random()*(100);

	let query = `INSERT INTO EMS_T1( M   , C_ID, V1  , V2  , V3  , I1  , I2  , I3  , W_sum, VA_sum, VAR_sum)
	VALUES('m_1', 't_1', ${v1}, ${v2}, ${v3}, ${i1}, ${i2}, ${i3}, ${w_sum}, ${va_sum}, ${var_sum});
	INSERT INTO EMS_T2( M    , C_ID , PF   , Frequency , VL_12 , VL_23 , VL_31 , I_N  , V_THD , I_THD , E)
	VALUES('m_1', 't_1', ${Math.round(v1)}, ${v2}, ${v3}, ${i1}, ${i2}, ${i3}, ${w_sum}, ${va_sum}, ${var_sum});
	`;

	conn.query(query);
}

setInterval(()=>{push_some_data()}, 5000);