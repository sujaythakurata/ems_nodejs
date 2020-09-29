//DB
const path = require('path');
const db = require(path.join(process.env.PWD, 'modules/db/db_config.js'));
const migrate = require(path.join(process.env.PWD, 'modules/db/migrate.js'));
global.pool = db.connection();
migrate.migrate(pool);

//handel error
global.logerr = require(path.join(process.env.PWD, 'modules/logerror/logerror.js'));

//make db calls
global.call = require(path.join(process.env.PWD, 'modules/db/do_call.js'));


//EXPRESS

require('dotenv').config();
const express = require('express');

app = express();

//dependensices
app.use(require('body-parser').json());
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost/ems/html/login/signin.html");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, ");
//     // res.header('Access-Control-Allow-Credentials', 'true');
//     next();
// });
app.use(require('cookie-parser')());
// //cross
app.use(require("cors")({
	origin: process.env.origin,
	credentials: true,
}));



//auth
global.auth = require(path.join(__dirname+"/modules/middlewares/auth.js"));

//run server
app.listen(process.env.port,()=>{
	console.log(`server is running on port ${process.env.port}`)
});

//ROUTING
const route = require(path.join(process.env.PWD, 'modules/routes/routes.js'));
route.route(app, express);

//apis routing
route.apis(app);

///start services
const kwh_daily = require(path.join(process.env.PWD, 'services/kwh_daily.js'));
const kwh_monthly = require(path.join(process.env.PWD, 'services/kwh_monthly.js'));
const kwh_yearly = require(path.join(process.env.PWD, 'services/kwh_yearly.js'));
setTimeout(()=>{kwh_daily.start(); kwh_monthly.start(); kwh_yearly.start()}, 5000);
