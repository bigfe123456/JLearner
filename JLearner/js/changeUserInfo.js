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
window.addEventListener('setUserNewPhoto',function(event){
	changeUserInfo.photo = event.detail.path;
},false);
mui.plusReady(function(){
	var self = plus.webview.getWebviewById('changeUserInfo.html');
	changeUserInfo.user = self.user;
})
var changeUserInfo = new Vue({
	el : '#mui-change-user-info',
	data : {
		dateRange : {
			type : "date",
			beginDate : new Date(1970,1,1),
			endDate : new Date()
		},
		isActive : {
			isNicknameActive : false,
			isOldPasswordActive : false,
			isNewPasswordActive : false,
			isNewPasswordConfirmActive : false
		},
		isFirstEdit : {
			nickname : false,
			oldPassword : false,
			newPassword : false,
			newPasswordConfirm : false
		},
		user : {
			photo : 'http://murakami.online/JLearner/userPhoto/userPhotoDefault.png',
			nickname : 'JLearner用户',
			password : 'xxxxxxxxx',
			sex : '男',
			birthday : '1994-12-15',
			address : '未知',
		},
		photo : '',
		nickname : '',
		oldPassword : '',
		newPassword : '',
		newPasswordConfirm : '',
		isRepeatNickname : false
	},
	computed : {
		isNickname : function(){
			return ((this.nickname.length >= 3 && this.nickname.length <= 16) && !this.isRepeatNickname);
		},
		isOldPassword : function(){
			return (/^[a-zA-Z]\w{7,19}$/.test(this.oldPassword) && this.oldPassword === this.user.password);
		},
		isNewPassword : function(){
			return (/^[a-zA-Z]\w{7,19}$/.test(this.newPassword));
		},
		isNewPasswordConfirm : function(){
			return ((this.newPassword === this.newPasswordConfirm) && this.isNewPassword);
		},
		isPromptNickname : function(){
			return !this.isNickname && this.isFirstEdit.nickname;
		},
		isPromptOldPassword : function(){
			return !this.isOldPassword && this.isFirstEdit.oldPassword;
		},
		isPromptNewPassword : function(){
			return !this.isNewPassword && this.isFirstEdit.newPassword;
		},
		isPromptNewPasswordConfirm : function(){
			return !this.isNewPasswordConfirm && this.isFirstEdit.newPasswordConfirm;
		},
		isNicknameSuccess : function(){
			return this.isNickname && this.isFirstEdit.nickname;
		},
		isOldPasswordSuccess : function(){
			return this.isOldPassword && this.isFirstEdit.oldPassword;
		},
		isNewPasswordSuccess : function(){
			return this.isNewPassword && this.isFirstEdit.newPassword;
		},
		isNewPasswordConfirmSuccess : function(){
			return this.isNewPasswordConfirm && this.isFirstEdit.newPasswordConfirm;
		},
		isNicknameError : function(){
			return this.isPromptNickname && !this.isActive.isNicknameActive;
		},
		isOldPasswordError : function(){
			return this.isPromptOldPassword && !this.isActive.isOldPasswordActive;
		},
		isNewPasswordError : function(){
			return this.isPromptNewPassword && !this.isActive.isNewPasswordActive;
		},
		isNewPasswordConfirmError : function(){
			return this.isPromptNewPasswordConfirm && !this.isActive.isNewPasswordConfirmActive;
		},
		isPromptNickname_LI : function(){
			if(this.nickname){
				return this.isPromptNickname;
			}else{
				return false;
			}
		},
		isPromptPassword_LI : function(){
			if(!this.oldPassword && !this.newPassword && !this.newPasswordConfirm){
				return false;
			}else{
				return (this.isPromptOldPassword || this.isPromptNewPassword || this.isPromptNewPasswordConfirm);
			}
		}
	},
	methods : {
		changeUserPhoto : function(){
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
					},
					{
						title : '取消修改'
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
													path : url,
													changeWhereComeHere : true
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
												path : changeUserInfo.user.photo
											});
						webviewContent.addEventListener("rendered", function(){
			        		webviewContent.show("pop-in",200);
			    		}, false);
						break;
					};
					case (4) : {
						changeUserInfo.photo = '';
						break;
					};
					default : {
						break;
					}
				}
			});
		},
		confirmUserPhoto : function(){
			plus.nativeUI.actionSheet({
				title : '操作头像',
				cancel : '取消',
				buttons : [
					{
						title : '查看大图'
					},
					{
						title : '取消修改'
					}
				]
			},function(event){
				switch(event.index){
					case (0) : {
						break;
					};
					case (1) : {
						var webviewContent = plus.webview.create('pictureView.html',
											'pictureView.html',{},{
												path : changeUserInfo.photo
											});
						webviewContent.addEventListener("rendered", function(){
			        		webviewContent.show("pop-in",200);
			    		}, false);
						break;
					};
					case (2) : {
						changeUserInfo.photo = '';
						break;
					};
					default : {
						break;
					}
				}
			});
		},
		changeUserSex : function(){
			plus.nativeUI.actionSheet({
				title : '选择性别',
				cancel : '取消',
				buttons : [
					{
						title : '男'
					},
					{
						title : '女'
					}
				]
			},function(event){
				switch(event.index){
					case (0) : {
						break;
					};
					case (1) : {
						changeUserInfo.user.sex = '男';
						break;
					};
					case (2) : {
						changeUserInfo.user.sex = '女';
						break;
					};
					default : {
						break;
					}
				}
			});
		},
		changeUserBirthday : function(){
			var picker = new mui.DtPicker(changeUserInfo.dateRange);
			picker.show(function(rs) {
				changeUserInfo.user.birthday = `${rs.y.text}年${rs.m.text}月${rs.d.text}日`;
				picker.dispose();
			});
		},
		changeUserAddress : function(){
			var cityPicker = new mui.PopPicker({
				layer: 3
			});
			cityPicker.setData(cityData3);
			cityPicker.show(function(items) {
				if(items[2].text === undefined){
					changeUserInfo.user.address = `${items[0].text}`;
				}else if(items[0].text === items[1].text){
					changeUserInfo.user.address = `${items[0].text}-${items[2].text}`;
				}else{
					changeUserInfo.user.address = `${items[0].text}-${items[1].text}-${items[2].text}`;
				}
			});
		},
		inputRowFocus : function(event){
			var target = event.target;
			switch(target.id){
				case ('nickname') : {
					this.isActive.isNicknameActive = true;
					mui(".mui-icon-clear")[0].addEventListener('tap',function(){
		　　　　　　		changeUserInfo.nickname = '';
		　　　　 　   });
					break;
				};
				case ('old-password') : {
					this.isActive.isOldPasswordActive = true;
					break;
				};
				case ('new-password') : {
					this.isActive.isNewPasswordActive = true;
					break;
				};
				case ('new-password-confirm') : {
					this.isActive.isNewPasswordConfirmActive = true;
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
				case ('nickname') : {
					this.isActive.isNicknameActive = false;
					this.isFirstEdit.nickname = true;
					break;
				};
				case ('old-password') : {
					this.isActive.isOldPasswordActive = false;
					this.isFirstEdit.oldPassword = true;
					break;
				};
				case ('new-password') : {
					this.isActive.isNewPasswordActive = false;
					this.isFirstEdit.newPassword = true;
					break;
				};
				case ('new-password-confirm') : {
					this.isActive.isNewPasswordConfirmActive = false;
					this.isFirstEdit.newPasswordConfirm = true;
					break;
				};
				default : {
					break;
				}
			}
		},
		inputRowInput : function(event){
			var _target = event.target;
			switch(_target.id){
				case ('nickname') : {
					this.isRepeatNicknameFromServer();
					break;
				};
				default : {
					break;
				}
			}
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
						changeUserInfo.isRepeatNickname = true;
					}else{
						changeUserInfo.isRepeatNickname = false;
					}
				},
				error:function(xhr,type,errorThrown){
					//do error things
					mui.toast('网络未连接。');
				}
			});
		},
		resetInputState : function(symbol){
			switch(symbol){
				case ('nickname') : {
					if(!this.nickname){
						changeUserInfo.isFirstEdit.nickname = false;
					}
					document.getElementById('nickname').blur();
				};
				case ('password') : {
					if(!this.nickname && !this.oldPassword && !this.newPassword && !this.newPasswordConfirm){
						changeUserInfo.isFirstEdit.oldPassword = false;
						changeUserInfo.isFirstEdit.newPassword = false;
						changeUserInfo.isFirstEdit.newPasswordConfirm = false;
					}
					document.getElementById('old-password').blur();
					document.getElementById('new-password').blur();
					document.getElementById('new-password-confirm').blur();
				};
				default : {
					break;
				}
			}
		},
		saveUserInfo : function(){
			document.getElementById('nickname').blur();
			document.getElementById('old-password').blur();
			document.getElementById('new-password').blur();
			document.getElementById('new-password-confirm').blur();
			if(this.isPromptNickname_LI || this.isPromptPassword_LI){
				return;
			}
			var _userInfo = {};
			_userInfo.photo = this.photo?this.photo:this.user.photo;
			_userInfo.nickname = this.isNickname?this.nickname:this.user.nickname;
			_userInfo.password = (this.isOldPassword && this.isNewPassword && this.isNewPasswordConfirm)?this.newPassword:this.user.password;
			_userInfo.sex = this.user.sex;
			_userInfo.birthday = this.user.birthday;
			_userInfo.address = this.user.address;
			var webview = plus.webview.getWebviewById('jlearner.html');
			mui.fire(webview,'refreshUserInfo',{
				userInfo : _userInfo
			});
			if(plus.storage.getItem('userID')){
				mui.ajax('http://murakami.online/JLearner/changeUserMainInfo.php',{
					data:{
						userID : parseInt(plus.storage.getItem('userID')),
						photo : _userInfo.photo,
						nickname : _userInfo.nickname,
						password : _userInfo.password,
						sex : _userInfo.sex,
						birthday : _userInfo.birthday,
						address : _userInfo.address
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
			mui.back();
		}
	}
});
