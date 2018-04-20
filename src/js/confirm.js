$(function () {
	var ajaxIp =  httpUrl.head;
	// alert(localStorage.getItem('userInfo'));
	var userInfo = JSON.parse(localStorage.userInfo);
	var taskData = JSON.parse(localStorage.taskData);
	$("#address").html(taskData.address);
	$("#company").html(taskData.company);
	$("#station").html(taskData.stationNumber);
	$("#time").html(taskData.startTime + '到' + taskData.endTime);

	$("#name").html(userInfo.name);
	$("#depart").html(userInfo.departments);
	$("#mobile").html(userInfo.mobile);
	// $("#number").html(userInfo.userId);
	var param = {
		userId: userInfo.userId,
		startTime: taskData.startTime,
		endTime: taskData.endTime,
		workStationId: taskData.stationId
	}
	$('#btn_confirm').click(function () {
		$.ajax({
			type: 'POST',
			url: ajaxIp + 'subscribe/confirmSubscribe',
			data: JSON.stringify(param),
			contentType: "application/json; charset=utf-8",
			dataType: 'json',
			success: function (data) {
				// alert(JSON.stringify(data));
				dd.ready(function () {
					// alert('dd is ready')
				})
				if (data.errorCode === '200') {
					dd.device.notification.toast({
						icon: 'success', //icon样式，有success和error，默认为空 0.0.2
						text: '预定成功', //提示信息
						duration: 2, //显示持续时间，单位秒，默认按系统规范[android只有两种(<=2s >2s)]
						delay: 0, //延迟显示，单位秒，默认0
						onSuccess: function (result) {
							// dd.biz.navigation.close();
							dd.biz.util.openLink({
								url: location.protocol + '//' + location.host + '/' +'index.html'
							});
						},
						onFail: function (err) { }
					});
				} else if (data.errorCode === '10002') {
					dd.device.notification.alert({
						message: data.errorMsg,
						title: "提示",//可传空
						buttonName: "收到",
						onSuccess : function() {
							//onSuccess将在点击button之后回调
							/*回调*/
						},
						onFail : function(err) {}
					});
					return;
					
				}

			},
			error: function (err) {
				alert(err)
			}
		})
	})
})
