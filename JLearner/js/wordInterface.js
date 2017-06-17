mui.init({
	beforeback: function(){
		//获得列表界面的webview
		var webview = plus.webview.getWebviewById('jlearner.html');
		//触发列表界面的自定义事件（refresh）,从而进行数据刷新
		mui.fire(webview,'drawCavas',{
			learnedWordsCount : wordInterface.learnedWordsCount,
			newWords : wordInterface.newWords
		});
		//返回true，继续页面关闭逻辑
		return true;
	}
});
window.addEventListener('refreshNewWords',function(event){
	wordInterface.newWords = event.detail.newWords;
	wordInterface.changeWordID_down();
},false);
window.addEventListener('resetLearnedWords',function(event){
	wordInterface.learnedWords = [];
},false);
mui.plusReady(function(){
	var self = plus.webview.getWebviewById('wordInterface.html');
	wordInterface.bookName = self.bookName;
	wordInterface.bookWordsCount = self.bookWordsCount;
	wordInterface.isNeedVoice = !plus.storage.getItem('isNeedVoice');
	wordInterface.isNotNeedTest = !!plus.storage.getItem('isNotNeedTest');
	wordInterface.learnedWordsCount = self.learnedWordsCount == 0 ? 1 : self.learnedWordsCount;
	wordInterface.newWords = self.newWords;
	wordInterface.learnedWords.push({
		wordID : wordInterface.learnedWordsCount
	});
	wordInterface.getNewWordFromServer();
});
var wordInterface = new Vue({
	el : '#mui-word-interface',
	data : {
		currentWord : false,
		bookName : '新标准日本语N5词汇',
		bookWordsCount : 5,
		learnedWordsCount : 2,
		newWords : [],
		isNewWordsAdded : false,
		newWordVoice : new Audio(),
		isNeedVoice : true,
		isNotNeedTest : false,
		learnedWords : []
	},
	methods : {
		getNewWordFromServer : function(){
			mui.ajax('http://murakami.online/JLearner/getNewWord.php',{
				data:{
					bookName : wordInterface.serverBookName,
					wordID : wordInterface.learnedWordsCount,
					userID : parseInt(plus.storage.getItem('userID'))
				},
				dataType:'json',
				type:'post',
				success:function(data){
					wordInterface.currentWord = data;
					wordInterface.playNewWordVoice();
					wordInterface.isNewWordsAdded = false;
					wordInterface.newWords.forEach(function(item){
						if(item.japanese === wordInterface.currentWord.japanese){
							wordInterface.isNewWordsAdded = true;
						}
					})
				},
				error:function(xhr,type,errorThrown){
					//do error things
					mui.toast('服务器获取数据失败。');
				}
			});
		},
		changeWordID_up : function(){
			if(this.isNotNeedTest){
				if(this.learnedWordsCount == 1){
					return;
				}else{
					this.learnedWordsCount --;
				}
				this.getNewWordFromServer();
			}else{
				if(this.learnedWordsCounter === 10){
					this.openWordTestInterface();
					return;
				}
				var _self = this;
				if(this.learnedWordsCount == 1){
					this.addToLearnedWords();
					return;
				}else{
					this.learnedWordsCount --;
				}
				this.addToLearnedWords();
				this.getNewWordFromServer();
			}
		},
		changeWordID_down : function(){
			if(this.isNotNeedTest){
				if(this.learnedWordsCount == this.bookWordsCount){
					return;
				}else{
					this.learnedWordsCount ++;
				}
				this.getNewWordFromServer();
			}else{
				if(this.learnedWordsCounter === 10){
					this.openWordTestInterface();
					return;
				}
				var _self = this;
				if(this.learnedWordsCount == this.bookWordsCount){
					this.addToLearnedWords();
					return;
				}else{
					this.learnedWordsCount ++;
				}
				this.addToLearnedWords();
				this.getNewWordFromServer();
			}
		},
		openWordTestInterface : function(){
			var webviewContent = plus.webview.create('wordTestInterface.html',
								'wordTestInterface.html',{},{
									learnedWords : wordInterface.learnedWords,
									bookName : wordInterface.serverBookName,
									bookWordsCount : wordInterface.bookWordsCount,
									newWords :  wordInterface.newWords
								});
			webviewContent.addEventListener("rendered", function(){
	    		webviewContent.show("pop-in",200);
			}, false);
		},
		addToLearnedWords : function(){
			var _isLearnedWordsAdded = false;
			this.learnedWords.forEach(function(item){
				if(item.wordID === wordInterface.learnedWordsCount){
					_isLearnedWordsAdded = true;
				}
			});
			if(!_isLearnedWordsAdded){
				this.learnedWords.push({
					wordID : wordInterface.learnedWordsCount
				});
			}
		},
		addToNewWords : function(){
			if(!this.isNewWordsAdded){
				this.newWords.push({
					userID : parseInt(plus.storage.getItem('userID')),
					wordOfBook : wordInterface.serverBookName,
					japanese : wordInterface.currentWord.japanese,
					pronun : wordInterface.currentWord.pronun,
					pronunVoice : wordInterface.currentWord.pronunVoice,
					chinese : wordInterface.currentWord.chinese,
					exampleJapanese : wordInterface.currentWord.exampleJapanese,
					exampleChinese : wordInterface.currentWord.exampleChinese,
					isNewWordsChinese : false
				});
				if(plus.storage.getItem('userID')){
					mui.ajax('http://murakami.online/JLearner/setNewWordToServer.php',{
						data:{
							userID : parseInt(plus.storage.getItem('userID')),
							wordOfBook : wordInterface.serverBookName,
							japanese : wordInterface.currentWord.japanese,
							pronun : wordInterface.currentWord.pronun,
							pronunVoice : wordInterface.currentWord.pronunVoice,
							chinese : wordInterface.currentWord.chinese,
							exampleJapanese : wordInterface.currentWord.exampleJapanese,
							exampleChinese : wordInterface.currentWord.exampleChinese
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
				this.isNewWordsAdded = true;
			}
		},
		playNewWordVoice : function(){
			if(this.isNeedVoice){
				this.newWordVoice.src = this.currentWord.pronunVoice;
		    	this.newWordVoice.play();
			}
		}
	},
	computed : {
		serverBookName : function(){
			var _serverBookName = '';
			switch(this.bookName){
				case ('新标准日本语N1词汇') : {
					_serverBookName = `japaneseN1`;
					break;
				};
				case ('新标准日本语N2词汇') : {
					_serverBookName = `japaneseN2`;
					break;
				};
				case ('新标准日本语N3词汇') : {
					_serverBookName = `japaneseN3`;
					break;
				};
				case ('新标准日本语N4词汇') : {
					_serverBookName = `japaneseN4`;
					break;
				};
				case ('新标准日本语N5词汇') : {
					_serverBookName = `japaneseN5`;
					break;
				};
				default : {
					break;
				}
			}
			return _serverBookName;
		},
		isFirstNewWord : function(){
			return (this.learnedWordsCount === 1);
		},
		isLastNewWord : function(){
			return (this.learnedWordsCount == this.bookWordsCount);
		},
		learnedWordsCounter : function(){
			return (this.learnedWords.length);
		},
		isIconStart : function(){
			return this.learnedWordsCounter === 10
		}
	}
});