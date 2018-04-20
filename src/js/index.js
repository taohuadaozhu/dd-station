var ajaxIp = httpUrl.head;
var userId = '032835654421453344';
var subscribeId = '';
(function () {
	var hash;
	var isShow = true;
	var t = 0;
	var pullDtd;

	// if (!localStorage.getItem('taskData')) {
	// 	localStorage.setItem('taskData', JSON.stringify(data));
	// }
	var Util = {
		getQuery: function (param) {
			var url = window.location.href;
			var searchIndex = url.indexOf('?');
			var searchParams = url.slice(searchIndex + 1).split('&');
			for (var i = 0; i < searchParams.length; i++) {
				var items = searchParams[i].split('=');
				if (items[0].trim() == param) {
					return items[1].trim();
				}
			}
		},
		getTargetUrl: function (replaceUrl, targetUrl) {
			var protocol = location.protocol;
			var host = location.host;
			var pathname = location.pathname.replace(replaceUrl, targetUrl);
			return protocol + '//' + host + '/' + targetUrl;
		}

	};

	var Page = {
		init: function () {

			var that = this;
			//防止300毫秒点击延迟
			FastClick.attach(document.body);
			// this.initData();
			// //绑定事件
			// this.bind();

			$('body').trigger('navigation.title.change', [{
				"title": "工位预定"
			}]);


			//绑定下拉事件
			dd.ui.pullToRefresh.enable({
				onSuccess: function () {
					setTimeout(function () {
						//todo 相关数据更新操作
						dd.ui.pullToRefresh.stop();
					}, 2000);
				},
				onFail: function () {}
			});
			$("#btn_new,#btn_new1").on('click', function () {
				that.go('add');
			})
			$("#btn_record").on('click', function () {
				that.go('record');
			})
			$("#edit").on('click', function () {
				that.go('edit');
			})
			//签到 终止使用 取消预约 
			$(".havebook").on('click', function (event) {
				var btntype = $(event.target).attr("btntype")
				
				if (btntype === 'signin') {
					dd.device.geolocation.get({
						targetAccuracy: 200,
						coordinate: 1,
						withReGeocode: false,
						useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
						onSuccess: function (result) {
							$.ajax({
								type: 'POST',
								url: ajaxIp + 'subscribe/signin/' + subscribeId,
								data: JSON.stringify(result),
								contentType: "application/json; charset=utf-8",
								dataType: 'json',
								success: function (data) {
									if(data.errorCode=='200'){
										dd.device.notification.toast({
											icon: 'success', //icon样式，有success和error，默认为空 0.0.2
											text: '签到成功', //提示信息
											duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
											delay: 0, //延迟显示，单位秒，默认0
											onSuccess: function (result) {
												getLatestSubscribe();
											},
											onFail: function (err) { }
										});
									}else{
										dd.device.notification.alert({
											message: data.errorMsg,
											title: "签到失败",//可传空
											buttonName: "收到",
											onSuccess : function() {
												//onSuccess将在点击button之后回调
												/*回调*/
											},
											onFail : function(err) {}
										});
										
									}
									
									
								},
								error: function (err) {
									alert(JSON.stringify(err))
								}
							})
						},
						onFail: function () {
							alert("获取位置失败")
						}
					})
				} else if (btntype === 'stop') {
					$.ajax({
						type: 'GET',
						url: ajaxIp + 'subscribe/stop/' + subscribeId,
						data: {},
						contentType: "application/json; charset=utf-8",
						dataType: 'json',
						success: function (data) {
							dd.device.notification.toast({
								icon: 'error', //icon样式，有success和error，默认为空 0.0.2
								text: '终止成功', //提示信息
								duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
								delay: 0, //延迟显示，单位秒，默认0
								onSuccess: function (result) {
									getLatestSubscribe();
								},
								onFail: function (err) { }
							});
						},
						error: function (err) {
							alert(JSON.stringify(err))
						}
					})
				} else if (btntype === 'cancel') {
					$.ajax({
						type: 'GET',
						url: ajaxIp + 'subscribe/cancle/' + subscribeId,
						data: '',
						dataType: 'json',
						success: function (data) {
							dd.device.notification.toast({
								icon: 'success', //icon样式，有success和error，默认为空 0.0.2
								text: '取消成功', //提示信息
								duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
								delay: 0, //延迟显示，单位秒，默认0
								onSuccess: function (result) {
									getLatestSubscribe();
								},
								onFail: function (err) { }
							});
						},
						error: function (err) {
							alert(JSON.stringify(err))
						}
					})
				} else if (btntype === 'error') {
					//故障报修
					dd.device.notification.prompt({
						message: "请输入故障原因",
						defaultText: "",
						buttonLabels: ['提交', '取消'],
						onSuccess: function (result) {
							if (result.buttonIndex == 0) {
								if (result.value == '') {
									dd.device.notification.alert({
										message: "请输入故障原因",
										title: "提示", //可传空
										buttonName: "收到",
										onSuccess: function () {
											//onSuccess将在点击button之后回调
											/*回调*/
										},
										onFail: function (err) {}
									});
								} else {
									var ddd = {
										subscribeId: subscribeId,
										content: result.value
									}
									$.ajax({
										type: 'POST',
										url: ajaxIp + 'subscribe/faultFeedback',
										data: JSON.stringify(ddd),
										dataType: 'json',
										contentType: "application/json; charset=utf-8",
										success: function (data) {
											dd.device.notification.confirm({
												message: "感谢您反馈故障，若工位故障影响到了您的工作，您可以选择预约新的工位。",
												buttonLabels: ['重新预约', '继续使用'],
												onSuccess: function (result) {
													if (result.buttonIndex == 0) {
														//重新预约
														$.ajax({
															type: 'GET',
															url: ajaxIp + 'subscribe/anewSubscribe/' + data.faultFeedbackId,
															dataType: 'json',
															success: function (data) {
																dd.biz.util.openLink({
																	url: location.protocol + '//' + location.host + '/' + 'add.html'
																});
															},
															error: function (err) {
																alert(JSON.stringify(err))
															}
														})

													} else {

													}
												},
												onFail: function (err) {}
											});
											getLatestSubscribe();
										},
										error: function (err) {
											alert(JSON.stringify(err))
										}
									})
								}
							}


						},
						onFail: function (err) {}
					});
					// $.ajax({
					// 	type: 'GET',
					// 	url: ajaxIp + 'subscribe/cancle/' + subscribeId,
					// 	data: JSON.stringify(result),
					// 	dataType: 'json',
					// 	success: function (data) {
					// 		alert(JSON.stringify(data));
					// 		getLatestSubscribe();
					// 	},
					// 	error: function (err) {
					// 		alert(JSON.stringify(err))
					// 	}
					// })
				} else if (btntype === 'new') {
					//new
					that.go('add');
				}else if(btntype ==='recent'){
					that.go('detail');
				}


			})
			//绑定每个任务的点击事件，事件采用代理的方式
			$('.doc').on('click', '.item', function () {
				var _this = $(this);
				console.log(_this);
				_this.addClass('active');
				setTimeout(function () {
					that.go('detail', _this.data('taskid'), _this.data('task-type'));
					_this.removeClass('active');
				}, 100);
			});

			var t3 = localStorage.getItem('_t_');
			//
			if (!t3) {
				localStorage.setItem('_t_', t);
			} else {
				t = t3;
			}
			document.addEventListener('resume', function (e) {
				e.preventDefault();
				//判断是否有数据更新
				var t2 = localStorage.getItem('_t_');
				if (t2 != t) {
					t = t2;
					that.initData();
				}
			}, false);
		},
		initData: function () {
			var toDoHtml = [];
			var doneHtml = [];
			var that = this;
			var data = localStorage.getItem('taskData');
			data = JSON.parse(data);
			var todoCount = 0;
			var doneCount = 0;
			for (var i = 0; i < data.res.length; i++) {
				if (data.res[i].state == 1) {
					todoCount++;
					toDoHtml.push(that.renderItem(data.res[i], 'todo'));
				}
			}
			//先清空现有数据
			$('#todolist .bd').html('');
			$('<ol/>').html(toDoHtml.join('')).appendTo($('#todolist .bd'));

			$('#todolist .hd span').text('（' + todoCount + '）');

			for (var i = 0; i < data.res.length; i++) {
				if (data.res[i].state == 2) {
					doneCount++;
					doneHtml.push(that.renderItem(data.res[i], 'done'));
				}
			}
			//先清空现有数据
			$('#donelist .bd').html('');
			$('<ol/>').html(doneHtml.join('')).appendTo($('#donelist .bd'));
			$('#donelist .hd span').text('（' + doneCount + '）');
		},
		renderItem: function (item, type) {
			var html = '';
			var levelName = '';
			switch (parseInt(item.level)) {
				case 1:
					levelName = '非常紧急';
					break;
				case 2:
					levelName = '紧急';
					break;
				case 3:
					levelName = '一般';
					break;
			}
			html = '<li class="item" data-taskid="' + item.taskId + '" data-task-type="' + type + '"><div class="wrap"><h3>' + item.taskName + '<i class="p' + item.level + '">' + levelName + '</i></h3></div></li>';
			return html;
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
		},
		getLevelName: function (level) {
			var levelName = '';
			switch (level) {
				case 1:
					levelName = '非常紧急';
					break;
				case 2:
					levelName = '紧急';
					break;
				case 3:
					levelName = '一般';
					break;
			}
			return levelName;
		},
		go: function (page, taskId, taskType) {
			var that = this;
			if (page == 'add') {

				//这里替换为对应的页面url
				dd.biz.util.openLink({
					url: Util.getTargetUrl('index.html', 'add.html')
				});
				return;

			}  else if (page == 'record') {
				dd.biz.util.openLink({
					url: Util.getTargetUrl('index.html', 'record.html') + '?taskId=' + taskId + '&taskType=' + taskType
				});
				return;
			}else if (page == 'edit') {
				dd.biz.util.openLink({
					url: Util.getTargetUrl('index.html', 'edit.html')
				});
				return;
			}else if(page == 'detail'){
				dd.biz.util.openLink({
					url: Util.getTargetUrl('index.html', 'detail.html')+'?subscribeId='+subscribeId
				});
				return;
			}
		}
	};
	// 获取最近预约
	// getLatestSubscribe()
	// listNotificationNumber();
	//是运行在钉钉内
	if (dd.version) {
		// if (1) {
		// 	alert(dd.version)
		//获取签名
		$.ajax({
			type: 'GET',
			url: ajaxIp + 'dingTalk/getDingTalkSignature',
			data: {
				url: window.location.href
			},
			dataType: 'json',
			success: function (data) {
				
				var _config = data.dataList[0]
				dd.config({
					agentId: _config.agentId, // 必填，微应用ID
					corpId: _config.corpId, //必填，企业ID
					timeStamp: _config.timeStamp, // 必填，生成签名的时间戳
					nonceStr: _config.nonceStr, // 必填，生成签名的随机串
					signature: _config.signature, // 必填，签名
					jsApiList: ['ui.pullToRefresh.enable', 'ui.pullToRefresh.stop', 'biz.util.openLink',
						'biz.navigation.setLeft', 'biz.navigation.setTitle',
						'biz.navigation.setRight', 'device.geolocation.get'
					] // 必填，需要使用的jsapi列表
				});
				
				dd.ready(function () {
					
					//用户免登获取code
					dd.runtime.permission.requestAuthCode({
						corpId: _config.corpId,
						onSuccess: function (result) {
							//根据钉钉返回的code获取用户信息
							$.ajax({
								type: 'GET',
								url: ajaxIp + 'dingTalk/getUserInfo/' + result.code,
								data: {},
								dataType: 'json',
								success: function (data) {
									var userinfo = data.dataList[0]
									if(userinfo.avatar&&userinfo.avatar!=''){
										$("#avatar").attr("src", userinfo.avatar)
									}
									
									$("#username").html(userinfo.name)
									$("#userdepart").html(userinfo.departmentNames)
									userId = userinfo.userId;
									localStorage.setItem('userInfo', JSON.stringify(userinfo));
									
									if(userinfo.category=='0'){
										$("#edit").show();
									}
									var datetime = new Date()
									var time = datetime.getTime;
									//获取最近预约
									getLatestSubscribe()
									//获取最近通知
									listNotificationNumber()
								},
								error: function (err) {
									alert('根据钉钉返回的code获取用户信息失败' + JSON.stringify(err))
								}
							})
							Page.init();
						},
						onFail: function (err) {
							alert(JSON.stringify(err))
						}
					});

				});
				dd.error(function (err) {
					alert('钉钉配置失败！代码返回的' + JSON.stringify(_config) + '钉钉返回的' + JSON.stringify(err) + '时间为' + datetime.toLocaleString())
				});

			},
			error: function (err) {
				// alert('签名' + err)
			}
		})

	} else {
		// Page.init();
	}
})();
//获取距离当前时间最近的预约
function getLatestSubscribe() {
	$.ajax({
		type: 'GET',
		url: ajaxIp + 'subscribe/getLatestSubscribe/' + userId,
		data: {},
		dataType: 'json',
		success: function (data) {
			if (data.dataList && data.dataList.length > 0 && data.dataList[0]) {
				var book = data.dataList[0];
				subscribeId = book.subscribeId
				// "orgName": "北京天职信息技术有限公司",
				// "orgAddress": "西安市高新区禾盛京广中心",
				// "floorNumber": "25层",
				// "workStationNumber": "X25003",
				// "startTime": "2017-10-20 09:28",
				// "endTime": "2017-10-20 19:32",
				// "subscribeId": "9748e38a-7e0c-4669-a6d4-22a2c78b951b",
				// "userId": "manager8637",
				// "status": "0",
				// "statusDeail": "未签到"
				// console.log(data.dataList);
				$(".nonebook").hide();
				$(".havebook").show();
				if (book.status === "0") {
					$(".havebook p").html('您预约了<br>' + book.startTime + '至' + book.endTime + '<br>' + book.orgName + '<br/>位于' + book.orgAddress + '<br>' + book.floorNumber + '' + book.workStationNumber + '工位(状态:' + book.statusDeail + ')')
					$(".havebook .btns").html('<div class="btn" btntype="signin" id="btn_come" style="background-color:#5ec9f6;">签到</div><div class="btn" btntype="cancel" id="btn_cancel" style="background-color:orangered;" >取消</div>');
				} else if (book.status === "2") {
					$(".havebook p").html('您正在使用<br>' + book.startTime + '至' + book.endTime + '<br>' + book.orgName + '<br/>位于' + book.orgAddress + '<br>' + book.floorNumber + '' + book.workStationNumber + '工位(状态:' + book.statusDeail + ')')
					$(".havebook .btns").html('<div class="btn" btntype="stop" style="background-color:orangered;">终止使用</div><div class="btn2" btntype="error">故障报修</div>');
				} else if (book.status === "1") {
					$(".havebook p").html('您已终止使用<br>' + book.startTime + '至' + book.endTime + '<br>' + book.orgName + '<br/>位于' + book.orgAddress + '<br>' + book.floorNumber + '' + book.workStationNumber + '工位(状态:' + book.statusDeail + ')')
					$(".havebook .btns").html('<div class="btn" btntype="new">继续预约</div>');
				} else if (book.status === "3") {
					$(".havebook p").html('您已使用完毕<br>' + book.startTime + '至' + book.endTime + '<br>' + book.orgName + '<br/>位于' + book.orgAddress + '<br>' + book.floorNumber + '' + book.workStationNumber + '工位(状态:' + book.statusDeail + ')')
					$(".havebook .btns").html('<div class="btn" btntype="new">继续预约</div>');
				} else if (book.status === "4") {
					$(".havebook p").html('您预约的工位已故障报修<br>' + book.startTime + '至' + book.endTime + '<br>' + book.orgName + '<br/>位于' + book.orgAddress + '<br>' + book.floorNumber + '' + book.workStationNumber + '工位(状态:' + book.statusDeail + ')')
					$(".havebook .btns").html('<div class="btn" btntype="new">重新预约</div>');
				}
			} else {
				$(".nonebook").show();
				$(".havebook").hide();
			}
		},
		error: function (err) {
			alert(err)
		}
	})
}

function listNotificationNumber() {
	$.ajax({
		type: 'GET',
		url: ajaxIp + 'subscribe/listNotificationNumber/' + userId + '/5',
		data: {},
		dataType: 'json',
		success: function (data) {
			$("#allmessages").html('');			
			if (data.dataList) {
				$.each(data.dataList, function (i, item) {
					var htmlss = '<div class="message" ><div class="content">'+item.content+'</div><div class="time">'+item.modifiedTime+'</div></div>';
					$("#allmessages").append(htmlss);
				});

			} else {

			}


		},
		error: function (err) {
			alert(err)
		}
	})
}
// function testcome(){
// 	var result ={
// 		locationType:'',
// 		accuracy:'29',
// 		latitude:'39.933708',
// 		longitude:'116.321583',
// 		province:'北京市',
// 		city:'北京市',
// 		district:'海淀区',
// 		road:'车公庄西路',
// 		address:'北京市海淀区车公庄西路20-1011号楼靠近外文文化创意园'
// 	}
// 	$.ajax({
// 		type: 'POST',
// 		url: ajaxIp+'subscribe/signin/'+'b1b879a3-5bc6-442c-9631-a76cd14ed6cd',
// 		data: JSON.stringify(result),
// 		contentType: "application/json; charset=utf-8",
// 		dataType: 'json',
// 		success: function (data) {
// 			alert(JSON.stringify(data));
// 		},
// 		error: function (err) {
// 			alert(JSON.stringify(err))
// 		}
// 	})
// }
// function stop() {
// 	var subscribeId = '6c9654bb-cec9-49e7-bff6-1f5964688a58'
// 	$.ajax({
// 		type: 'GET',
// 		url: ajaxIp + 'subscribe/stop/' + subscribeId,
// 		data: {},
// 		contentType: "application/json; charset=utf-8",
// 		dataType: 'json',
// 		success: function (data) {
// 			alert(JSON.stringify(data));
// 		},
// 		error: function (err) {
// 			alert(JSON.stringify(err))
// 		}
// 	})
// }
function getMoreMessage() {
	window.location.href = location.protocol + '//' + location.host + '/' +'message.html';
}