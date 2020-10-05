

const app = angular.module('app', []);

//main controller

app.controller('main_ctrl', ['$scope', function($scope){

	///parameters
	$scope.m_id = get_params('meter_id');
	$scope.title = `${$scope.m_id} Historical Page`;
	let user_info = JSON.parse(localStorage.getItem('user_cred'));
	$scope.name = user_info['user_name'];

	//urls
	$scope.live_url = `/live?meter_id=${$scope.m_id}`;
	$scope.historical_url = `/historical?meter_id=${$scope.m_id}`;
	$scope.analysis_url = `/analysis?meter_id=${$scope.m_id}`;
	$scope.utilization_url = `/utilization?meter_id=${$scope.m_id}`;
	//fetch meter list
	$scope.meter_list = [];
	$scope.getmetelist = ()=>{
		let url = `${api_url('meter/meter_onlylist')}`;
		get(url, false)
		.then((data)=>{
			$scope.meter_list = data;
		})
		.catch((err)=>{
			s_alert('error', 'error', 'Unable to Fetch Meter list \n Please refresh again');
		})
	}

	$scope.getmetelist();

	//delay
	const error_delay = 15000;
	//month array
	$scope.month = {
		1:'Jan',
		2:'Feb',
		3:'Mar',
		4:'Apr',
		5:'May',
		6:'Jun',
		7:'Jul',
		8:'Aug',
		9:'Sept',
		10:'Oct',
		11:'Nov',
		12:'Dec'
	};

	//get year list upto 10;
	$scope.years = new Array();
	let start_year = 2020;
	for(let i = 0; i<=30; i++)
		$scope.years.push(start_year+i);

	$scope.caltype = {
		Avg:'average',
		Mode:'mode',
		Mid:'median'
	}

	//first row params
	$scope.first_row = {};

	//second row params
	$scope.second_row = {};
	$scope.second_row.chart1_timestep = new Date().getMonth()+1;
	$scope.second_row.c1_load = false;
	$scope.second_row_c1_delay = 3000;
	$scope.second_row.c1_no_data = false;
	$scope.second_row.chart2_timestep = new Date().getFullYear();
	$scope.second_row.c2_load = false;
	$scope.second_row_c2_delay = 3000;
	$scope.second_row.c2_no_data = false;

	//third row params
	$scope.third_row = {};
	$scope.third_row.chart1_timestep = 5;
	$scope.third_row.chart2_timestep = 5;
	$scope.third_row.c1_load = false;
	$scope.third_row.c1_load = false;
	$scope.third_row_c2_delay = 3000;
	$scope.third_row_c1_delay = 3000;
	$scope.third_row.c1_no_data = false;
	$scope.third_row.c2_no_data = false;
	$scope.third_row.c1_caltype = 'Avg';
	$scope.third_row.c1_month = new Date().getMonth()+1;
	$scope.third_row.c1_timestep = 30;
	$scope.third_row.c2_caltype = 'Avg';
	$scope.third_row.c2_month = new Date().getMonth()+1;
	$scope.third_row.c2_timestep = 30;
	//fourth row params
	$scope.fourth_row = {};
	$scope.fourth_row.chart1_timestep = 5;
	$scope.fourth_row.chart2_timestep = 5;
	$scope.fourth_row.c1_load = false;
	$scope.fourth_row.c1_load = false;
	$scope.fourth_row_c2_delay = 3000;
	$scope.fourth_row_c1_delay = 3000;
	$scope.fourth_row.c1_no_data = false;
	$scope.fourth_row.c2_no_data = false;
	$scope.fourth_row.c1_caltype = 'Avg';
	$scope.fourth_row.c1_month = new Date().getMonth()+1;
	$scope.fourth_row.c1_timestep = 30;
	$scope.fourth_row.c2_caltype = 'Avg';
	$scope.fourth_row.c2_month = new Date().getMonth()+1;
	$scope.fourth_row.c2_timestep = 30;
	//delay params
	const energyinfo_delay = 3000;

	//energyinfo function
	$scope.energyinfo = ()=>{
		let url = api_url(`live/energyinfo/${$scope.m_id}`);
		get(url, false).
		then((data)=>{
			if(data[0][0] == undefined)
				$scope.first_row.today_power = 'Nan';
			else
				$scope.first_row.today_power = data[0][0].TODAY_POWER;
			$scope.first_row.daily_avg = data[1][0].DAILY_AVG==undefined?"Nan":data[1][0].DAILY_AVG;
			$scope.first_row.monthly_avg = data[2][0].MONTHLY_AVG==undefined?"Nan":data[2][0].MONTHLY_AVG;
			$scope.first_row.total_monthly_consumption = data[3][0].TOTAL_MONTHLY_CONSUMPTION==undefined?"Nan":data[3][0].TOTAL_MONTHLY_CONSUMPTION;
			$scope.first_row.power_factor = data[4][0].PF == undefined?"Nan":data[4][0].PF;
			$scope.$apply();
			setTimeout(()=>{$scope.energyinfo()}, energyinfo_delay);
		})
		.catch((err)=>{
			id_missing($scope.m_id);
			handel_430(err)
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.energyinfo()}, error_delay);
		})
	}

	//call energyinfo
	$scope.energyinfo();


	///second row

	//change time step of chart1
	$scope.c1_timestep = (data)=>{
		$scope.second_row.chart1_timestep = data+1//month[data];
		$scope.second_row.c1_load = true;

	}
	//change time step of chart1
	$scope.c2_timestep = (data)=>{
		$scope.second_row.chart2_timestep = data//month[data];
		$scope.second_row.c2_load = true;

	}

	//thrid row
	//change time step of chart1
	$scope.third_c1_setminute = (data)=>{
		$scope.third_row.c1_timestep = data;
		$scope.third_row.c1_load = true;
	}
	$scope.third_c1_setmonth = (data)=>{
		$scope.third_row.c1_month = data+1;
		$scope.third_row.c1_load = true;
	}
	$scope.third_c1_settype= (data)=>{
		$scope.third_row.c1_caltype = data;
		$scope.third_row.c1_load = true;
	}
	$scope.third_c2_setminute = (data)=>{
		$scope.third_row.c2_timestep = data;
		$scope.third_row.c2_load = true;
	}
	$scope.third_c2_setmonth = (data)=>{
		$scope.third_row.c2_month = data+1;
		$scope.third_row.c2_load = true;
	}
	$scope.third_c2_settype= (data)=>{
		$scope.third_row.c2_caltype = data;
		$scope.third_row.c2_load = true;
	}

	//fourth row
	//change time step of chart1
	$scope.fourth_c1_setminute = (data)=>{
		$scope.fourth_row.c1_timestep = data;
		$scope.fourth_row.c1_load = true;
	}
	$scope.fourth_c1_setmonth = (data)=>{
		$scope.fourth_row.c1_month = data+1;
		$scope.fourth_row.c1_load = true;
	}
	$scope.fourth_c1_settype= (data)=>{
		$scope.fourth_row.c1_caltype = data;
		$scope.fourth_row.c1_load = true;
	}
	$scope.fourth_c2_setminute = (data)=>{
		$scope.fourth_row.c2_timestep = data;
		$scope.fourth_row.c2_load = true;
	}
	$scope.fourth_c2_setmonth = (data)=>{
		$scope.fourth_row.c2_month = data+1;
		$scope.fourth_row.c2_load = true;
	}
	$scope.fourth_c2_settype= (data)=>{
		$scope.fourth_row.c2_caltype = data;
		$scope.fourth_row.c2_load = true;
	}

	//second row chart1 data
	$scope.second_row_c1 = ()=>{
		let url = `${api_url('historical/powerinfo')}/${$scope.m_id}/${$scope.second_row.chart1_timestep}`;
		get(url, false)
		.then((data)=>{
			let date = new Date();
			let start_date = new Date(date.getFullYear(), $scope.second_row.chart1_timestep-1, 1).getDate();
			let s = new Date(date.getFullYear(), $scope.second_row.chart1_timestep-1, 1).toDateString();
			let last_date = new Date();
			last_date.setFullYear(date.getFullYear());
			last_date.setMonth($scope.second_row.chart1_timestep-1);
			if(date.getMonth() != $scope.second_row.chart1_timestep-1){
				last_date.setMonth($scope.second_row.chart1_timestep);
				last_date.setDate(0);	
			}
			let l = last_date.toDateString();
			last_date = last_date.getDate();
			if(data.length >0){
				$scope.second_row.c1_no_data = false;
			}else{
				$scope.second_row.c1_no_data = true;
			}
			let kwh = new Array();
			let label = new Array();
			let color = new Array();
			let index = 0;
			for(let i = start_date ;i <=last_date; i++){
				if(data[index] != undefined && data[index].DAY == i){
					kwh.push(data[index].KWH);
					label.push(data[index].DAY);
					if (index-1 >=0 && data[index].KWH>=data[index-1].KWH){
						color.push('#99ffbb');
					}else if (index-1 >=0 && data[index].KWH<data[index-1].KWH){
						color.push('#ff4d4d');
					}else if(index == 0){
						if(data[index].KWH <=0)
							color.push('#ff4d4d');
						else
							color.push('#99ffbb');

					}
					index += 1;
				}else{
					kwh.push(NaN);
					label.push(i);
					color.push('#ff4d4d')
				}
			}
			s_c1.data.datasets[0].data = kwh;
			s_c1.data.labels = label;
			s_c1.data.datasets[0].backgroundColor = color;
			s_c1.options.scales.xAxes[0].scaleLabel.labelString = `${s} to ${l}`
			s_c1.update();
			$scope.second_row.c1_load = false;
			$scope.$apply();
			setTimeout(()=>{$scope.second_row_c1()}, $scope.second_row_c1_delay);
		})
		.catch((err)=>{
			id_missing($scope.m_id);
			handel_430(err)
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.second_row_c1()}, error_delay);
		})	
	}

	$scope.second_row_c1();

	//second row chart2 data
	$scope.second_row_c2 = ()=>{
		let url = `${api_url('historical/powerinfo_yearly')}/${$scope.m_id}/${$scope.second_row.chart2_timestep}`;
		get(url, false)
		.then((data)=>{
			let date = new Date();
			let start_month = 1;
			let end_month = 12;
			if(date.getFullYear() == $scope.second_row.chart2_timestep){
				end_month = date.getMonth()+1
			}

			if(data.length >0){
				$scope.second_row.c2_no_data = false;
			}else{
				$scope.second_row.c2_no_data = true;
			}
			let kwh = new Array();
			let label = new Array();
			let color = new Array();
			let index = 0;
			for(let i = start_month ;i <=end_month; i++){
				if(data[index] != undefined && data[index].MONTH == i){
					kwh.push(data[index].KWH);
					label.push(data[index].MONTH);
					if (index-1 >=0 && data[index].KWH>=data[index-1].KWH){
						color.push('#99ffbb');
					}else if (index-1 >=0 && data[index].KWH<data[index-1].KWH){
						color.push('#ff4d4d');
					}else if(index == 0){
						if(data[index].KWH <=0)
							color.push('#ff4d4d');
						else
							color.push('#99ffbb');

					}
					index += 1;
				}else{
					kwh.push(NaN);
					label.push(i);
					color.push('#ff4d4d')
				}
			}
			s_c2.data.datasets[0].data = kwh;
			s_c2.data.labels = label;
			s_c2.data.datasets[0].backgroundColor = color;
			s_c2.options.scales.xAxes[0].scaleLabel.labelString = `${$scope.month[start_month]}, ${$scope.second_row.chart2_timestep} to ${$scope.month[end_month]}, ${$scope.second_row.chart2_timestep}`;
			s_c2.update();
			$scope.second_row.c2_load = false;
			$scope.$apply();
			setTimeout(()=>{$scope.second_row_c2()}, $scope.second_row_c2_delay);
		})
		.catch((err)=>{
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.second_row_c2()}, error_delay);
		})	
	}

	$scope.second_row_c2();

	//third row chart1 data
	$scope.third_row_c1 = ()=>{
		let url = `${api_url('historical/phaseinfo')}/${$scope.m_id}/${$scope.third_row.c1_month}/${$scope.third_row.c1_timestep}/${$scope.caltype[$scope.third_row.c1_caltype]}`;
		get(url, false)
		.then((data)=>{
			let date = new Date();
			let s = new Date(date.getFullYear(), $scope.third_row.c1_month-1, 1).toDateString();
			let last_date = new Date();
			last_date.setFullYear(date.getFullYear());
			last_date.setMonth($scope.third_row.c1_month-1);
			if(date.getMonth() != $scope.third_row.c1_month-1){
				last_date.setMonth($scope.third_row.c1_month);
				last_date.setDate(0);	
			}
			let l = last_date.toDateString();
			if(data[0].length>0 && data[1].length>0 && data[2].length>0)
				$scope.third_row.c1_no_data = false;
			else
				$scope.third_row.c1_no_data = true;
			let v1 = data[0].map((data)=>{
				return data.V1;
			});
			let v2 = data[1].map((data)=>{
				return data.V2;
			});
			let v3 = data[2].map((data)=>{
				return data.V3;
			});
			let label = data[0].map((data)=>{
				return data.TIME;
			});
			t_c1.data.datasets[0].data = v1;
			t_c1.data.datasets[1].data = v2;
			t_c1.data.datasets[2].data = v3;
			t_c1.data.labels = label;
			t_c1.options.scales.xAxes[0].scaleLabel.labelString = `${s} to ${l}`
			t_c1.update();

			$scope.third_row.c1_load = false;
			
			$scope.$apply();
			setTimeout(()=>{$scope.third_row_c1()}, $scope.third_row_c1_delay);
		})
		.catch((err)=>{
			id_missing($scope.m_id);
			handel_430(err)
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.third_row_c1()}, error_delay);
		})
		
	}

	$scope.third_row_c1();

	//third row chart1 data
	$scope.third_row_c2 = ()=>{
		let url = `${api_url('historical/voltagelineinfo')}/${$scope.m_id}/${$scope.third_row.c2_month}/${$scope.third_row.c2_timestep}/${$scope.caltype[$scope.third_row.c2_caltype]}`;
		get(url, false)
		.then((data)=>{
			let date = new Date();
			let s = new Date(date.getFullYear(), $scope.third_row.c2_month-1, 1).toDateString();
			let last_date = new Date();
			last_date.setFullYear(date.getFullYear());
			last_date.setMonth($scope.third_row.c2_month-1);
			if(date.getMonth() != $scope.third_row.c2_month-1){
				last_date.setMonth($scope.third_row.c2_month);
				last_date.setDate(0);	
			}
			let l = last_date.toDateString();
			if(data[0].length>0 && data[1].length>0 && data[2].length>0)
				$scope.third_row.c2_no_data = false;
			else
				$scope.third_row.c2_no_data = true;
			let l1 = data[0].map((data)=>{
				return data.VL_12;
			});
			let l2 = data[1].map((data)=>{
				return data.VL_23;
			});
			let l3 = data[2].map((data)=>{
				return data.VL_31;
			});
			let label = data[0].map((data)=>{
				return data.TIME;
			});
			t_c2.data.datasets[0].data = l1;
			t_c2.data.datasets[1].data = l2;
			t_c2.data.datasets[2].data = l3;
			t_c2.data.labels = label;
			t_c2.options.scales.xAxes[0].scaleLabel.labelString = `${s} to ${l}`
			t_c2.update();
			$scope.third_row.c2_load = false;
			$scope.$apply();
			setTimeout(()=>{$scope.third_row_c2()}, $scope.third_row_c2_delay);
		})
		.catch((err)=>{
			id_missing($scope.m_id);
			handel_430(err)
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.third_row_c2()}, error_delay);
		})
	}

	$scope.third_row_c2();

	//fourth row chart1 data
	$scope.fourth_row_c1 = ()=>{
		let url = `${api_url('historical/currentinfo')}/${$scope.m_id}/${$scope.fourth_row.c1_month}/${$scope.fourth_row.c1_timestep}/${$scope.caltype[$scope.fourth_row.c1_caltype]}`;
		get(url, false)
		.then((data)=>{
			let date = new Date();
			let s = new Date(date.getFullYear(), $scope.fourth_row.c1_month-1, 1).toDateString();
			let last_date = new Date();
			last_date.setFullYear(date.getFullYear());
			last_date.setMonth($scope.fourth_row.c1_month-1);
			if(date.getMonth() != $scope.fourth_row.c1_month-1){
				last_date.setMonth($scope.fourth_row.c1_month);
				last_date.setDate(0);	
			}
			let l = last_date.toDateString();
			if(data[0].length>0 && data[1].length>0 && data[2].length>0)
				$scope.fourth_row.c1_no_data = false;
			else
				$scope.fourth_row.c1_no_data = true;
			let l1 = data[0].map((data)=>{
				return data.I1;
			});
			let l2 = data[1].map((data)=>{
				return data.I2;
			});
			let l3 = data[2].map((data)=>{
				return data.I3;
			});
			let label = data[0].map((data)=>{
				return data.TIME;
			});
			f_c1.data.datasets[0].data = l1;
			f_c1.data.datasets[1].data = l2;
			f_c1.data.datasets[2].data = l3;
			f_c1.data.labels = label;
			f_c1.options.scales.xAxes[0].scaleLabel.labelString = `${s} to ${l}`
			f_c1.update();
			$scope.fourth_row.c1_load = false;
			$scope.$apply();
			setTimeout(()=>{$scope.fourth_row_c1()}, $scope.fourth_row_c1_delay);
		})
		.catch((err)=>{
			id_missing($scope.m_id);
			handel_430(err)
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.fourth_row_c1()}, error_delay);
		})
		
	}

	$scope.fourth_row_c1();

	//fourth row chart1 data
	$scope.fourth_row_c2 = ()=>{
		let url = `${api_url('historical/harmonicsinfo')}/${$scope.m_id}/${$scope.fourth_row.c2_month}/${$scope.fourth_row.c2_timestep}/${$scope.caltype[$scope.fourth_row.c2_caltype]}`;
		get(url, false)
		.then((data)=>{
			let date = new Date();
			let s = new Date(date.getFullYear(), $scope.fourth_row.c2_month-1, 1).toDateString();
			let last_date = new Date();
			last_date.setFullYear(date.getFullYear());
			last_date.setMonth($scope.fourth_row.c2_month-1);
			if(date.getMonth() != $scope.fourth_row.c2_month-1){
				last_date.setMonth($scope.fourth_row.c2_month);
				last_date.setDate(0);	
			}
			let l = last_date.toDateString();
			if(data[0].length>0 && data[1].length>0 && data[2].length>0)
				$scope.fourth_row.c2_no_data = false;
			else
				$scope.fourth_row.c2_no_data = true;
			let l1 = data[0].map((data)=>{
				return data.I_THD;
			});
			let l2 = data[1].map((data)=>{
				return data.V_THD;
			});
			let label = data[0].map((data)=>{
				return data.TIME;
			});
			f_c2.data.datasets[0].data = l1;
			f_c2.data.datasets[1].data = l2;
			f_c2.data.labels = label;
			f_c2.options.scales.xAxes[0].scaleLabel.labelString = `${s} to ${l}`
			f_c2.update();
			$scope.fourth_row.c2_load = false;
			$scope.$apply();
			setTimeout(()=>{$scope.fourth_row_c2()}, $scope.fourth_row_c2_delay);
		})
		.catch((err)=>{
			id_missing($scope.m_id);
			handel_430(err);
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.fourth_row_c2()}, error_delay);
		})
	}

	$scope.fourth_row_c2();


	//reset grpah zooms

	$scope.reset_s_c1 = ()=>{
		s_c1.resetZoom();
	}
	$scope.reset_s_c2 = ()=>{
		s_c2.resetZoom();
	}
	$scope.reset_t_c1 = ()=>{
		t_c1.resetZoom();
	}
	$scope.reset_t_c2 = ()=>{
		t_c2.resetZoom();
	}
	$scope.reset_f_c1 = ()=>{
		f_c1.resetZoom();
	}
	$scope.reset_f_c2 = ()=>{
		f_c2.resetZoom();
	}


}]);