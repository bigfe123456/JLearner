mui.init();
var recommend = new Vue({
	el : '#mui-jlearner-card-content',
	data : {
		isShow : false,
		japaneseContent : '',
		chineseContent : ''
	},
	methods : {
		getRondomSayingsID : function(){
			return (Math.floor(Math.random()*30)+1);
		},
		receiveSayings : function(sayingsID){
			mui.ajax('http://murakami.online/JLearner/recommend.php',{
				data:{
					sayingsID : sayingsID
				},
				dataType:'json',
				type:'get',
				success:function(data){
					recommend.japaneseContent = data.sayingsJapanese;
					recommend.chineseContent = data.sayingsChinese;
					recommend.isShow = true;
					setTimeout("recommend.doSuccess()",4000);
				},
				error:function(xhr,type,errorThrown){
					setTimeout("recommend.doError()",4000);
				}
			});
		},
		doError : function(){
			mui.alert('网络未连接或服务器打盹，请重启检查网络设置或联系站长Murakami。','JLearner','退出应用',function(){
				plus.runtime.quit();
			})
		},
		doSuccess : function(){
			var webviewContent = plus.webview.create('jlearner.html',
								'jlearner.html');
			webviewContent.addEventListener("rendered", function(){
	    		webviewContent.show("pop-in",200);
			}, false);
		}
	},
	created : function(){
		this.receiveSayings(this.getRondomSayingsID());
	}
})
