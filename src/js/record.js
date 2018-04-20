var ajaxIp = httpUrl.head;
var subscribeId = '';
(function () {
	var hash;
	var isShow = true;
	var t = 0;
	var pullDtd;

	// //模拟数据
	// var data = {
	// 	res: [{
	// 			taskId: 4,
	// 			taskName: '完成微应用设计方案',
	// 			startDate: "2015-11-11",
	// 			endDate: "2015-11-12",
	// 			level: 1,
	// 			state: 1
	// 		},
	// 		{
	// 			taskId: 5,
	// 			taskName: '完成微应用代码开发',
	// 			startDate: "2015-11-11",
	// 			endDate: "2015-11-12",
	// 			level: 2,
	// 			state: 1
	// 		},
	// 		{
	// 			taskId: 6,
	// 			taskName: '微应用发布上线',
	// 			startDate: "2015-11-11",
	// 			endDate: "2015-11-12",
	// 			level: 2,
	// 			state: 1
	// 		},
	// 		{
	// 			taskId: 1,
	// 			taskName: '了解钉钉微应用开发文档',
	// 			startDate: "2015-11-11",
	// 			endDate: "2015-11-12",
	// 			level: 1,
	// 			state: 2
	// 		},
	// 		{
	// 			taskId: 2,
	// 			taskName: '下载钉钉微应用开发demo',
	// 			startDate: "2015-11-11",
	// 			endDate: "2015-11-12",
	// 			level: 3,
	// 			state: 2
	// 		}
	// 	]
	// };
	// //模拟数据
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
			//签到
			$("#btn_come").on('click', function () {
				dd.device.geolocation.get({
					targetAccuracy: Number,
					coordinate: Number,
					withReGeocode: Boolean,
					useCache: true, //默认是true，如果需要频繁获取地理位置，请设置false
					onSuccess: function (result) {
						// alert(JSON.stringify(result))
						$.ajax({
							type: 'POST',
							url: ajaxIp + 'signin/' + subscribeId,
							data: JSON.stringify(result),
							contentType: "application/json; charset=utf-8",
							dataType: 'json',
							success: function (data) {
								// alert(JSON.stringify(data));
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
				//alert(_this.data('task-type'));

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

			} else if (page == 'detail') {
				dd.biz.util.openLink({
					url: Util.getTargetUrl('index.html', 'detail.html') + '?taskId=' + taskId + '&taskType=' + taskType
				});
				return;
			}
		}
	};
	//获取最近预约
	// getLatestSubscribe()
	//是运行在钉钉内
	if (dd.version) {
		
	} else {
		// alert(66)
		// Page.init();
	}
})();
;
function getRecord(){
	var userInfo = {
		userId: '032835654421453344'
	};
	if (localStorage.userInfo) {
		userInfo = JSON.parse(localStorage.userInfo);
	}
	$.ajax({
		type: 'GET',
		// url: ajaxIp + 'subscribe/listSubscribeHistory/' + JSON.parse(window.localStorage.userInfo).userId,
		url: ajaxIp + 'subscribe/listSubscribeHistory/' + userInfo.userId,
		contentType: "application/json; charset=utf-8",
		dataType: 'json',
		success: function (data) {
			for (let item of data.dataList) {
				if(item.status=='0'){
					$('#allmessages').append(
						`<ul class="message content">
						<li>
							<span>${item.startTime}</span>&nbsp;至&nbsp;<span>${item.endTime}</span>
						</li>
						<li>
							<span>${item.orgAddress}</span><span>${item.floorNumber}</span><span>${item.workStationNumber}</span>
						</li>
						<li>
							状态：<span>${item.statusDeail}</span>
							<span class="cancel btn" id="${item.subscribeId}" btntype="cancel" style="background-color:orangered;text-align:center;margin-left: .2rem;" >取消</span>
						</li>
					</ul>`
					)
				}else{
					$('#allmessages').append(
						`<ul class="message content">
						<li>
							<span>${item.startTime}</span>&nbsp;至&nbsp;<span>${item.endTime}</span>
						</li>
						<li>
							<span>${item.orgAddress}</span><span>${item.floorNumber}</span><span>${item.workStationNumber}</span>
						</li>
						<li>
							状态：<span>${item.statusDeail}</span>
							
						</li>
					</ul>`
					)
				}
				$(".cancel").click(function(){
					$.ajax({
						type: 'GET',
						url: ajaxIp + 'subscribe/cancle/' + $(this).attr('id'),
						data: '',
						dataType: 'json',
						success: function (data) {
							dd.device.notification.toast({
								icon: 'success', //icon样式，有success和error，默认为空 0.0.2
								text: '取消成功', //提示信息
								duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
								delay: 0, //延迟显示，单位秒，默认0
								onSuccess: function (result) {
									window.location.reload()
								},
								onFail: function (err) { }
							});
						},
						error: function (err) {
							alert(JSON.stringify(err))
						}
				})
				
			})
		}
	},
		error: function (err) {
			// alert(JSON.stringify(err))
		}
	})
}
(function () {
	
	dd.ready(function () {
		getRecord();
	});
	dd.error(function () {
		getRecord();
	});
	
})()