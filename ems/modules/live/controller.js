

const app = angular.module('app', []);

//main controller

app.controller('main_ctrl', ['$scope', function($scope){

	///parameters
	$scope.m_id = get_params('meter_id');
	$scope.title = `${$scope.m_id} Live Page`;
	let user_info = JSON.parse(localStorage.getItem('user_cred'));
	$scope.name = user_info['user_name'];

	//urls
	$scope.live_url = `/live?meter_id=${$scope.m_id}`;
	$scope.historical_url = `/historical?meter_id=${$scope.m_id}`;
	$scope.analysis_url = `/analysis?meter_id=${$scope.m_id}`;
	$scope.utilization_url = `/utilization?meter_id=${$scope.m_id}`;

	//delay
	const error_delay = 15000;

	//first row params
	$scope.first_row = {};

	//second row params
	$scope.second_row = {};
	$scope.second_row.chart1_timestep = 5;
	$scope.second_row.c1_load = false;
	$scope.second_row_c1_delay = 3000;
	$scope.second_row.c1_no_data = false;

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

	//delay params
	const energyinfo_delay = 10000;

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
			$scope.second_row.natural_current = data[5][0].I_N == undefined?"Nan":data[5][0].I_N;
			$scope.second_row.f = data[5][0].Frequency == undefined?"Nan":data[5][0].Frequency;
			s_c2.data.datasets[0].data[0] = $scope.second_row.natural_current;
			s_c2.data.datasets[0].data[1] = 100-$scope.second_row.natural_current;
			s_c3.data.datasets[0].data[0] = $scope.second_row.f;
			s_c3.data.datasets[0].data[1] = 100-$scope.second_row.f;
			s_c2.update();
			s_c3.update();
			$scope.$apply();
			setTimeout(()=>{$scope.energyinfo()}, energyinfo_delay);
		})
		.catch((err)=>{
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.energyinfo()}, error_delay);
		})
	}

	//call energyinfo
	$scope.energyinfo();


	///second row

	//change time step of chart1
	$scope.c1_timestep = (data)=>{
		$scope.second_row.chart1_timestep = data;
		$scope.second_row.c1_load = true;

	}

	//thrid row
	//change time step of chart1
	$scope.third_c1_timestep = (data)=>{
		$scope.third_row.chart1_timestep = data;
		$scope.third_row.c1_load = true;
	}
	$scope.third_c2_timestep = (data)=>{
		$scope.third_row.chart2_timestep = data;
		$scope.third_row.c2_load = true;
	}

	//fourth row
	//change time step of chart1
	$scope.fourth_c1_timestep = (data)=>{
		$scope.fourth_row.chart1_timestep = data;
		$scope.fourth_row.c1_load = true;
	}
	$scope.fourth_c2_timestep = (data)=>{
		$scope.fourth_row.chart2_timestep = data;
		$scope.fourth_row.c2_load = true;
	}


	//second row chart1 data
	$scope.second_row_c1 = ()=>{
		let url = `${api_url('live/powerinfo')}/${$scope.m_id}/${$scope.second_row.chart1_timestep}`;
		get(url, false)
		.then((data)=>{
			if(data.length>1){
				$scope.second_row.c1_no_data = false;
			}else{
				$scope.second_row.c1_no_data = true;
			}
			let active = data.map(function(data){
					return data.W_sum;
				});
				let reactive = data.map(function(data){
					return data.VA_sum;
				});
				let apparent = data.map(function(data){
					return data.VAR_sum;
				});
				let label = data.map(function(data){
					return data.TIME;
				});
				s_c1.data.datasets[0].data = active;
				s_c1.data.datasets[1].data = reactive;
				s_c1.data.datasets[2].data = apparent;
				s_c1.data.labels = label;
				s_c1.update();
				//s_c1.resetZoom();
			$scope.second_row.c1_load = false;
			$scope.$apply();
			setTimeout(()=>{$scope.second_row_c1()}, $scope.second_row_c1_delay);
		})
		.catch((err)=>{
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.second_row_c1()}, error_delay);
		})	
	}

	$scope.second_row_c1();

	//third row chart1 data
	$scope.third_row_c1 = ()=>{
		let url = `${api_url('live/voltageinfo')}/${$scope.m_id}/${$scope.third_row.chart1_timestep}`;
		get(url, false)
		.then((data)=>{
			if(data.length>1)
				$scope.third_row.c1_no_data = false;
			else
				$scope.third_row.c1_no_data = true;
			let v1 = data.map((data)=>{
				return data.V1;
			});
			let v2 = data.map((data)=>{
				return data.V2;
			});
			let v3 = data.map((data)=>{
				return data.V3;
			});
			let label = data.map((data)=>{
				return data.TIME;
			});
			t_c1.data.datasets[0].data = v1;
			t_c1.data.datasets[1].data = v2;
			t_c1.data.datasets[2].data = v3;
			t_c1.data.labels = label;

			t_c1.update();

			$scope.third_row.c1_load = false;
			$scope.$apply();
			setTimeout(()=>{$scope.third_row_c1()}, $scope.third_row_c1_delay);
		})
		.catch((err)=>{
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.third_row_c1()}, error_delay);
		})
		
	}

	$scope.third_row_c1();

	//third row chart1 data
	$scope.third_row_c2 = ()=>{
		let url = `${api_url('live/voltagelineinfo')}/${$scope.m_id}/${$scope.third_row.chart2_timestep}`;
		get(url, false)
		.then((data)=>{
			if(data.length>1)
				$scope.third_row.c2_no_data = false;
			else
				$scope.third_row.c2_no_data = true;
			let l1 = data.map((data)=>{
				return data.VL_12;
			});
			let l2 = data.map((data)=>{
				return data.VL_23;
			});
			let l3 = data.map((data)=>{
				return data.VL_31;
			});
			let label = data.map((data)=>{
				return data.TIME;
			});
			t_c2.data.datasets[0].data = l1;
			t_c2.data.datasets[1].data = l2;
			t_c2.data.datasets[2].data = l3;
			t_c2.data.labels = label;
			t_c2.update();
			$scope.third_row.c2_load = false;
			$scope.$apply();
			setTimeout(()=>{$scope.third_row_c2()}, $scope.third_row_c2_delay);
		})
		.catch((err)=>{
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.third_row_c2()}, error_delay);
		})
	}

	$scope.third_row_c2();

	//fourth row chart1 data
	$scope.fourth_row_c1 = ()=>{
		let url = `${api_url('live/currentinfo')}/${$scope.m_id}/${$scope.fourth_row.chart1_timestep}`;
		get(url, false)
		.then((data)=>{
			if(data.length>1)
				$scope.fourth_row.c1_no_data = false;
			else
				$scope.fourth_row.c1_no_data = true;
			let l1 = data.map((data)=>{
				return data.I1;
			});
			let l2 = data.map((data)=>{
				return data.I2;
			});
			let l3 = data.map((data)=>{
				return data.I3;
			});
			let label = data.map((data)=>{
				return data.TIME;
			});
			f_c1.data.datasets[0].data = l1;
			f_c1.data.datasets[1].data = l2;
			f_c1.data.datasets[2].data = l3;
			f_c1.data.labels = label;
			f_c1.update();
			$scope.fourth_row.c1_load = false;
			$scope.$apply();
			setTimeout(()=>{$scope.fourth_row_c1()}, $scope.fourth_row_c1_delay);
		})
		.catch((err)=>{
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.fourth_row_c1()}, error_delay);
		})
		
	}

	$scope.fourth_row_c1();

	//fourth row chart1 data
	$scope.fourth_row_c2 = ()=>{
		let url = `${api_url('live/harmonicsinfo')}/${$scope.m_id}/${$scope.fourth_row.chart2_timestep}`;
		get(url, false)
		.then((data)=>{
			if(data.length>1)
				$scope.fourth_row.c2_no_data = false;
			else
				$scope.fourth_row.c2_no_data = true;
			let l1 = data.map((data)=>{
				return data.I_THD;
			});
			let l2 = data.map((data)=>{
				return data.V_THD;
			});
			let label = data.map((data)=>{
				return data.TIME;
			});
			f_c2.data.datasets[0].data = l1;
			f_c2.data.datasets[1].data = l2;
			f_c2.data.labels = label;
			f_c2.update();
			$scope.fourth_row.c2_load = false;
			$scope.$apply();
			setTimeout(()=>{$scope.fourth_row_c2()}, $scope.fourth_row_c2_delay);
		})
		.catch((err)=>{
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.fourth_row_c2()}, error_delay);
		})
	}

	$scope.fourth_row_c2();


	//reset grpah zooms

	$scope.reset_s_c1 = ()=>{
		s_c1.resetZoom();
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