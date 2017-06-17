mui.init({
	beforeback: function(){
		//获得列表界面的webview
		var webview = plus.webview.getWebviewById('wordInterface.html');
		//触发列表界面的自定义事件（refresh）,从而进行数据刷新
		mui.fire(webview,'refreshNewWords',{
			newWords : wordTestInterface.newWords
		});
		//返回true，继续页面关闭逻辑
		return true;
	}
});
mui.plusReady(function(){
	var self = plus.webview.getWebviewById('wordTestInterface.html');
	var webview = plus.webview.getWebviewById('wordInterface.html');
	//触发列表界面的自定义事件（refresh）,从而进行数据刷新
	mui.fire(webview,'resetLearnedWords');
	wordTestInterface.words = wordTestInterface.randomOrder(self.learnedWords)
	wordTestInterface.bookName = self.bookName;
	wordTestInterface.bookWordsCount = self.bookWordsCount;
	wordTestInterface.newWords = self.newWords;
	wordTestInterface.getOptionsFromServer();
});
var wordTestInterface = new Vue({
	el : '#mui-word-test',
	data : {
		testTitle : '',
		testOptions : [],
		words : [],
		currentWord : {},
		newWords : [],
		isNewWordsAdded : false,
		bookName : 'japaneseN1',
		orderIndex : 0,
		bookWordsCount : 10000,
		isSelectedSuccess : [false,false,false,false],
		isSelectedError : [false,false,false,false],
		isOptionsTaped : false,
		optionsDesc : ['japanese-to-chinese','chinese-to-japanese','japanese-to-pronun','pronun-to-japanese']
	},
	methods : {
		randomOrder : function(arr){
			var len = arr.length;
		 	for(var i = 0; i < len - 1; i++){
		 	var idx = Math.floor(Math.random() * (len - i));
		 		var temp = arr[idx];
		 		arr[idx] = arr[len - i - 1];
		 		arr[len - i -1] = temp;
		 	}
		 	return arr;
		},
		getOptionsFromServer : function(){
			mui.ajax('http://murakami.online/JLearner/getTestWordOptions.php',{
				data:{
					bookName : wordTestInterface.bookName,
					wordID1 : wordTestInterface.options[0],
					wordID2 : wordTestInterface.options[1],
					wordID3 : wordTestInterface.options[2],
					wordID4 : wordTestInterface.options[3],
					correctWordID : wordTestInterface.options[wordTestInterface.correctOption]
				},
				dataType:'json',
				type:'post',
				success:function(data){
					wordTestInterface.currentWord = {
						japanese : data.japaneseCorrect,
						pronun : data.pronunCorrect,
						pronunVoice : data.pronunVoiceCorrect,
						chinese : data.chineseCorrect,
						exampleJapanese : data.exampleJapaneseCorrect,
						exampleChinese : data.exampleChineseCorrect
					}
					wordTestInterface.doGetOptionsSuccess(data);
				},
				error:function(xhr,type,errorThrown){
					//do error things
					mui.toast('服务器获取数据失败。');
				}
			});
		},
		selectedOptions : function(index){
			if(!this.isOptionsTaped){
				if(index === this.correctOption){
					this.isSelectedSuccess.splice(index, 1,true)
				}else{
					this.isSelectedSuccess.splice(this.correctOption, 1,true)
					this.isSelectedError.splice(index, 1,true)
					this.newWords.forEach(function(item){
						if(item.japanese === wordTestInterface.currentWord.japanese){
							wordTestInterface.isNewWordsAdded = true;
						}
					});
					this.addToNewWords();
				}
				this.isOptionsTaped = true;
				this.orderIndex++;
				if(this.orderIndex < 10){
					setTimeout(function(){
						wordTestInterface.isOptionsTaped = false;
						wordTestInterface.testTitle = '';
						wordTestInterface.isSelectedSuccess = [false,false,false,false]
						wordTestInterface.isSelectedError = [false,false,false,false]
						wordTestInterface.testOptions = []
						wordTestInterface.isNewWordsAdded = false;
						wordTestInterface.getOptionsFromServer();
					},500);
				}else{
					setTimeout(function(){
						wordTestInterface.isOptionsTaped = false;
						wordTestInterface.testTitle = '';
						wordTestInterface.isSelectedSuccess = [false,false,false,false]
						wordTestInterface.isSelectedError = [false,false,false,false]
						wordTestInterface.testOptions = []
						wordTestInterface.isNewWordsAdded = false;
						mui.back();
					},700);
				}
			}else{
				return;
			}
		},
		doGetOptionsSuccess : function(data){
			switch(this.randomOrder(this.optionsDesc)[0]){
				case ('japanese-to-chinese') : {
					switch(wordTestInterface.correctOption){
						case (0) : {
							wordTestInterface.testTitle = data.japanese1;
							wordTestInterface.testOptions = [data.chinese1,data.chinese2,data.chinese3,data.chinese4];
							break;
						};
						case (1) : {
							wordTestInterface.testTitle = data.japanese2;
							wordTestInterface.testOptions = [data.chinese1,data.chinese2,data.chinese3,data.chinese4];
							break;
						};
						case (2) : {
							wordTestInterface.testTitle = data.japanese3;
							wordTestInterface.testOptions = [data.chinese1,data.chinese2,data.chinese3,data.chinese4];
							break;
						};
						case (3) : {
							wordTestInterface.testTitle = data.japanese4;
							wordTestInterface.testOptions = [data.chinese1,data.chinese2,data.chinese3,data.chinese4];
							break;
						};
						default:{
							break;
						}
					};
					break;
				}
				case ('chinese-to-japanese') : {
					switch(wordTestInterface.correctOption){
						case (0) : {
							wordTestInterface.testTitle = data.chinese1;
							wordTestInterface.testOptions = [data.japanese1,data.japanese2,data.japanese3,data.japanese4];
							break;
						};
						case (1) : {
							wordTestInterface.testTitle = data.chinese2;
							wordTestInterface.testOptions = [data.japanese1,data.japanese2,data.japanese3,data.japanese4];
							break;
						};
						case (2) : {
							wordTestInterface.testTitle = data.chinese3;
							wordTestInterface.testOptions = [data.japanese1,data.japanese2,data.japanese3,data.japanese4];
							break;
						};
						case (3) : {
							wordTestInterface.testTitle = data.chinese4;
							wordTestInterface.testOptions = [data.japanese1,data.japanese2,data.japanese3,data.japanese4];
							break;
						};
						default:{
							break;
						}
					};
					break;
				}
				case ('japanese-to-pronun') : {
					switch(wordTestInterface.correctOption){
						case (0) : {
							wordTestInterface.testTitle = data.japanese1;
							wordTestInterface.testOptions = [data.pronun1,data.pronun2,data.pronun3,data.pronun4];
							break;
						};
						case (1) : {
							wordTestInterface.testTitle = data.japanese2;
							wordTestInterface.testOptions = [data.pronun1,data.pronun2,data.pronun3,data.pronun4];
							break;
						};
						case (2) : {
							wordTestInterface.testTitle = data.japanese3;
							wordTestInterface.testOptions = [data.pronun1,data.pronun2,data.pronun3,data.pronun4];
							break;
						};
						case (3) : {
							wordTestInterface.testTitle = data.japanese4;
							wordTestInterface.testOptions = [data.pronun1,data.pronun2,data.pronun3,data.pronun4];
							break;
						};
						default:{
							break;
						}
					};
					break;
				}
				case ('pronun-to-japanese') : {
					switch(wordTestInterface.correctOption){
						case (0) : {
							wordTestInterface.testTitle = data.pronun1;
							wordTestInterface.testOptions = [data.japanese1,data.japanese2,data.japanese3,data.japanese4];
							break;
						};
						case (1) : {
							wordTestInterface.testTitle = data.pronun2;
							wordTestInterface.testOptions = [data.japanese1,data.japanese2,data.japanese3,data.japanese4];
							break;
						};
						case (2) : {
							wordTestInterface.testTitle = data.pronun3;
							wordTestInterface.testOptions = [data.japanese1,data.japanese2,data.japanese3,data.japanese4];
							break;
						};
						case (3) : {
							wordTestInterface.testTitle = data.pronun4;
							wordTestInterface.testOptions = [data.japanese1,data.japanese2,data.japanese3,data.japanese4];
							break;
						};
						default:{
							break;
						}
					};
					break;
				};
				default:{
					break;
				}
			}
		},
		addToNewWords : function(){
			if(!this.isNewWordsAdded){
				this.newWords.push({
					userID : parseInt(plus.storage.getItem('userID')),
					wordOfBook : wordTestInterface.bookName,
					japanese : wordTestInterface.currentWord.japanese,
					pronun : wordTestInterface.currentWord.pronun,
					pronunVoice : wordTestInterface.currentWord.pronunVoice,
					chinese : wordTestInterface.currentWord.chinese,
					exampleJapanese : wordTestInterface.currentWord.exampleJapanese,
					exampleChinese : wordTestInterface.currentWord.exampleChinese,
					isNewWordsChinese : false
				});
				if(plus.storage.getItem('userID')){
					mui.ajax('http://murakami.online/JLearner/setNewWordToServer.php',{
						data:{
							userID : parseInt(plus.storage.getItem('userID')),
							wordOfBook : wordTestInterface.bookName,
							japanese : wordTestInterface.currentWord.japanese,
							pronun : wordTestInterface.currentWord.pronun,
							pronunVoice : wordTestInterface.currentWord.pronunVoice,
							chinese : wordTestInterface.currentWord.chinese,
							exampleJapanese : wordTestInterface.currentWord.exampleJapanese,
							exampleChinese : wordTestInterface.currentWord.exampleChinese
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
		}
	},
	computed : {
		bookCountArray : function(){
			var _array = [];
			for(var i = 0; i < this.bookWordsCount ;i++){
				_array[i] = i;
			}
			return _array
		},
		options : function(){
			var _options = [this.words[this.orderIndex].wordID];
			var _tempOptions = this.randomOrder(this.bookCountArray);
			_options[1] = _tempOptions[0];
			_options[2] = _tempOptions[1];
			_options[3] = _tempOptions[2];
			return this.randomOrder(_options);
		},
		correctOption : function(){
			var _correctIndex = 0;
			var _self = this;
			this.options.forEach(function(item,index){
				if(item == _self.words[_self.orderIndex].wordID){
					_correctIndex = index;
				}
			})
			return _correctIndex
		}
	}
})
