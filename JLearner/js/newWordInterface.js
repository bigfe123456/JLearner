mui.init({
	beforeback: function(){
		//获得列表界面的webview
		//获得列表界面的webview
		var webview = plus.webview.getWebviewById('jlearner.html');
		//触发列表界面的自定义事件（refresh）,从而进行数据刷新
		mui.fire(webview,'refreshNewWords',{
			newWords : newWordInterface.newWords
		});
		//返回true，继续页面关闭逻辑
		return true;
		//返回true，继续页面关闭逻辑
		return true;
	}
});
mui.plusReady(function(){
	var self = plus.webview.getWebviewById('newWordInterface.html');
	newWordInterface.currentNewWords = self.newWordsShow;
	newWordInterface.currentNewWord = self.currentNewWord;
	newWordInterface.isNeedVoice = !plus.storage.getItem('isNeedVoice');
	newWordInterface.playNewWordVoice();
	newWordInterface.currentNewWordIndex = newWordInterface.currentNewWords.findIndex(function(item,index){
		return (item.japanese == newWordInterface.currentNewWord.japanese);
	}) + 1;
	newWordInterface.newWords = self.newWords;
});
var newWordInterface = new Vue({
	el : '#mui-new-word-interface',
	data : {
		currentNewWord : false,
		currentNewWordIndex : 0,
		currentNewWords : [],
		newWords : [],
		isNewWordsDeleted : false,
		newWordVoice : new Audio(),
		isNeedVoice : true
	},
	methods : {
		getNewWord : function(){
			 this.currentNewWord = this.currentNewWords[this.currentNewWordIndex - 1];
			 this.playNewWordVoice();
			 this.isNewWordsDeleted = false;
		},
		changeCurrentNewWordIndex_up : function(){
			if(this.currentNewWordIndex == 1){
				return;
			}else{
				this.currentNewWordIndex --;
			}
			this.getNewWord();
		},
		changeCurrentNewWordIndex_down : function(){
			if(this.currentNewWordIndex == this.currentNewWords.length){
				return;
			}else{
				this.currentNewWordIndex ++;
			}
			this.getNewWord();
		},
		deleteFromNewWords : function(){
			if(!this.isNewWordsDeleted){
				this.currentNewWords.splice(this.currentNewWordIndex - 1,1);
				this.isNewWordsDeleted = true;
				this.newWords.forEach(function(item,index){
					if(item.japanese == newWordInterface.currentNewWord.japanese){
						newWordInterface.newWords.splice(index,1);
					}
				});
				if(plus.storage.getItem('userID')){
					mui.ajax('http://murakami.online/JLearner/deleteNewWordFromServer.php',{
						data:{
							userID : parseInt(plus.storage.getItem('userID')),
							wordOfBook : newWordInterface.currentNewWord.wordOfBook,
							japanese : newWordInterface.currentNewWord.japanese
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
				if(this.currentNewWordIndex > this.currentNewWords.length){
					this.currentNewWordIndex = this.currentNewWords.length;
				}
				this.getNewWord();
			}
		},
		playNewWordVoice : function(){
			if(this.isNeedVoice){
				this.newWordVoice.src = this.currentNewWord.pronunVoice;
		    	this.newWordVoice.play();
			}
		}
	},
	computed : {
		isFirstNewWord : function(){
			return (this.currentNewWordIndex === 1);
		},
		isLastNewWord : function(){
			return (this.currentNewWordIndex == this.currentNewWords.length);
		}
	}
});