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
window.addEventListener('setUserPhoto',function(event){
	jlearnerForm.userPhoto = event.detail.path;
},false);
var jlearnerForm = new Vue({
	el : '#jlearner-form',
	data : {
		phoneNumber : '',
		nickname : '',
		password : '',
		passwordConfirm : '',
		sex : '男',
		birthday : '你的生日 ...',
		address : '你的地址 ...',
		userPhoto : 'http://murakami.online/JLearner/userPhoto/userPhotoDefault.png',
		isActive : {
			isPhoneNumberActive : false,
			isNicknameActive : false,
			isPasswordActive : false,
			isPasswordConfirmActive : false
		},
		isFirstEdit : {
			phoneNumber : false,
			nickname : false,
			password : false,
			passwordConfirm : false
		},
		isMan : true,
		dateRange : {
			type : "date",
			beginDate : new Date(1970,1,1),
			endDate : new Date()
		},
		isRepeatPhoneNumber : false,
		isRepeatNickname : false,
	},
	methods : {
		inputRowFocus : function(event){
			var target = event.target;
			var _self = this;
			switch(target.id){
				case ('phone-number') : {
					this.isActive.isPhoneNumberActive = true;
					break;
				};
				case ('nickname') : {
					this.isActive.isNicknameActive = true;
					break;
				};
				case ('password') : {
					this.isActive.isPasswordActive = true;
					break;
				};
				case ('password-confirm') : {
					this.isActive.isPasswordConfirmActive = true;
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
				case ('nickname') : {
					this.isActive.isNicknameActive = false;
					this.isFirstEdit.nickname = true;
					break;
				};
				case ('password') : {
					this.isActive.isPasswordActive = false;
					this.isFirstEdit.password = true;
					break;
				};
				case ('password-confirm') : {
					this.isActive.isPasswordConfirmActive = false;
					this.isFirstEdit.passwordConfirm = true;
					break;
				};
				default : {
					break;
				}
			}
		},
		isRepeatPhoneNumberFromServer : function(){
			var _self = this;
			mui.ajax('http://murakami.online/JLearner/isRepeatPhoneNumber.php',{
				data:{
					phoneNumber : _self.phoneNumber
				},
				dataType:'json',
				type:'post',
				success:function(data){
					if(parseInt(data.result) > 0){
						jlearnerForm.isRepeatPhoneNumber = true;
					}else{
						jlearnerForm.isRepeatPhoneNumber = false;
					}
				},
				error:function(xhr,type,errorThrown){
					//do error things
					mui.toast('网络未连接。');
				}
			});
		},
		isRepeatNicknameFromServer : function(){
			var _self = this;
			mui.ajax('http://murakami.online/JLearner/isRepeatNickname.php',{
				data:{
					nickname : _self.nickname
				},
				dataType:'json',
				type:'post',
				success:function(data){
					if(parseInt(data.result) > 0){
						jlearnerForm.isRepeatNickname = true;
					}else{
						jlearnerForm.isRepeatNickname = false;
					}
				},
				error:function(xhr,type,errorThrown){
					//do error things
					mui.toast('网络未连接。');
				}
			});
		},
		selectedSex : function(sex){
			if(sex === '男'){
				this.isMan = true;
			}else{
				this.isMan = false;
			}
			this.sex = sex;
		},
		selectedBirthday : function(){
			var picker = new mui.DtPicker(jlearnerForm.dateRange);
			picker.show(function(rs) {
				jlearnerForm.birthday = `你的生日是:${rs.y.text}年${rs.m.text}月${rs.d.text}日`;
				picker.dispose();
			});
		},
		selectedAddress : function(){
			var cityPicker = new mui.PopPicker({
				layer: 3
			});
			cityPicker.setData(cityData3);
			cityPicker.show(function(items) {
				if(items[2].text === undefined){
					jlearnerForm.address = `你的地址是:${items[0].text}`;
				}else if(items[0].text === items[1].text){
					jlearnerForm.address = `你的地址是:${items[0].text}-${items[2].text}`;
				}else{
					jlearnerForm.address = `你的地址是:${items[0].text}-${items[1].text}-${items[2].text}`;
				}
			});
		},
		selectedPhoto : function(){
			plus.nativeUI.actionSheet({
				title : '操作头像',
				cancel : '取消',
				buttons : [
					{
						title : '拍照'
					},
					{
						title : '从相册选择头像'
					},
					{
						title : '查看大图'
					}
				]
			},function(event){
				switch(event.index){
					case (0) : {
						break;
					};
					case (1) : {
						var cmr = plus.camera.getCamera();
						cmr.captureImage(function(p) {
							plus.io.resolveLocalFileSystemURL(p, function(entry) {
							var webviewContent = plus.webview.create('pictureHandle.html',
												'pictureHandle.html',{},{
													path : "file:///" + entry.fullPath
												});
							webviewContent.addEventListener("rendered", function(){
				        		webviewContent.show("pop-in",200);
				    		}, false);
						}, function(e){
						});
						}, function(e) {
						}, {
							filename: "_doc/camera/"
						});
						break;
					};
					case (2) : {
						plus.gallery.pick(function(url) {
							var webviewContent = plus.webview.create('pictureHandle.html',
												'pictureHandle.html',{},{
													path : url
												});
							webviewContent.addEventListener("rendered", function(){
				        		webviewContent.show("pop-in",200);
				    		}, false);
						}, function(error) {
						});
						break;
					};
					case (3) : {
						var webviewContent = plus.webview.create('pictureView.html',
											'pictureView.html',{},{
												path : jlearnerForm.userPhoto
											});
						webviewContent.addEventListener("rendered", function(){
			        		webviewContent.show("pop-in",200);
			    		}, false);
						break;
					};
					default : {
						break;
					}
				}
			});
		},
		registerJLearner : function(){
			var _self = this;
			mui(mui('#register')[0]).button('loading');
			document.getElementById('phone-number').blur();
			document.getElementById('nickname').blur();
			document.getElementById('password').blur();
			document.getElementById('password-confirm').blur();
			if(this.isRegisterInfo){
				mui.ajax('http://murakami.online/JLearner/register.php',{
					data:{
						photo : _self.userPhoto,
						phoneNumber : _self.phoneNumber,
						nickname : _self.nickname,
						password : _self.password,
						sex : _self.sex,
						birthday : _self.birthday.split(':')[1] || "未设置",
						address : _self.address.split(':')[1] || "未设置"
					},
					dataType:'json',
					type:'post',
					success:function(data){
						if(data.result){
							setTimeout(function() {
						        mui(mui('#register')[0]).button('reset');
						    }, 500);
							mui.alert('注册成功，欢迎使用JLearner。祝您学习愉快！','JLearner','确定',function(){
								jlearnerForm.userPhoto = 'http://murakami.online/JLearner/userPhoto/userPhotoDefault.png';
								jlearnerForm.phoneNumber = '';
								jlearnerForm.nickname = '';
								jlearnerForm.password = '';
								jlearnerForm.passwordConfirm = '';
								jlearnerForm.sex = '男';
								jlearnerForm.isMan = true;
								jlearnerForm.birthday = '你的生日 ...';
								jlearnerForm.address = '你的地址 ...';
								jlearnerForm.isFirstEdit.phoneNumber = false;
								jlearnerForm.isFirstEdit.nickname = false;
								jlearnerForm.isFirstEdit.password = false;
								jlearnerForm.isFirstEdit.passwordConfirm = false;
								var webviewContent = plus.webview.create('login.html',
												'login.html');
								webviewContent.addEventListener("rendered", function(){
					        		webviewContent.show("pop-in",200);
					    		}, false);
							});
						}else{
							setTimeout(function() {
						        mui(mui('#register')[0]).button('reset');
						    }, 500);
							mui.alert('服务器打盹，请重试。','JLearner','确定',null);
						}
					},
					error:function(xhr,type,errorThrown){
						//do error things
						setTimeout(function() {
					        mui(mui('#register')[0]).button('reset');
					    }, 500);
						mui.toast('网络未连接。');
					}
				});
			}else{
				setTimeout(function() {
			        mui(mui('#register')[0]).button('reset');
			    }, 500);
				mui.toast('用户信息填写有误。');
			}
		},
		inputRowInput : function(event){
			var _target = event.target;
			switch(_target.id){
				case ('phone-number') : {
					this.isRepeatPhoneNumberFromServer();
					break;
				};
				case ('nickname') : {
					this.isRepeatNicknameFromServer();
					break;
				};
				default : {
					break;
				}
			}
		}
	},
	computed : {
		isPhoneNumber : function(){
			return ((/^[1-9](\d){10}$/.test(this.phoneNumber)) && !jlearnerForm.isRepeatPhoneNumber);
		},
		isNickname : function(){
			return ((this.nickname.length >= 3 && jlearnerForm.nickname.length <= 16) && !jlearnerForm.isRepeatNickname);
		},
		isPassword : function(){
			return (/^[a-zA-Z]\w{7,19}$/.test(this.password));
		},
		isPasswordConfirm : function(){
			return ((this.password === this.passwordConfirm) && this.isPassword);
		},
		isPromptPhoneNumber : function(){
			return !this.isPhoneNumber && this.isFirstEdit.phoneNumber;
		},
		isPromptNickname : function(){
			return !this.isNickname && this.isFirstEdit.nickname;
		},
		isPromptPassword : function(){
			return !this.isPassword && this.isFirstEdit.password;
		},
		isPromptPasswordConfirm : function(){
			return !this.isPasswordConfirm && this.isFirstEdit.passwordConfirm;
		},
		isPhoneNumberSuccess : function(){
			return this.isPhoneNumber && this.isFirstEdit.phoneNumber;
		},
		isNicknameSuccess : function(){
			return this.isNickname && this.isFirstEdit.nickname;
		},
		isPasswordSuccess : function(){
			return this.isPassword && this.isFirstEdit.password;
		},
		isPasswordConfirmSuccess : function(){
			return this.isPasswordConfirm && this.isFirstEdit.passwordConfirm;
		},
		isPhoneNumberError : function(){
			return this.isPromptPhoneNumber && !this.isActive.isPhoneNumberActive;
		},
		isNicknameError : function(){
			return this.isPromptNickname && !this.isActive.isNicknameActive;
		},
		isPasswordError : function(){
			return this.isPromptPassword && !this.isActive.isPasswordActive;
		},
		isPasswordConfirmError : function(){
			return this.isPromptPasswordConfirm && !this.isActive.isPasswordConfirmActive;
		},
		isWoman : function(){
			return !this.isMan;
		},
		isRegisterInfo : function(){
			return (this.isPhoneNumber && this.isNickname && this.isPassword && this.isPasswordConfirm);
		}
		
	}
});
