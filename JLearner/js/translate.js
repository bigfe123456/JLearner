mui.init({
	beforeback: function(){
		//获得列表界面的webview
		var webview = plus.webview.getWebviewById('jlearner.html');
		//触发列表界面的自定义事件（refresh）,从而进行数据刷新
		mui.fire(webview,'drawCavasFromRegisterOrLogin');
		//返回true，继续页面关闭逻辑
		return true;
	}
});
mui.plusReady(function(){
	translate.userID = parseInt(plus.storage.getItem('userID'));
	translate.initSearchHistory();
})
var translate = new Vue({
	el : '#mui-translate',
	data : {
		q : '',
		from : 'zh',
		to : 'jp',
		appid : 'xxxxxxxxxxxxxxxx', //百度翻译appid
		salt : '1435660288',   //随机数
		miyao : 'xxxxxxxxxxxxxx',  //百度翻译密钥
		result : '',
		isTranslateSuccess : false,
		translateHistory : [],
		userID : 0
	},
	computed : {
		sign : function(){
			return (MD5(this.appid+this.q+this.salt+this.miyao));
		}
	},
	methods : {
		getResultFromBaidu : function(){
			var _self = this;
			if(/^[\u4E00-\u9FA5A-Za-z0-9\uFE30-\uFFA0\·\！\（\）\；\‘\“\”\’\。\，\…\……\+\-\*\/\\\~\`\!\@\#\$\%\^\&\(\)\;\:\|\'\"\,\<\.\>\?\/\s+_]+$/.test(_self.q)){
				_self.from = 'zh';
				_self.to = 'jp';
			}else{
				_self.from = 'jp';
				_self.to = 'zh';
			}
			mui.ajax('http://api.fanyi.baidu.com/api/trans/vip/translate',{
				data:{
					q : _self.q,
					from : _self.from,
					to : _self.to,
					appid : _self.appid,
					salt : _self.salt,
					sign : _self.sign
				},
				dataType:'json',
				type:'get',
				success:function(data){
					_self.result = data.trans_result[0].dst;
					_self.isTranslateSuccess = true;
					var isUnique = _self.translateHistory.findIndex(function(item,index){
						return (item.searchKey == data.trans_result[0].src);
					});
					if(isUnique < 0 ){
						var _rondomColor = _self.rondomIndex();
						_self.translateHistory.unshift({
							searchKey : data.trans_result[0].src,
							badgeColorIndex : _rondomColor
						});
						if(_self.userID){
							mui.ajax('http://murakami.online/JLearner/addSearchHistory.php',{
								data:{
									userID : parseInt(plus.storage.getItem('userID')),
									searchKey : data.trans_result[0].src,
									badgeColorIndex : _rondomColor
								},
								dataType:'json',
								type:'post',
								success:function(data){
								},
								error:function(xhr,type,errorThrown){
									//do error things
									mui.toast('同步服务器数据失败。');
								}
							});
						}
					}
				},
				error:function(xhr,type,errorThrown){
					//do error things
					mui.toast('获取翻译数据失败。');
				}
			});
		},
		changeIsTranslateSuccess : function(){
			this.isTranslateSuccess = false;
			var _self = this;
			mui(".mui-icon-clear")[0].addEventListener('tap',function(){
　　　　　　		_self.q = '';
　　　　 　   });
		},
		rondomIndex : function(){
			return (Math.floor(Math.random()*5)+1);
		},
		setQ : function(value){
			this.q = value;
			this.getResultFromBaidu();
		},
		initSearchHistory : function(){
			var _self = this;
			if(_self.userID){
				mui.ajax('http://murakami.online/JLearner/getSearchHistory.php',{
					data:{
						userID : parseInt(plus.storage.getItem('userID')),
					},
					dataType:'json',
					type:'post',
					success:function(data){
						data.forEach(function(item,index){
							if(index !== 0){
								_self.translateHistory.push({
									searchKey : item.searchKey,
									badgeColorIndex : parseInt(item.badgeColorIndex)
								});
							}
						});
					},
					error:function(xhr,type,errorThrown){
						//do error things
						mui.toast('获取服务器数据失败。');
					}
				});
			}
		},
		deleteSearchHistory : function(){
			this.translateHistory = [];
			if(this.userID){
				mui.ajax('http://murakami.online/JLearner/deleteSearchHistory.php',{
					data:{
						userID : parseInt(plus.storage.getItem('userID')),
					},
					dataType:'json',
					type:'post',
					success:function(data){
					},
					error:function(xhr,type,errorThrown){
						//do error things
						mui.toast('同步服务器数据失败。');
					}
				});
			}
		}
	}
});