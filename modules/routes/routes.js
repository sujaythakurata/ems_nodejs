const path = require('path'); 
require('dotenv').config();

exports.route = function(app, express){
	app.use("/css", express.static(path.join(process.env.PWD, 'ems/css')));
	app.use("/dist", express.static(path.join(process.env.PWD, 'ems/dist')));
	app.use("/js", express.static(path.join(process.env.PWD, 'ems/js')));
	app.use("/modules", express.static(path.join(process.env.PWD, 'ems/modules')));
	app.use("/plugins", express.static(path.join(process.env.PWD, 'ems/plugins')));
	app.use("/assets", express.static(path.join(process.env.PWD, 'ems/assets')));
	app.use("/services", express.static(path.join(process.env.PWD, 'ems/services')));
	
	//dashboard
	app.get('/',global.auth.route_auth,  (req, res)=>{
		res.sendFile(path.join(process.env.PWD, 'ems/html/dashboard/dashboard.html'));
	});

	//signin
	app.get('/signin', (req, res)=>{
		res.sendFile(path.join(process.env.PWD, 'ems/html/login/signin.html'));
	});
	//signup
	app.get('/signup', (req, res)=>{
		res.sendFile(path.join(process.env.PWD, 'ems/html/login/signup.html'));
	});
	//meters
	app.get("/meters",global.auth.route_auth, (req, res)=>{
		res.sendFile(path.join(process.env.PWD, 'ems/html/meter/meter_list.html'));
	})
	//live page
	app.get('/live',global.auth.route_auth, (req, res)=>{
		res.sendFile(path.join(process.env.PWD, 'ems/html/live/live_page.html'));
	});
	//historical page
	app.get('/historical',global.auth.route_auth, (req, res)=>{
		res.sendFile(path.join(process.env.PWD, 'ems/html/historical/historical_page.html'));
	});
	//analysis page
	app.get('/analysis',global.auth.route_auth, (req, res)=>{
		res.sendFile(path.join(process.env.PWD, 'ems/html/analysis/analysis.html'));
	});
	//utilization page
	app.get('/utilization', global.auth.route_auth,(req, res)=>{
		res.sendFile(path.join(process.env.PWD, 'ems/html/utilization/util_page.html'));
	});


}




//apis controllers

const signup = require(path.join(process.env.PWD, 'modules/controllers/login/signup.js'));
const signin = require(path.join(process.env.PWD, 'modules/controllers/login/signin.js'));
const add_meter = require(path.join(process.env.PWD, 'modules/controllers/meter/add_meter.js'));
const meter_config = require(path.join(process.env.PWD, 'modules/controllers/meter/meter_config.js'));
const get_meter_list = require(path.join(process.env.PWD, 'modules/controllers/meter/get_meter_list.js'));
const live_page = require(path.join(process.env.PWD, 'modules/controllers/live/live_page.js'));
const historical_page = require(path.join(process.env.PWD, 'modules/controllers/historical/historical_page.js'));
const analysis_page = require(path.join(process.env.PWD, 'modules/controllers/analysis/analysis_page.js'));
const util_page = require(path.join(process.env.PWD, 'modules/controllers/utilization/util_page.js'));
const dashboard = require(path.join(process.env.PWD, 'modules/controllers/dashboard/dashboard.js'));
//apis url
exports.apis = function(app){

	//login ans signup
	app.post('/api/login/signup', signup.handel);
	app.post('/api/login/signin', signin.handel);

	//meter
	app.post('/api/meter/add_meter',global.auth.auth, add_meter.handel);
	app.put('/api/meter/meter_config', global.auth.auth, meter_config.handel);
	app.get('/api/meter/meter_list', global.auth.auth, get_meter_list.handel);
	app.get('/api/meter/meter_onlylist', global.auth.auth, get_meter_list.meter_list);
	app.get('/api/meterconfig/:meter_id', global.auth.auth, meter_config.get);

	//meter live analysis
	app.get('/api/live/energyinfo/:machine_id', global.auth.auth, live_page.meter_energyinfo);
	app.get('/api/live/powerinfo/:machine_id/:minute', global.auth.auth, live_page.powerinfo);
	app.get('/api/live/voltageinfo/:machine_id/:minute', global.auth.auth, live_page.voltageinfo);
	app.get('/api/live/voltagelineinfo/:machine_id/:minute', global.auth.auth, live_page.voltagelineinfo);
	app.get('/api/live/currentinfo/:machine_id/:minute', global.auth.auth, live_page.currentinfo);
	app.get('/api/live/harmonicsinfo/:machine_id/:minute', global.auth.auth, live_page.harmonicsinfo);

	//meter historical analysis
	app.get('/api/historical/powerinfo/:machine_id/:month', global.auth.auth, historical_page.powerinfo);
	app.get('/api/historical/powerinfo_yearly/:machine_id/:year', global.auth.auth, historical_page.powerinfo_yearly);
	app.get('/api/historical/phaseinfo/:machine_id/:month/:minute/:cal_type', global.auth.auth, historical_page.phaseinfo);
	app.get('/api/historical/voltagelineinfo/:machine_id/:month/:minute/:cal_type', global.auth.auth, historical_page.voltagelineinfo);
	app.get('/api/historical/currentinfo/:machine_id/:month/:minute/:cal_type', global.auth.auth, historical_page.currentinfo);
	app.get('/api/historical/harmonicsinfo/:machine_id/:month/:minute/:cal_type', global.auth.auth, historical_page.harmonicsinfo);

	//meter analysis page
	app.get("/api/analysis/powerinfo/:machine_id", global.auth.auth, analysis_page.powerinfo);
	app.get("/api/analysis/loadinfo/:machine_id/:type/:month", global.auth.auth, analysis_page.loadinfo);
	
	//meter utilization
	app.get("/api/utilization/status/", global.auth.auth, util_page.status);
	app.get("/api/utilization/loadinfo/", global.auth.auth, util_page.loadinfo);
	app.get("/api/utilization/powerinfo/", global.auth.auth, util_page.powerinfo);

	//dashboard
	app.get("/api/dashboard/powerinfo/", global.auth.auth, dashboard.powerinfo);
	app.get("/api/dashboard/powerinfo_monthly/", global.auth.auth, dashboard.powerinfo_monthly);
	app.get("/api/dashboard/powerconsumption/", global.auth.auth, dashboard.power_consumption);
	app.get("/api/dashboard/powerinfo_daily/:type/:month/:year", global.auth.auth, dashboard.powerinfo_daily);
	app.get("/api/dashboard/powerinfo_yearly/:type/:year", global.auth.auth, dashboard.powerinfo_yearly);
	app.get("/api/dashboard/harmonicsinfo/:month/:year", global.auth.auth, dashboard.harmonics);
}