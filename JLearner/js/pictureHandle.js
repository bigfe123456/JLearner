var whereComeHere = false;
mui.init({
	beforeback: function(){
		//获得列表界面的webview
		if(imgurl){
			if(whereComeHere){
				var anotherWebview = plus.webview.getWebviewById('changeUserInfo.html');
				//触发列表界面的自定义事件（refresh）,从而进行数据刷新
				mui.fire(anotherWebview,'setUserNewPhoto',{
					path : imgurl
				});
			}else{
				var webview = plus.webview.getWebviewById('register.html');
				//触发列表界面的自定义事件（refresh）,从而进行数据刷新
				mui.fire(webview,'setUserPhoto',{
					path : imgurl
				});
			}
		}
		//返回true，继续页面关闭逻辑
		return true;
	}
});
var imgurl = null;
var webviewContent = 1;
mui.plusReady(function(){
	var self = plus.webview.getWebviewById('pictureHandle.html');
	document.getElementById('cut-img').src = self.path;
	if(self.changeWhereComeHere){
		whereComeHere = true;
	}
	document.getElementById('cut-img').addEventListener('load',function(){
		$('#cut-img').cropper({
			aspectRatio: 1 / 1,
			autoCropArea: 0.6,
			background: false,
			guides: false,
			highlight: false,
			dragCrop: false,
			resizable: false,
			crop: function(data) {
				//output some data here
			}
		});
	},false);
});
var cutImg = new Vue({
	el : '#checkmarkempty',
	data : {
		isActive : false
	},
	methods : {
		completedPhoto : function(){
			this.isActive = true;
			var dataURL = $('#cut-img').cropper("getCroppedCanvas",{width:100,height:100});
				imgurl=dataURL.toDataURL("image/png",1.0);
//				$('#img').attr("src", imgurl);
				plus.io.resolveLocalFileSystemURL('_doc/camera/',function(entry){
					entry.removeRecursively( function(){
					}, function(e){					
					} );
				},function(e){				
				});
				mui.back();
		}
	}
})
