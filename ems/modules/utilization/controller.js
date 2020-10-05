

const app = angular.module('app', []);

//main controller

app.controller('main_ctrl', ['$scope', function($scope){



	///parameters
	$scope.m_id = get_params('meter_id');
	$scope.title = `Meters Utilization Page`;
	let user_info = JSON.parse(localStorage.getItem('user_cred'));
	$scope.name = user_info['user_name'];
	

	//urls
	$scope.live_url = `/live?meter_id=${$scope.m_id}`;
	$scope.historical_url = `/historical?meter_id=${$scope.m_id}`;
	$scope.analysis_url = `/analysis?meter_id=${$scope.m_id}`;
	$scope.utilization_url = `/utilization`;

	//delay
	const error_delay = 15000;

	//fetch meter list
	$scope.meter_list = [];
	$scope.getmetelist = ()=>{
		let url = `${api_url('meter/meter_onlylist')}`;
		get(url, false)
		.then((data)=>{
				$scope.meter_list = data;
				if($scope.m_id == undefined){
					if(data.length>0)
						$scope.m_id = $scope.meter_list[0].M_ID;
					else
						$scope.m_id = 'null';
				$scope.live_url = `/live?meter_id=${$scope.m_id}`;
				$scope.historical_url = `/historical?meter_id=${$scope.m_id}`;
				$scope.analysis_url = `/analysis?meter_id=${$scope.m_id}`;
				$scope.utilization_url = `/utilization`;
				$scope.$apply();
			}
		})
		.catch((err)=>{
			s_alert('error', 'error', 'Unable to Fetch Meter list \n Please refresh again');
		})
	}

	$scope.getmetelist();


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
	$scope.total_machine = 0;
	$scope.second_row_c3_delay = 3000;
	$scope.second_row.c3_load = false;
	$scope.second_row.c3_no_data = false;
	//second row chart1 data
	$scope.second_row_c1 = ()=>{
		let url = `${api_url('utilization/status/')}`;
		get(url, false)
		.then((data)=>{
			if(data.FULL_LOAD==0 && data.NO_LOAD == 0 &&  data.OFF_LOAD ==0 ){
				$scope.second_row.c1_no_data  = true;
			}else{
				$scope.second_row.c1_no_data  = false;
			}
			let kwh = [data.FULL_LOAD, data.NO_LOAD, data.OFF_LOAD];
			$scope.total_machine = data.FULL_LOAD+ data.NO_LOAD+ data.OFF_LOAD;
			s_c1.data.datasets[0].data = kwh;
			s_c1.data.labels = ['FULL LOAD', 'NO LOAD', 'OFF LOAD'];
			s_c1.update();
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


	//second row chart2 data
	$scope.second_row_c2 = ()=>{
		let url = `${api_url('utilization/loadinfo')}`;
		get(url, false)
		.then((data)=>{
			if(data[0].length == 0){
				$scope.second_row.c2_no_data  = true;
			}else{
				$scope.second_row.c2_no_data  = false;
			}
			let date = moment(new Date());
			let s = date.subtract(7, 'day').format('ll 00:00');
			let l = moment(new Date()).format('ll HH:mm');
			let l1 = new Array();
			let l2 = new Array();
			let l3 = new Array();
			let label = new Array();
			let index = 0;
			let i1 = 0;
			let i2 = 0;
			let i3 = 0;
			for(let i = 0; i<data[0].length; i++){
				let m_id = data[0][i].M_ID;
				label.push(data[0][i].M_NAME)
				let f = 0;
				for(let j=0; j<data[1].length; j++){
					if(data[1][j] != undefined && m_id == data[1][j].M){
						l1.push(data[1][j].FULL_LOAD_HOUR);
						f = 1;
						break;
					}
					
				}
				if(f == 0)
					l1.push(0);
				f = 0;
				for(let j=0; j<data[2].length; j++){
					if(data[2][j] != undefined && m_id == data[2][j].M){
						l2.push(data[2][j].NO_LOAD_HOUR);
						f = 1;
						break;
					}
					
				}
				if(f == 0)
					l2.push(0);
				f = 0;
				for(let j=0; j<data[3].length; j++){
					if(data[3][j] != undefined && m_id == data[3][j].M){
						l3.push(data[3][j].OFF_LOAD_HOUR);
						f = 1;
						break;
					}
					
				}
				if(f == 0)
					l3.push(0);

			}

			let full_load = new Array();
			for(let i = 0; i<l1.length; i++){
				let per = ((l1[i]/(l1[i]+l2[i]+l3[i]))*100).toFixed(2);
				full_load.push(per);
			}
			let full_load_color = new Array();
			for(let i = 0 ;i <full_load.length; i++){
				if (i-1 >=0 && full_load[i]>=full_load[i-1]){
					full_load_color.push('#99ffbb');
				}else if (i-1 >=0 && full_load[i]<full_load[i-1]){
					full_load_color.push('#ff4d4d');
				}else if(i == 0){
					if(full_load[i] <=0)
						full_load_color.push('#ff4d4d');
					else
						full_load_color.push('#99ffbb');
				}
				
			}
			s_c2.data.datasets[0].data = l1;
			s_c2.data.datasets[1].data = l2;
			s_c2.data.datasets[2].data = l3;
			s_c2.data.labels = label;
			s_c2.options.scales.xAxes[0].scaleLabel.labelString = `${s} to ${l}`;
			s_c2.update();
			t_c2.data.datasets[0].data = full_load;
			t_c2.data.labels = label;
			t_c2.data.datasets[0].backgroundColor = full_load_color;
			t_c2.options.scales.xAxes[0].scaleLabel.labelString = `${s} to ${l}`;
			t_c2.update();
			$scope.second_row.c2_load = false;
			$scope.$apply();
			setTimeout(()=>{$scope.second_row_c2()}, $scope.second_row_c2_delay);
		})
		.catch((err)=>{
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.second_row_c2()}, error_delay);
		});
	}

	$scope.second_row_c2();

	//second row chart3 data
	$scope.second_row_c3 = ()=>{
		let url = `${api_url('utilization/powerinfo')}`;
		get(url, false)
		.then((data)=>{
			if(data[0].length == 0 && data[1].length == 0){
				$scope.second_row.c3_no_data  = true;
			}else{
				$scope.second_row.c3_no_data  = false;
			}
			let date = moment(new Date());
			let kwh = data[0].map((data)=>{
				return data.KWH;
			});
			let w_sum = data[1].map((data)=>{
				return data.W_sum;
			});
			let label_kwh = data[0].map((data)=>{
				return data.M_NAME;
			})
			let label_wsum = data[1].map((data)=>{
				return data.M_NAME;
			});
			let kwh_color = new Array();
			let wsum_color = new Array();
			for(let i = 0 ;i <data[0].length; i++){
				if (i-1 >=0 && data[0][i].KWH>=data[0][i-1].KWH){
					kwh_color.push('#99ffbb');
				}else if (i-1 >=0 && data[0][i].KWH<data[0][i-1].KWH){
					kwh_color.push('#ff4d4d');
				}else if(i == 0){
					if(data[0][i].KWH <=0)
						kwh_color.push('#ff4d4d');
					else
						kwh_color.push('#99ffbb');
				}
				
			}
			for(let i = 0 ;i <data[1].length; i++){
				if (i-1 >=0 && data[1][i].W_sum>=data[1][i-1].W_sum){
					wsum_color.push('#99ffbb');
				}else if (i-1 >=0 && data[1][i].W_sum<data[1][i-1].W_sum){
					wsum_color.push('#ff4d4d');
				}else if(i == 0){
					if(data[1][i].W_sum <=0)
						wsum_color.push('#ff4d4d');
					else
						wsum_color.push('#99ffbb');
				}
				
			}
			s_c3.data.datasets[0].data = kwh;
			s_c3.data.labels = label_kwh;
			s_c3.options.scales.xAxes[0].scaleLabel.labelString = `${date.format('ll')}`
			s_c3.data.datasets[0].backgroundColor = kwh_color;
			s_c3.update();
			t_c1.data.datasets[0].data = w_sum;
			t_c1.data.labels = label_wsum;
			t_c1.data.datasets[0].backgroundColor = wsum_color;
			t_c1.options.scales.xAxes[0].scaleLabel.labelString = `${date.format('ll')}`
			t_c1.update();
			$scope.second_row.c3_load = false;
			$scope.$apply();
			setTimeout(()=>{$scope.second_row_c3()}, $scope.second_row_c3_delay);
		})
		.catch((err)=>{
			s_alert('error', 'error', 'Internal Error Server stop working\n will be auto connect after 15s');
			setTimeout(()=>{$scope.second_row_c3()}, error_delay);
		});
	}

	$scope.second_row_c3();




	//reset grpah zooms

	$scope.reset_s_c1 = ()=>{
		s_c1.resetZoom();
	}
	$scope.reset_s_c2 = ()=>{
		s_c2.resetZoom();
	}
	$scope.reset_s_c3 = ()=>{
		s_c2.resetZoom();
	}
	$scope.reset_t_c1 = ()=>{
		t_c1.resetZoom();
	}
	$scope.reset_t_c2 = ()=>{
		t_c2.resetZoom();
	}


}]);