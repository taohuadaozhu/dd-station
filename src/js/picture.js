var ajaxIp = httpUrl.head;
var floorList = []
var stationList = []
var myDate = new Date();
var myDateFormat =myDate.getFullYear() + '-' + dateFormat((Number(myDate.getMonth()) + 1)) + '-' + dateFormat(myDate.getDate());
;
(function () {
	var addressData = JSON.parse(localStorage.addressData);
	$("#company").html(addressData.name);
	$("#address").html(addressData.address);
	var Page = {
		init: function () {

			var that = this;
			//防止300毫秒点击延迟
			FastClick.attach(document.body);
			//绑定事件
			this.bind();
			//绑定左上角返回事件
			this.setLeft();
			//初始化导航的title,采用事件的方式实现解耦
			$('body').trigger('navigation.title.change', [{
				"title": "预约工位"
			}]);
			//图上的座位点击
			$(".img-stations").on('click', function (event) {
				// console.log($(event.target).attr('id'));
				if ($(event.target).attr('name') === 'station') {
					// alert($(event.target).attr('status'))
					if( $(event.target).attr('status') === '1'){
						$(".img-stations div").removeClass('station-active')
						$(event.target).addClass('station-active');
						$('.select-station .select').html($(event.target).attr('number'))
						$("#taskStation").val($(event.target).attr('id'))
					}else if( $(event.target).attr('status') === '2'){
						console.log($(event.target))
						var msg = $(event.target).attr('username')+'于'+$(event.target).attr('userstart')+'到'+$(event.target).attr('userend')+'预约了该工位'+',联系电话：'+$(event.target).attr('usermobile')+'。';
						dd.device.notification.alert({
							message: msg,
							title: "工位已被预约",//可传空
							buttonName: "收到",
							onSuccess : function() {
								//onSuccess将在点击button之后回调
								/*回调*/
							},
							onFail : function(err) {}
						});
					}
					
				}

			})
			$("#confirm").on('click', function (event) {
				var obj = {};
				obj.userId = '6b04c7d9-0586-434a-9867-794c86e64aa0';
				obj.startTime = $('#start-date').html();
				obj.endTime = $('#end-date').html();
				obj.stationId = $('#taskStation').val().replace('station', '');
				obj.stationNumber = $('.select-station .select').html();
				obj.floorId = '1';
				obj.floorNumber = $('.select-type .select').html();
				obj.company = $('#company').html();
				obj.address = $('#address').html();
				if (!obj.stationId) {
					dd.device.notification.toast({
						icon: 'error', //icon样式，有success和error，默认为空 0.0.2
						text: "请选择座位", //提示信息
						duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
						delay: 0, //延迟显示，单位秒，默认0
						onSuccess: function (result) {
							/*{}*/
						},
						onFail: function (err) {}
					});
					return;
				}
				if (!obj.startTime) {
					dd.device.notification.toast({
						icon: 'error', //icon样式，有success和error，默认为空 0.0.2
						text: "请选择开始时间", //提示信息
						duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
						delay: 0, //延迟显示，单位秒，默认0
						onSuccess: function (result) {
							/*{}*/
						},
						onFail: function (err) {}
					});
					return;
				}
				if (!obj.endTime) {
					dd.device.notification.toast({
						icon: 'error', //icon样式，有success和error，默认为空 0.0.2
						text: "请选择结束时间", //提示信息
						duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
						delay: 0, //延迟显示，单位秒，默认0
						onSuccess: function (result) {
							/*{}*/
						},
						onFail: function (err) {}
					});
					return;
				}
				// obj.level = $('#taskType').val();
				// if(!obj.level){
				// 	dd.device.notification.toast({
				// 		icon: 'error', //icon样式，有success和error，默认为空 0.0.2
				// 		text: "请选择优先级", //提示信息
				// 		duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
				// 		delay: 0, //延迟显示，单位秒，默认0
				// 		onSuccess : function(result) {
				// 			/*{}*/
				// 		},
				// 		onFail : function(err) {}
				// 	});
				// 	return;
				// }

				// var originDate = localStorage.getItem('taskData');
				// originDate = JSON.parse(originDate);
				// originDate.res.push(obj);
				// console.log(obj);
				localStorage.setItem('taskData', JSON.stringify(obj));


				window.location.href = 'http://10.1.20.59/confirm.html'
				// dd.biz.navigation.close();
				// dd.biz.util.openLink({
				// 	url: 'http://10.1.19.119/confirm.html'
				// });

			})
			//右上角变为提交
			$('body').trigger('navigation.rightButton.change', [{
				"text": "提交",
				"callback": function () {
					var obj = {};
					// obj.userId = '6b04c7d9-0586-434a-9867-794c86e64aa0';
					obj.startTime = $('#start-date').html();
					obj.endTime = $('#end-date').html();
					obj.stationId = $('#taskStation').val().replace('station', '');
					obj.stationNumber = $('.select-station .select').html();
					obj.floorId = '1';
					obj.floorNumber = $('.select-type .select').html();
					obj.company = $('#company').html();
					obj.address = $('#address').html();
					if (!obj.stationId) {
						dd.device.notification.toast({
							icon: 'error', //icon样式，有success和error，默认为空 0.0.2
							text: "请选择座位", //提示信息
							duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
							delay: 0, //延迟显示，单位秒，默认0
							onSuccess: function (result) {
								/*{}*/
							},
							onFail: function (err) {}
						});
						return;
					}
					if (!obj.startTime) {
						dd.device.notification.toast({
							icon: 'error', //icon样式，有success和error，默认为空 0.0.2
							text: "请选择开始时间", //提示信息
							duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
							delay: 0, //延迟显示，单位秒，默认0
							onSuccess: function (result) {
								/*{}*/
							},
							onFail: function (err) {}
						});
						return;
					}
					if (!obj.endTime) {
						dd.device.notification.toast({
							icon: 'error', //icon样式，有success和error，默认为空 0.0.2
							text: "请选择结束时间", //提示信息
							duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
							delay: 0, //延迟显示，单位秒，默认0
							onSuccess: function (result) {
								/*{}*/
							},
							onFail: function (err) {}
						});
						return;
					}
					if (new Date(obj.startTime).getTime() > new Date(obj.endTime).getTime()) {
						dd.device.notification.toast({
							icon: 'error', //icon样式，有success和error，默认为空 0.0.2
							text: "请重新选择时间", //提示信息
							duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
							delay: 0, //延迟显示，单位秒，默认0
							onSuccess: function (result) {
								/*{}*/
							},
							onFail: function (err) {}
						});
						return;
					}
					// obj.level = $('#taskType').val();
					// if(!obj.level){
					// 	dd.device.notification.toast({
					// 		icon: 'error', //icon样式，有success和error，默认为空 0.0.2
					// 		text: "请选择优先级", //提示信息
					// 		duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
					// 		delay: 0, //延迟显示，单位秒，默认0
					// 		onSuccess : function(result) {
					// 			/*{}*/
					// 		},
					// 		onFail : function(err) {}
					// 	});
					// 	return;
					// }

					// var originDate = localStorage.getItem('taskData');
					// originDate = JSON.parse(originDate);
					// originDate.res.push(obj);
					// alert(JSON.stringify(obj))
					localStorage.setItem('taskData', JSON.stringify(obj));
					// dd.biz.navigation.close();
					dd.biz.util.openLink({
						url: location.protocol + '//' + location.host + '/' + 'confirm.html'
					});
				}
			}]);
		},
		bind: function () {
			//采用事件监听的方式是为了能够在统一一个地方设置导航的Title
			$('body').on('navigation.title.change', function (e, res) {
				dd.biz.navigation.setTitle({
					title: res.title
				});
			});
			//采用事件监听的方式是为了能够在统一一个地方设置导航的右上角按钮文案及点击事件
			$('body').on('navigation.rightButton.change', function (e, res) {
				dd.biz.navigation.setRight({
					show: res.show, //控制按钮显示， true 显示， false 隐藏， 默认true
					control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
					showIcon: true, //是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
					text: res.text,
					onSuccess: function () {
						res.callback && res.callback();
					}
				});
			});
			$('#task-add .datepickerstart').on('click', function () {
				var node = $(this).find('.date');
				var v = node.html().trim();
				dd.biz.util.datepicker({
					format: 'yyyy-MM-dd',
					value: v, //默认显示日期
					start: myDateFormat,
					onSuccess: function (result) {
						var dateStart = result.value;
						myDateFormat = dateStart;
						var s1 = result.value;
						s1 = new Date(s1.replace(/-/g, "/"));
						var s2 = new Date(myDateFormat.replace(/-/g, "/"));
						
						var days = s1.getTime() - s2.getTime();
						
						var time = parseInt(days / (1000 * 60 * 60 * 24));
						// alert(time)
						if(time<0){
							dd.device.notification.alert({
								message: '开始时间不能小于今天。',
								title: "提示",//可传空
								buttonName: "收到",
								onSuccess : function() {
									//onSuccess将在点击button之后回调
									/*回调*/
								},
								onFail : function(err) {}
							});
						}else{
							var timeStart = '08:30';
							var twotime = true;
							var myDate = new Date();
							var da =myDate.getFullYear() + '-' + dateFormat((Number(myDate.getMonth()) + 1)) + '-' + dateFormat(myDate.getDate());
							//如果选取时间等于今天，则判断小时
							// alert(dateStart+da)
							if(dateStart==da){
								if (myDate.getHours() >= 7 && myDate.getHours() < 12) { //0-23 上午八点后只可以预约下午的
									twotime = false;
								}
							}
							
							dd.device.notification.confirm({
								message: "请选择具体开始时间：",
								title: "提示",
								buttonLabels:twotime?['08:30', '13:30']: [ '13:30'],
								onSuccess: function (result) {
									if(twotime){
										timeStart = result.buttonIndex == 0 ? '08:30' : '13:30';
									}else{
										timeStart ='13:30' 
									}
									
									node.html(dateStart + ' ' + timeStart);
									$('#end-date').html(dateStart + ' 18:00'),
										listFloorWorkStation();
								},
								onFail: function (err) {}
							});
						}
						

					},
					onFail: function () {}
				});
			});
			$('#task-add .datepickerend').on('click', function () {
				var node = $(this).find('.date');
				var v = node.html().trim();
				var mySevenDateFormat = getNextSevenDay(myDateFormat)
				dd.biz.util.datepicker({
					format: 'yyyy-MM-dd',
					value: v, //默认显示日期
					start: myDateFormat,
					end:mySevenDateFormat,
					onSuccess: function (result) {
						var dateStart = result.value;

						var s1 = result.value;
						s1 = new Date(s1.replace(/-/g, "/"));
						var s2 = new Date(myDateFormat.replace(/-/g, "/"));
						
						var days = s1.getTime() - s2.getTime();
						
						var time = parseInt(days / (1000 * 60 * 60 * 24));
						if(time<0){
							dd.device.notification.alert({
								message: '结束时间不能小于开始时间。',
								title: "提示",//可传空
								buttonName: "收到",
								onSuccess : function() {
									//onSuccess将在点击button之后回调
									/*回调*/
								},
								onFail : function(err) {}
							});
						}else{
							if(time>7){
								dd.device.notification.alert({
									message: '您最多可以预定一周的工位。',
									title: "提示",//可传空
									buttonName: "收到",
									onSuccess : function() {
										//onSuccess将在点击button之后回调
										/*回调*/
									},
									onFail : function(err) {}
								});
							}else{
								var twotime = true;
								//如果选取时间等于开始时间，则判断小时13:30，只能以18点结束
								if(time==0&&$('#start-date').text().indexOf('13:30')!=-1){
									twotime = false;
									
								}
								var timeStart = '12:00';
								dd.device.notification.confirm({
									message: "请选择具体结束时间：",
									title: "提示",
									buttonLabels:twotime? ['12:00', '18:00']: [ '18:00'],
									onSuccess: function (result) {
										// alert(JSON.stringify(result))
										if(twotime){
											timeStart = result.buttonIndex == 0 ? '12:00' : '18:00';
										}else{
											timeStart ='18:00' 
										}
										node.html(dateStart + ' ' + timeStart);
										listFloorWorkStation();
									},
									onFail: function (err) {}
								});
							}
						}
						

						

					},
					onFail: function () {}
				});
			});
			//楼层下拉列表
			$('#task-add .select-type').on('click', function () {
				var node = $(this).find('.select');
				var s = $(this).find('input[name=taskType]');
				var v = node.html().trim();
				dd.biz.util.chosen({
					source: floorList,
					selectedKey: v,
					onSuccess: function (result) {
						node.html(result.key);
						s.val(result.value);
						$("#map").attr('src', 'images/' + result.value + '.png');
						if (result.value == '0036ec50-304b-4be9-9640-5897d261b99b') {
							$("#map").css("width", '3.6rem');
							$("#map").css("height", '4.5rem');
						} else if (result.value == '00583000-825e-46b7-b6b3-5067be01d969') {
							$("#map").css("width", '9.3rem');
							$("#map").css("height", '3.5rem');
						}
						$('#task-add .select-station').find('.select').html('');
						$('#task-add .select-station').find('input[name=taskStation]').val('');
						listFloorWorkStation();
					},
					onFail: function () {}
				})
			});
			//工位下拉列表
			$('#task-add .select-station').on('click', function () {
				var node = $(this).find('.select');
				var s = $(this).find('input[name=taskStation]');
				var v = node.html().trim();
				dd.biz.util.chosen({
					source: stationList,
					selectedKey: v,
					onSuccess: function (result) {
						node.html(result.key);
						s.val(result.value);
					},
					onFail: function () {}
				})
			});
		},
		setLeft: function () {
			var that = this;
			dd.biz.navigation.setLeft({
				show: true, //控制按钮显示， true 显示， false 隐藏， 默认true
				control: true, //是否控制点击事件，true 控制，false 不控制， 默认false
				showIcon: true, //是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准       
				onSuccess: function (result) {
					dd.device.notification.confirm({
						message: "新增任务还未保存",
						title: "提示",
						buttonLabels: ['不保存', '继续'],
						onSuccess: function (result) {
							/*
							{
							    buttonIndex: 0 //被点击按钮的索引值，Number类型，从0开始
							}
							*/
							if (result.buttonIndex == 0) {
								// alert(44)
								dd.biz.navigation.close();
							}
						},
						onFail: function (err) {}
					});
				},
				onFail: function (err) {}
			});


		}
	};

	getOrgList(addressData.id);
	//为了能够在PC端进行测试
	if (dd.version) {
		dd.ready(function () {
			Page.init();
		});
	} else {
		Page.init();
	}
})();
//获取单位内的楼层
function getOrgList(orgId) {
	$.ajax({
		type: 'GET',
		url: ajaxIp + 'org/listFloor/' + orgId,
		data: {},
		dataType: 'json',
		success: function (data) {
			var changeList = [];
			$.each(data.dataList, function (i, item) {
				var ss = {};
				ss.value = item.id;
				ss.key = item.number;
				changeList.push(ss)
			})
			floorList = changeList
			$(".select-type .select").html(floorList[0].key)
			$("#taskType").val(floorList[0].value)
			$("#map").attr('src', 'images/' + floorList[0].value + '.png');
			var myDate = new Date();

			var da = myDate.getFullYear() + '-' + (Number(myDate.getMonth()) + 1) + '-' + myDate.getDate();
			if (myDate.getHours() >= 7 && myDate.getHours() < 12) { //0-23 上午八点后只可以预约下午的
				$('#start-date').html(da + ' 13:30');
			} else { //0-23 下午一点后只可以预约后一天的
				da = getNextDay(da);
				myDateFormat = da;
				$('#start-date').html(da + ' 8:30');
			}

			$('#end-date').html(da + ' 18:00');
			listFloorWorkStation();
		},
		error: function (err) {
			alert(err)
		}
	})
}
//每个楼层工位列表
function listFloorWorkStation() {
	console.log(localStorage.userInfo);
	var userInfo = {
		userId: '032835654421453344'
	};
	if (localStorage.userInfo) {
		userInfo = JSON.parse(localStorage.userInfo);
	}

	var ddd = {
		userId: userInfo.userId,
		startTime: $('#start-date').html(),
		endTime: $('#end-date').html(),
		floorId: $('#taskType').val()
	}
	$.ajax({
		type: 'POST',
		url: ajaxIp + 'workStation/listFloorWorkStationInfo',
		data: JSON.stringify(ddd),
		contentType: "application/json; charset=utf-8",
		dataType: 'json',
		success: function (data) {
			var changeList = [];
			$(".station").remove();
			if (data.errorCode === '10003') {
				if (data.subscribe) {
					// $('#start-date').html(data.subscribe.startTime)
					// $('#end-date').html(data.subscribe.endTime)
					var item = data.subscribe.workStationInfo
					var htmlss ='';
					if(item.sysUser){
						 htmlss = '<div class="station station2" id="station' + item.id + '" status="' + item.status + '" number="' + item.number + '" name="station" username="'+item.sysUser.name+'" usermobile="'+item.sysUser.mobile+'" userstart="'+item.startTime+'" userend="'+item.endTime+'"></div>';
					}else{
						 htmlss = '<div class="station station2" id="station' + item.id + '" status="' + item.status + '" number="' + item.number + '" name="station"></div>';
					}
					
					$(".img-stations").append(htmlss);
					$("#station" + item.id).css("top", item.positiontop + "rem");
					$("#station" + item.id).css("left", item.positionleft + "rem");
					$('.select-station .select').html(item.number)
					$("#taskStation").val(item.id)
					dd.device.notification.alert({
						message: '您在该时间段内已有预约，请更改时间。',
						title: "提示",//可传空
						buttonName: "收到",
						onSuccess : function() {
							//onSuccess将在点击button之后回调
							/*回调*/
						},
						onFail : function(err) {}
					});
				}


			} else if (data.errorCode === '200') {
				$.each(data.dataList, function (i, item) {

					if (item.status == '1') {
						var ss = {};
						ss.value = item.id;
						ss.key = item.number;
						changeList.push(ss)
					}

					//故障0 可用1 使用中2 固定3
					var htmlss ='';
					if(item.sysUser){
						 htmlss = '<div class="station station' + item.status + '" id="station' + item.id + '" status="' + item.status + '" number="' + item.number + '" name="station" username="'+item.sysUser.name+'" usermobile="'+item.sysUser.mobile+'" userstart="'+item.startTime+'" userend="'+item.endTime+'"></div>';
					}else{
						 htmlss = '<div class="station station' + item.status + '" id="station' + item.id + '" status="' + item.status + '" number="' + item.number + '" name="station"></div>';
					}
					$(".img-stations").append(htmlss);
					$("#station" + item.id).css("top", item.positiontop + "rem");
					$("#station" + item.id).css("left", item.positionleft + "rem");
				})
				stationList = changeList
				// alert(JSON.stringify(data))
			}

		},
		error: function (err) {
			alert(err)
		}
	})
}

function getTop(number) {


}

function getNextDay(d) {
	d = new Date(d);
	d = +d + 1000 * 60 * 60 * 24;
	d = new Date(d); //return d;
	//格式化
	return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}
function getNextSevenDay(d) {
	d = new Date(d);
	d = +d + 1000 * 60 * 60 * 24*7;
	d = new Date(d); //return d;
	//格式化
	return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}
function dateFormat(num){
	if(num<10){
		return '0'+num
	}else{
		return num;
	}
}