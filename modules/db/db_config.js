const mysql = require('mysql');
require('dotenv').config();
const path = require("path");
const logerr = require(path.join(process.env.PWD, 'modules/logerror/logerror.js'));

const env = process.env;


const db = {
	connectionLimit : env.connectionLimit,
	host : env.host,
	user : env.user,
	password : env.password,
	multipleStatements: true
}


exports.connection =  function(){
	try{
		const pool = mysql.createPool(db);
		return pool;
	}catch(err){
		logerr.log(err);
	}
}