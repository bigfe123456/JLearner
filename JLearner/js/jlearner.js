mui.init();
window.addEventListener('drawCavas',function(event){
	jlearnerMain.currentBook.learnedWordsCount = event.detail.learnedWordsCount;
	jlearnerMain.newWords = event.detail.newWords;
	jlearnerMain.currentBook.leaveWordsCount = jlearnerMain.currentBook.bookWordsCount - jlearnerMain.currentBook.learnedWordsCount;
	jlearnerMain.changeUserInfo();
	canvasInterface.distroyCanvas();
	canvasInterface.drawCanvas();
},false);
window.addEventListener('drawCavasFromRegisterOrLogin',function(event){
	canvasInterface.distroyCanvas();
	canvasInterface.drawCanvas();
},false);
window.addEventListener('refreshNewWords',function(event){
	jlearnerMain.newWords = event.detail.newWords;
	canvasInterface.distroyCanvas();
	canvasInterface.drawCanvas();
},false);
window.addEventListener('refreshUserInfo',function(event){
	var _userInfo = event.detail.userInfo;
	jlearnerMain.user.photo = _userInfo.photo;
	jlearnerMain.user.nickname = _userInfo.nickname;
	jlearnerMain.user.password = _userInfo.password;
	jlearnerMain.user.sex = _userInfo.sex;
	jlearnerMain.user.birthday = _userInfo.birthday;
	jlearnerMain.user.address = _userInfo.address;
},false);
mui.plusReady(function(){
	jlearnerMain.user.userID = parseInt(plus.storage.getItem('userID'));
	jlearnerMain.isValidUser.isValid = !!plus.storage.getItem('userID');
	jlearnerMain.isValidUser.isDialogShow = !plus.storage.getItem('isDialogShow');
	jlearnerMain.isNeedVoice = !plus.storage.getItem('isNeedVoice');
	jlearnerMain.isNotNeedTest = !!plus.storage.getItem('isNotNeedTest');
	jlearnerMain.getUserInfoFromServer();
});
var jlearnerMain = new Vue({
	el : '#mui-jlearner-main',
	data : {
		isHomeActive : true,
		isBooksActive : false,
		isNewWordsActive : false,
		newWords : [],
		newWordVoice : new Audio(),
		lastNewWordIndex : 0,
		user : {
			userID : 0,
			photo : 'http://murakami.online/JLearner/userPhoto/userPhotoDefault.png',
			phoneNumber : 'xxxxxxxxxxx',
			nickname : 'JLearner用户',
			password : 'xxxxxxxx',
			sex : '男',
			birthday : '未知',
			address : '未知',
			countOfN5 : 0,
			countOfN4 : 0,
			countOfN3 : 0,
			countOfN2 : 0,
			countOfN1 : 0
		},
		sumCount : {
			countOfN5 : 887,
			countOfN4 : 1486,
			countOfN3 : 703,
			countOfN2 : 4398,
			countOfN1 : 9197
		},
		selectedBookFlag : 1,
		currentBook : {
			bookName : '新标准日本语N1词汇',
			bookWordsCount : 9197,
			learnedWordsCount : 0,
			leaveWordsCount : 0,
			newWordsCount : 0
		},
		isShowDetailedInfo : false,
		isValidUser : {
			isValid : false,
			isDialogShow : true
		},
		bookAngle : 0,
		isShowNewWordsJapaneseN5 : true,
		isShowNewWordsJapaneseN4 : true,
		isShowNewWordsJapaneseN3 : true,
		isShowNewWordsJapaneseN2 : true,
		isShowNewWordsJapaneseN1 : true,
		isNeedVoice : true,
		isNotNeedTest : false,
		currentTemperature : 20
	},
	methods : {
		changeUserInfo : function(){
			switch(jlearnerMain.currentBook.bookName){
				case ('新标准日本语N5词汇') : {
					jlearnerMain.user.countOfN5 = jlearnerMain.currentBook.learnedWordsCount;
					break;
				};
				case ('新标准日本语N4词汇') : {
					jlearnerMain.user.countOfN4 = jlearnerMain.currentBook.learnedWordsCount;
					break;
				};
				case ('新标准日本语N3词汇') : {
					jlearnerMain.user.countOfN3 = jlearnerMain.currentBook.learnedWordsCount;
				};
				case ('新标准日本语N2词汇') : {
					jlearnerMain.user.countOfN2 = jlearnerMain.currentBook.learnedWordsCount;
					break;
				};
				case ('新标准日本语N1词汇') : {
					jlearnerMain.user.countOfN1 = jlearnerMain.currentBook.learnedWordsCount;
					break;
				};
				default : {
					break;
				}
			};
		},
		changeMain : function(symbol){
			switch(symbol){
				case ('home') : {
					this.isHomeActive = true;
					this.isBooksActive = false;
					this.isNewWordsActive = false;
					break;
				};
				case ('books') : {
					this.isHomeActive = false;
					this.isBooksActive = true;
					this.isNewWordsActive = false;
					break;
				};
				case ('newWords') : {
					this.isHomeActive = false;
					this.isBooksActive = false;
					this.isNewWordsActive = true;
					break;
				};
				default : {
					break;
				}
			}
		},
		changeBookDown : function(){
			if(this.selectedBookFlag === 1){
				this.selectedBookFlag = 5;
			}else{
				this.selectedBookFlag --;
			}
			this.changeBookAngle('down');
		},
		changeBookUp : function(){
			if(this.selectedBookFlag === 5){
				this.selectedBookFlag = 1;
			}else{
				this.selectedBookFlag ++;
			}
			this.changeBookAngle('up');
		},
		toggleContent : function(index){
			this.NewWordsShow[index].isNewWordsChinese = !this.NewWordsShow[index].isNewWordsChinese;
			if(this.isNeedVoice){
				if(this.NewWordsShow[index].isNewWordsChinese){
					if(this.lastNewWordIndex !== index){
						this.newWordVoice.pause();
					}
				    this.lastNewWordIndex = index;
				    this.newWordVoice.src = this.NewWordsShow[index].pronunVoice;
				    this.newWordVoice.play();
				}
			}
		},
		changeCurrentBook : function(){
			mui(mui('#change-current-book')[0]).button('loading');
			setTimeout(function() {
		        mui(mui('#change-current-book')[0]).button('reset');
		    }, 500);
			this.currentBook = this.selectedBook;
			if(this.isValidUser.isValid){
				mui.ajax('http://murakami.online/JLearner/setCurrentBookName.php',{
					data:{
						userID : jlearnerMain.user.userID,
						currentBookName : jlearnerMain.currentBook.bookName
					},
					dataType:'json',
					type:'post',
					success:function(data){
					},
					error:function(xhr,type,errorThrown){
						//do error things
						mui.toast('数据同步服务器失败。');
					}
				});
			}
			canvasInterface.distroyCanvas();
			canvasInterface.drawCanvas();
		},
		toggleOffCanvasWrap : function(){
			mui('.mui-off-canvas-wrap').offCanvas().toggle();
		},
		toggleDetailedInfo : function(){
			this.isShowDetailedInfo = !this.isShowDetailedInfo;
		},
		startWordInterface : function(){
			var _self = this;
			var webviewContent = plus.webview.create('wordInterface.html',
								'wordInterface.html',{},{
									bookName : _self.currentBook.bookName,
									bookWordsCount : _self.currentBook.bookWordsCount,
									learnedWordsCount : _self.currentBook.learnedWordsCount,
									newWords :  _self.newWords
								});
			webviewContent.addEventListener("rendered", function(){
	    		webviewContent.show("pop-in",200);
			}, false);
		},
		registerJLearner : function(){
			var webviewContent = plus.webview.create('register.html',
								'register.html');
			webviewContent.addEventListener("rendered", function(){
	    		webviewContent.show("pop-in",200);
			}, false);
		},
		loginJLearner : function(){
			var webviewContent = plus.webview.create('login.html',
							'login.html');
			webviewContent.addEventListener("rendered", function(){
        		webviewContent.show("pop-in",200);
    		}, false);
		},
		getUserInfoFromServer : function(){
			if(!this.isValidUser.isValid){
				if(this.isValidUser.isDialogShow){
					mui.confirm('你尚未登陆，你的操作将无法保存至服务器，请登录。','JLearner',['确定','不再提示'],function(e){
						if(e.index === 1){
							jlearnerMain.isValidUser.isDialogShow = false;
							plus.storage.setItem('isDialogShow','false');
						}else{
							mui('.mui-off-canvas-wrap').offCanvas().show();
						}
					});
				}
				canvasInterface.drawCanvas();
				return;
			}
			mui.ajax('http://murakami.online/JLearner/getUserInfo.php',{
				data:{
					userID : jlearnerMain.user.userID
				},
				dataType:'json',
				type:'post',
				success:function(data){
					data.forEach(function(item,index){
						if(index === 0){
							jlearnerMain.user.photo = item.photo;
							jlearnerMain.user.phoneNumber = item.phoneNumber;
							jlearnerMain.user.nickname = item.nickname;
							jlearnerMain.user.password = item.password;
							jlearnerMain.user.sex = item.sex;
							jlearnerMain.user.birthday = item.birthday;
							jlearnerMain.user.address = item.address;  
							jlearnerMain.user.countOfN5 = parseInt(item.countOfN5);
							jlearnerMain.user.countOfN4 = parseInt(item.countOfN4);
							jlearnerMain.user.countOfN3 = parseInt(item.countOfN3);
							jlearnerMain.user.countOfN2 = parseInt(item.countOfN2);
							jlearnerMain.user.countOfN1 = parseInt(item.countOfN1);
							jlearnerMain.currentBook.bookName = item.currentBookName;
						}else if(index === 1){
							jlearnerMain.sumCount.countOfN5 = item;
						}else if(index === 2){
							jlearnerMain.sumCount.countOfN4 = item;
						}else if(index === 3){
							jlearnerMain.sumCount.countOfN3 = item;
						}else if(index === 4){
							jlearnerMain.sumCount.countOfN2 = item;
						}else if(index === 5){
							jlearnerMain.sumCount.countOfN1 = item;
						}else{
							jlearnerMain.newWords.push({
								wordOfBook : item.wordOfBook,
								japanese : item.japanese,
								pronun : item.pronun,
								pronunVoice : item.pronunVoice,
								chinese : item.chinese,
								exampleJapanese : item.exampleJapanese,
								exampleChinese : item.exampleChinese,
								isNewWordsChinese : false
							});
						}
					});
					switch(jlearnerMain.currentBook.bookName){
						case ('新标准日本语N5词汇') : {
							jlearnerMain.currentBook.bookWordsCount = jlearnerMain.sumCount.countOfN5;
							jlearnerMain.currentBook.learnedWordsCount = jlearnerMain.user.countOfN5;
							jlearnerMain.currentBook.leaveWordsCount = jlearnerMain.sumCount.countOfN5 - jlearnerMain.user.countOfN5;
							jlearnerMain.currentBook.newWordsCount = jlearnerMain.newWords.filter(function(item){
								if(item.wordOfBook === 'japaneseN5'){
									return item;
								}
							}).length;
							jlearnerMain.selectedBookFlag = 2;
							jlearnerMain.bookAngle = 72;
							break;
						};
						case ('新标准日本语N4词汇') : {
							jlearnerMain.currentBook.bookWordsCount = jlearnerMain.sumCount.countOfN4;
							jlearnerMain.currentBook.learnedWordsCount = jlearnerMain.user.countOfN4;
							jlearnerMain.currentBook.leaveWordsCount = jlearnerMain.sumCount.countOfN4 - jlearnerMain.user.countOfN4;
							jlearnerMain.currentBook.newWordsCount = jlearnerMain.newWords.filter(function(item){
								if(item.wordOfBook === 'japaneseN4'){
									return item;
								}
							}).length;
							jlearnerMain.selectedBookFlag = 3;
							jlearnerMain.bookAngle = 144;
							break;
						};
						case ('新标准日本语N3词汇') : {
							jlearnerMain.currentBook.bookWordsCount = jlearnerMain.sumCount.countOfN3;
							jlearnerMain.currentBook.learnedWordsCount = jlearnerMain.user.countOfN3;
							jlearnerMain.currentBook.leaveWordsCount = jlearnerMain.sumCount.countOfN3 - jlearnerMain.user.countOfN3;
							jlearnerMain.currentBook.newWordsCount = jlearnerMain.newWords.filter(function(item){
								if(item.wordOfBook === 'japaneseN3'){
									return item;
								}
							}).length;
							jlearnerMain.selectedBookFlag = 4;
							jlearnerMain.bookAngle = 216;
							break;
						};
						case ('新标准日本语N2词汇') : {
							jlearnerMain.currentBook.bookWordsCount = jlearnerMain.sumCount.countOfN2;
							jlearnerMain.currentBook.learnedWordsCount = jlearnerMain.user.countOfN2;
							jlearnerMain.currentBook.leaveWordsCount = jlearnerMain.sumCount.countOfN2 - jlearnerMain.user.countOfN2;
							jlearnerMain.currentBook.newWordsCount = jlearnerMain.newWords.filter(function(item){
								if(item.wordOfBook === 'japaneseN2'){
									return item;
								}
							}).length;
							jlearnerMain.selectedBookFlag = 5;
							jlearnerMain.bookAngle = -72;
							break;
						};
						case ('新标准日本语N1词汇') : {
							
							jlearnerMain.currentBook.bookWordsCount = jlearnerMain.sumCount.countOfN1;
							jlearnerMain.currentBook.learnedWordsCount = jlearnerMain.user.countOfN1;
							jlearnerMain.currentBook.leaveWordsCount = jlearnerMain.sumCount.countOfN1 - jlearnerMain.user.countOfN1;
							jlearnerMain.currentBook.newWordsCount = jlearnerMain.newWords.filter(function(item){
								if(item.wordOfBook === 'japaneseN1'){
									return item;
								}
							}).length;
							jlearnerMain.selectedBookFlag = 1;
							jlearnerMain.bookAngle = 0;
							break;
						};
						default : {
							break;
						}
					}
					jlearnerMain.getWeatherFromSina();
					canvasInterface.drawCanvas();
				},
				error:function(xhr,type,errorThrown){
					mui.toast('网络未连接。');
				}
			});
		},
		changeBookAngle : function(direction){
			if(direction === 'up'){
				this.bookAngle += 72;
			}else{
				this.bookAngle -= 72;
			}
		},
		toggleNewWordsShow : function(symbol){
			switch(symbol){
				case ('japaneseN1') : {
					this.isShowNewWordsJapaneseN1 = !this.isShowNewWordsJapaneseN1;
					break;
				};
				case ('japaneseN2') : {
					this.isShowNewWordsJapaneseN2 = !this.isShowNewWordsJapaneseN2;
					break;
				};
				case ('japaneseN3') : {
					this.isShowNewWordsJapaneseN3 = !this.isShowNewWordsJapaneseN3;
					break;
				};
				case ('japaneseN4') : {
					this.isShowNewWordsJapaneseN4 = !this.isShowNewWordsJapaneseN4;
					break;
				};
				case ('japaneseN5') : {
					this.isShowNewWordsJapaneseN5 = !this.isShowNewWordsJapaneseN5;
					break;
				};
				default : {
					break;
				}
			}
		},
		openNewWordInterface : function(currentNewWord){
			var _self = this;
			var webviewContent = plus.webview.create('newWordInterface.html',
								'newWordInterface.html',{},{
									newWordsShow : _self.NewWordsShow,
									currentNewWord : currentNewWord,
									newWords :  _self.newWords
								});
			webviewContent.addEventListener("loaded", function(){
	    		webviewContent.show("pop-in",200);
			}, false);
		},
		translateJapanese : function(){
			var _self = this;
			var webviewContent = plus.webview.create('translate.html',
								'translate.html');
			webviewContent.addEventListener("rendered", function(){
	    		webviewContent.show("pop-in",200);
			}, false);
		},
		changeIsNeedVoice : function(event){
			if(event.detail.isActive){
				plus.storage.removeItem('isNeedVoice');
				this.isNeedVoice = true;
			}else{
				plus.storage.setItem('isNeedVoice','true');
				this.isNeedVoice = false;
			}
		},
		cancelUserInfo : function(){
			plus.storage.clear();
			this.newWords = [];
			lastNewWordIndex = 0;
			this.user = {
				userID : 0,
				photo : 'http://murakami.online/JLearner/userPhoto/userPhotoDefault.png',
				phoneNumber : 'xxxxxxxxxxx',
				nickname : 'JLearner用户',
				password : 'xxxxxxxx',
				sex : '男',
				birthday : '未知',
				address : '未知',
				countOfN5 : 0,
				countOfN4 : 0,
				countOfN3 : 0,
				countOfN2 : 0,
				countOfN1 : 0
			};
			this.selectedBookFlag = 1;
			this.currentBook = {
				bookName : '新标准日本语N1词汇',
				bookWordsCount : jlearnerMain.sumCount.countOfN1,
				learnedWordsCount : 0,
				leaveWordsCount : 0,
				newWordsCount : 0
			};
			this.isShowDetailedInfo = false;
			this.isValidUser = {
				isValid : false,
				isDialogShow : true
			};
			this.bookAngle = 0;
			this.isShowNewWordsJapaneseN5 = true;
			this.isShowNewWordsJapaneseN4 = true;
			this.isShowNewWordsJapaneseN3 = true;
			this.isShowNewWordsJapaneseN2 = true;
			this.isShowNewWordsJapaneseN1 = true;
			this.isNeedVoice = true;
			this.currentTemperature = 20;
			canvasInterface.distroyCanvas();
			canvasInterface.drawCanvas();
		},
		changeIsNotNeedTest : function(event){
			if(event.detail.isActive){
				plus.storage.setItem('isNotNeedTest','true');
				this.isNeedTest = true;
			}else{
				plus.storage.removeItem('isNotNeedTest');
				this.isNeedTest = false;
			}
		},
		getWeatherFromSina : function(){
			var _address = this.user.address.split('-');
			var _city = '上海';
			if(_address.length === 3){
				_city = _address[1];
			}else if(_address.length === 2){
				_city = _address[0];
			}else{
				
			}
			mui.ajax('http://wthrcdn.etouch.cn/weather_mini',{
				data:{
					city : _city,
				},
				dataType:'json',
				type:'get',
				success:function(data){
					jlearnerMain.currentTemperature = data.data.wendu;
				},
				error:function(xhr,type,errorThrown){
					//do error things
					mui.toast('网络未连接。');
				}
			});
		},
		openChangeUserInfo : function(){
			var webviewContent = plus.webview.create('changeUserInfo.html',
								'changeUserInfo.html',{},{
									user : jlearnerMain.user
								});
			webviewContent.addEventListener("rendered", function(){
	    		webviewContent.show("pop-in",200);
			}, false);
		},
		openFeedback : function(){
			var webviewContent = plus.webview.create('feedback.html',
								'feedback.html');
			webviewContent.addEventListener("rendered", function(){
	    		webviewContent.show("pop-in",200);
			}, false);
		},
		openAboutJLearner : function(){
			var webviewContent = plus.webview.create('aboutJLearner.html',
								'aboutJLearner.html');
			webviewContent.addEventListener("rendered", function(){
	    		webviewContent.show("pop-in",200);
			}, false);
		}
	},
	computed : {
		countOfNewWords : function(){
			return (this.newWords.length);
		},
		bookTransform : function(){
			return (`rotateZ(-90deg) rotateY(${this.bookAngle}deg)`)
		},
		selectedBook : function(){
			var _selectedBook = {};
			switch(this.selectedBookFlag){
				case (1) : {
					_selectedBook.bookName = '新标准日本语N1词汇';
					_selectedBook.bookWordsCount = this.sumCount.countOfN1;
					_selectedBook.learnedWordsCount = this.user.countOfN1;
					_selectedBook.leaveWordsCount = this.sumCount.countOfN1 - this.user.countOfN1;
					_selectedBook.newWordsCount = this.newWords.filter(function(item){
						if(item.wordOfBook === 'japaneseN1'){
							return item;
						}
					}).length;
					break;
				};
				case (2) : {
					_selectedBook.bookName = '新标准日本语N5词汇';
					_selectedBook.bookWordsCount = this.sumCount.countOfN5;
					_selectedBook.learnedWordsCount = this.user.countOfN5;
					_selectedBook.leaveWordsCount = this.sumCount.countOfN5 - this.user.countOfN5;
					_selectedBook.newWordsCount = this.newWords.filter(function(item){
						if(item.wordOfBook === 'japaneseN5'){
							return item;
						}
					}).length;
					break;
				};
				case (3) : {
					_selectedBook.bookName = '新标准日本语N4词汇';
					_selectedBook.bookWordsCount = this.sumCount.countOfN4;
					_selectedBook.learnedWordsCount = this.user.countOfN4;
					_selectedBook.leaveWordsCount = this.sumCount.countOfN4 - this.user.countOfN4;
					_selectedBook.newWordsCount = this.newWords.filter(function(item){
						if(item.wordOfBook === 'japaneseN4'){
							return item;
						}
					}).length;
					break;
				};
				case (4) : {
					_selectedBook.bookName = '新标准日本语N3词汇';
					_selectedBook.bookWordsCount = this.sumCount.countOfN3;
					_selectedBook.learnedWordsCount = this.user.countOfN3;
					_selectedBook.leaveWordsCount = this.sumCount.countOfN3 - this.user.countOfN3;
					_selectedBook.newWordsCount = this.newWords.filter(function(item){
						if(item.wordOfBook === 'japaneseN3'){
							return item;
						}
					}).length;
					break;
				};
				case (5) : {
					_selectedBook.bookName = '新标准日本语N2词汇';
					_selectedBook.bookWordsCount = this.sumCount.countOfN2;
					_selectedBook.learnedWordsCount = this.user.countOfN2;
					_selectedBook.leaveWordsCount = this.sumCount.countOfN2 - this.user.countOfN2;
					_selectedBook.newWordsCount = this.newWords.filter(function(item){
						if(item.wordOfBook === 'japaneseN2'){
							return item;
						}
					}).length;
					break;
				};
				default : {
					break;
				};
			};
			return _selectedBook;
		},
		jlearnerTitle : function(){
			var _title = '';
			if(this.isHomeActive){
				_title = this.currentBook.bookName;
			}
			if(this.isBooksActive){
				_title = '词书列表';
			}
			if(this.isNewWordsActive){
				_title = '生词本';
			}
			return _title;
		},
		age : function(){
			var _now = new Date();
			return (this.user.birthday === '未知'?'未知':_now.getFullYear() - parseInt(this.user.birthday.split('年')[0]));
//			return (_now.getFullYear() - parseInt(this.user.birthday.split('年')[0]));
		},
		learnedWords : function(){
			return parseInt(this.user.countOfN5 + this.user.countOfN4 + this.user.countOfN3 + this.user.countOfN2 + this.user.countOfN1);
		},
		address : function(){
			return (this.user.address.split('-').length === 3?this.user.address.split('-')[1]:this.user.address.split('-')[0]);
		},
		NewWordsShow : function(){
			var _newWordsShow = [];
			var _self = this;
			_newWordsShow = this.newWords.filter(function(item){
				if(_self.isShowNewWordsJapaneseN5 && item.wordOfBook === 'japaneseN5'){
					return item;
				}else if(_self.isShowNewWordsJapaneseN4 && item.wordOfBook === 'japaneseN4'){
					return item;
				}else if(_self.isShowNewWordsJapaneseN3 && item.wordOfBook === 'japaneseN3'){
					return item;
				}else if(_self.isShowNewWordsJapaneseN2 && item.wordOfBook === 'japaneseN2'){
					return item;
				}else if(_self.isShowNewWordsJapaneseN1 && item.wordOfBook === 'japaneseN1'){
					return item;
				}else{
					
				}
			});
			return _newWordsShow;
		}
	}
});
var canvasInterface = {
	context : mui('#mui-start-interface')[0].getContext('2d'),
	drawCanvas : function(){
		var _percentOfWords = jlearnerMain.currentBook.learnedWordsCount / jlearnerMain.currentBook.bookWordsCount;
		canvasInterface.context.beginPath();
		canvasInterface.context.strokeStyle = '#82d5f3';
		canvasInterface.context.lineWidth = 8;
		canvasInterface.context.arc(150,200,120,0.75*Math.PI,2.25*Math.PI);
		canvasInterface.context.stroke();
		canvasInterface.context.closePath();
		canvasInterface.context.beginPath();
		canvasInterface.context.strokeStyle = '#fec803';
		canvasInterface.context.lineWidth = 8;
		canvasInterface.context.arc(150,200,120,0.75*Math.PI,(0.75+1.5*_percentOfWords)*Math.PI);
		canvasInterface.context.stroke();
		canvasInterface.context.closePath();
	},
	distroyCanvas : function(){
		canvasInterface.context.clearRect(20,70,260,260);
	}
};
mui('.mui-scroll-wrapper').scroll();
var first = null,_old_back = mui.back;
mui.back = function() {
    if (!first) {//首次按键，提示‘再按一次退出应用’
        first = (new Date()).getTime();
        mui.toast('再按一次退出应用');
        setTimeout(function() {
            first = null;
        }, 1000);
    } else {
        if ((new Date()).getTime() - first < 1000) {
            plus.runtime.quit();
        }
    }
};