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
var login = new Vue({
	el : '#jlearner-login',
	data : {
		userPhoto : 'http://murakami.online/JLearner/userPhoto/userPhotoDefault.png',
		isActive : {
			isPhoneNumberActive : false,
			isPasswordActive : false
		},
		isFirstEdit : {
			phoneNumber : false,
			password : false,
		},
		phoneNumber : '',
		password : ''
	},
	computed : {
		isPhoneNumber : function(){
			return (/^[1-9](\d){10}$/.test(this.phoneNumber));
		},
		isPassword : function(){
			return (/^[a-zA-Z]\w{7,19}$/.test(this.password));
		},
		isPromptPhoneNumber : function(){
			return !this.isPhoneNumber && this.isFirstEdit.phoneNumber;
		},
		isPromptPassword : function(){
			return !this.isPassword && this.isFirstEdit.password;
		},
		isPhoneNumberSuccess : function(){
			return this.isPhoneNumber && this.isFirstEdit.phoneNumber;
		},
		isPasswordSuccess : function(){
			return this.isPassword && this.isFirstEdit.password;
		},
		isPhoneNumberError : function(){
			return this.isPromptPhoneNumber && !this.isActive.isPhoneNumberActive;
		},
		isPasswordError : function(){
			return this.isPromptPassword && !this.isActive.isPasswordActive;
		},
		isLoginInfo : function(){
			return (this.isPhoneNumber && this.isPassword);
		}
	},
	methods : {
		inputRowInput_UserPhoto : function(){
			if(this.isPhoneNumber){
				this.getUserPhotoFromServer();
			}else{
				login.userPhoto = "http://murakami.online/JLearner/userPhoto/userPhotoDefault.png";
			}
		},
		inputRowFocus : function(event){
			var target = event.target;
			switch(target.id){
				case ('phone-number') : {
					this.isActive.isPhoneNumberActive = true;
					break;
				};
				case ('password') : {
					this.isActive.isPasswordActive = true;
					break;
				};
				default : {
					break;
				}
			}
		},
		inputRowBlur : function(event){
			var target = event.target;
			switch(target.id){
				case ('phone-number') : {
					this.isActive.isPhoneNumberActive = false;
					this.isFirstEdit.phoneNumber = true;
					break;
				};
				case ('password') : {
					this.isActive.isPasswordActive = false;
					this.isFirstEdit.password = true;
					break;
				};
				default : {
					break;
				}
			}
		},
		getUserPhotoFromServer : function(){
			var _self = this;
			mui.ajax('http://murakami.online/JLearner/getUserPhoto.php',{
				data:{
					phoneNumber : _self.phoneNumber
				},
				dataType:'json',
				type:'post',
				success:function(data){
					if(data.result === 'success'){
						login.userPhoto = data.userPhoto;
					}
				},
				error:function(xhr,type,errorThrown){
					//do error things
					mui.toast('网络未连接。');
				}
			});
		},
		loginJLearner : function(){
			var _self = this;
			mui(mui('#login')[0]).button('loading');
			document.getElementById('phone-number').blur();
			document.getElementById('password').blur();
			if(this.isLoginInfo){
				mui.ajax('http://murakami.online/JLearner/login.php',{
					data:{
						phoneNumber : _self.phoneNumber,
						password : _self.password
					},
					dataType:'json',
					type:'post',
					success:function(data){
						if(data.result === 'success'){
							plus.storage.setItem('userID',data.userID);
							setTimeout(function() {
						        mui(mui('#login')[0]).button('reset');
						    }, 500);
							mui.alert('登录成功，欢迎使用JLearner。祝您学习愉快！','JLearner','确定',function(){
								var webviewContent = plus.webview.getWebviewById('jlearner.html');
				        		webviewContent.close('pop-out',0);
				        		var webviewContentCurrent = plus.webview.create('jlearner.html',
								'jlearner.html');
								webviewContentCurrent.addEventListener("rendered", function(){
						    		webviewContentCurrent.show("pop-in",200);
								}, false);
							});
						}else{
							setTimeout(function() {
						        mui(mui('#login')[0]).button('reset');
						    }, 500);
							mui.alert('用户名或密码错误，请重试。','JLearner','确定',null);
						}
					},
					error:function(xhr,type,errorThrown){
						//do error things
						setTimeout(function() {
					        mui(mui('#login')[0]).button('reset');
					    }, 500);
						mui.toast('网络未连接。');
					}
				});
			}else{
				setTimeout(function() {
			        mui(mui('#login')[0]).button('reset');
			    }, 500);
				mui.toast('用户信息填写有误。');
			}
		}
	}
});
