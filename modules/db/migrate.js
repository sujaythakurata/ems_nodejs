const path = require("path");
const logerr = require(path.join(process.env.PWD, 'modules/logerror/logerror.js'));
require('dotenv').config();

//CREATE TABLE FUNCTION
function create_table(query, note) {
	pool.query(query, (err, result)=>{
		if (err){
			logerr.log(err);
			return;
		}
		console.log(note);
	})
}


//users table id, user_name , user_email, user_password , client_id, created time

function USERS(pool) {
	
	let query = `CREATE TABLE IF NOT EXISTS USERS(
		ID BIGINT PRIMARY KEY AUTO_INCREMENT,
		USER_NAME VARCHAR(50),
		USER_EMAIL VARCHAR(20),
		USER_PASSWORD VARCHAR(20),
		CLIENT_ID VARCHAR(6),
		CREATED_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		CREATE INDEX USER_SEARCH ON USERS(USER_EMAIL, CLIENT_ID);
	`;

	create_table(query, "USERS TABLE IS CREATED");

}

//meter_list table id , m_id, c_id, m_name, brand, created_time
function METER_LIST(pool){
		let query = `CREATE TABLE IF NOT EXISTS METER_LIST(
		ID BIGINT PRIMARY KEY AUTO_INCREMENT,
		M_ID VARCHAR(10),
		C_ID VARCHAR(6),
		M_NAME VARCHAR(20),
		BRAND VARCHAR(20),
		CREATED_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		CREATE INDEX METER_LIST_SEARCH ON METER_LIST(M_ID, C_ID, CREATED_TIME);
	`;
	create_table(query, 'METER_LIST TABLE IS CREATED');
}

//meter_config table id, m_id, c_id , m_name, full_load_i, no_load_i, off_i, unit_rage, currency, update_time;
function METER_CONFIG(pool) {
	let query = `CREATE TABLE IF NOT EXISTS METER_CONFIG(
		ID BIGINT PRIMARY KEY AUTO_INCREMENT,
		M_ID VARCHAR(10),
		C_ID VARCHAR(6),
		M_NAME VARCHAR(10),
		FULL_LOAD_I DECIMAL(10, 2),
		NO_LOAD_I DECIMAL(10, 2),
		OFF_I DECIMAL(10, 2),
		UNIT_RATE DECIMAL(10, 2),
		CURRENCY VARCHAR(10),
		UPDATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		);

		CREATE INDEX METER_CONFIG_SEARCH ON METER_CONFIG(M_ID, C_ID);
	`;

	create_table(query, 'METER_CONFIG TABLE IS CREATED');
}

//EMS_T1 id, m,c_id, v1, v2, v3, i1, i2, i3, w_sum, va_sum, var_sum, Insertdatetime
function EMS_T1(pool) {
	let query = `CREATE TABLE IF NOT EXISTS EMS_T1(
		ID BIGINT PRIMARY KEY AUTO_INCREMENT,
		M VARCHAR(10),
		C_ID VARCHAR(6),
		V1 DECIMAL(10, 2),V2 DECIMAL(10, 2), V3 DECIMAL(10,2), I1 DECIMAL(10, 2), 
		I2 DECIMAL(10, 2), I3 DECIMAL(10, 2), W_sum DECIMAL(10, 2), 
		VA_sum DECIMAL(10, 2), VAR_sum DECIMAL(10, 2),
		INSERTDATETIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		CREATE INDEX EMS_T1_SEARCH ON EMS_T1(M, C_ID);
		CREATE INDEX EMS_T1_SEARCH_BY_TIME ON EMS_T1(INSERTDATETIME);
	`;
	create_table(query, 'EMS_T1 TABLE IS CREATED');
}

//EMS_T2 id, m,c_id, pf, f, vl_12, vl_23, vl_31, i_n, v_thd, I_thd, E, Insertdatetime
function EMS_T2(pool) {
	let query = `CREATE TABLE IF NOT EXISTS EMS_T2(
		ID BIGINT PRIMARY KEY AUTO_INCREMENT,
		M VARCHAR(10),
		C_ID VARCHAR(6),
		PF BIGINT,Frequency DECIMAL(10, 2), VL_12 DECIMAL(10, 2), 
		VL_23 DECIMAL(10, 2), VL_31 DECIMAL(10, 2), I_N DECIMAL(10, 2), 
		V_THD DECIMAL(10, 2), I_THD DECIMAL(10, 2), E DECIMAL(10, 2),
		INSERTDATETIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		CREATE INDEX EMS_T2_SEARCH ON EMS_T2(M, C_ID);
		CREATE INDEX EMS_T2_SEARCH_BY_TIME ON EMS_T2(INSERTDATETIME);
	`;
	create_table(query, 'EMS_T2 TABLE IS CREATED');
}

//KWH_DAILY ID, KWH(E), M, CREATED_DATE, UPDATE_TIME

function KWH_DAILY(pool){
	let query = `CREATE TABLE IF NOT EXISTS KWH_DAILY(ID BIGINT PRIMARY KEY AUTO_INCREMENT,
	M VARCHAR(10),
	C_ID VARCHAR(6),
	KWH DECIMAL(10, 2),
	CREATED_DATE DATE,
	UPDATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
	CREATE INDEX KWH_DAILY_SEARCH ON KWH_DAILY(M, C_ID, CREATED_DATE, UPDATE_TIME);
	`;

	create_table(query, 'KWH_DAILY TABLE IS CREATED');
}

//KWH_MONTHLY ID, KWH(E), M, CREATED_DATE, UPDATE_TIME

function KWH_MONTHLY(pool){
	let query = `CREATE TABLE IF NOT EXISTS KWH_MONTHLY(ID BIGINT PRIMARY KEY AUTO_INCREMENT,
	M VARCHAR(10),
	C_ID VARCHAR(6),
	KWH DECIMAL(10, 2),
	MONTH INT(3),
	YEAR INT(4),
	UPDATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
	CREATE INDEX KWH_MONTHLY_SEARCH ON KWH_MONTHLY(M, C_ID, MONTH, YEAR, UPDATE_TIME);
	`;

	create_table(query, 'KWH_MONTHLY TABLE IS CREATED');
}

//KWH_YEARLY ID, KWH(E), M, CREATED_DATE, UPDATE_TIME

function KWH_YEARLY(pool){
	let query = `CREATE TABLE IF NOT EXISTS KWH_YEARLY(ID BIGINT PRIMARY KEY AUTO_INCREMENT,
	M VARCHAR(10),
	C_ID VARCHAR(6),
	KWH DECIMAL(10, 2),
	YEAR INT(4),
	UPDATE_TIME TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
	CREATE INDEX KWH_YEARLY_SEARCH ON KWH_YEARLY(M, C_ID, UPDATE_TIME, YEAR);
	`;

	create_table(query, 'KWH_YEARLY TABLE IS CREATED');
}





//migrate all tables.
exports.migrate = (pool)=>{
	pool.getConnection((err, conn)=>{
		if(err){
			logerr.log(err);
			return;
		}
		conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.database}`, (err, result)=>{
			if(err){
				logerr.log(err);
				return;
			}
			pool.config.connectionConfig.database = process.env.database;
			console.log(`${process.env.database} DATABASE IS CREATED`);
			USERS(pool);
			METER_LIST(pool);
			METER_CONFIG(pool);
			EMS_T1(pool);
			EMS_T2(pool);
			KWH_DAILY(pool);
			KWH_MONTHLY(pool);
			KWH_YEARLY(pool);
			conn.release();

		})
	})
}