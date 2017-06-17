<?php
	header("Content-type: text/html; charset=utf-8");
	$mysql_server_name='xxxxxxxxxxxxxxxxxxxxx'; //改成自己的mysql数据库服务器
	$mysql_username='xxxxxxxxxxxxxxxxxxxxxxx'; //改成自己的mysql数据库用户名
	$mysql_password='xxxxxxxxxxxxxxx'; //改成自己的mysql数据库密码
	$mysql_database='xxxxxxxxxxxxxxxxxxxxx'; //改成自己的mysql数据库名
	$conn=mysql_connect($mysql_server_name,$mysql_username,$mysql_password) or die("error connecting") ; //连接数据库
	mysql_query("SET NAMES UTF8");
	mysql_select_db($mysql_database,$conn);
	$phoneNumber = $_POST['phoneNumber'];
	$result = mysql_query("SELECT photo FROM User WHERE phoneNumber='$phoneNumber'");
	if(mysql_num_rows($result)){
		$userPhoto['result'] = 'success';
		while($row = mysql_fetch_array($result)){	
			$userPhoto['userPhoto'] = $row['photo'];
		}
	}else{
		$userPhoto['result'] = 'error';
	}
	echo JSON($userPhoto);
	mysql_close($conn);
	function arrayRecursive(&$array, $function, $apply_to_keys_also = false){  
	    static $recursive_counter = 0;  
	    if (++$recursive_counter > 1000) {  
	        die('possible deep recursion attack');  
	    }  
	    foreach ($array as $key => $value) {  
	        if (is_array($value)) {  
	            arrayRecursive($array[$key], $function, $apply_to_keys_also);  
	        } else {  
	            $array[$key] = $function($value);  
	        }  
	   
	        if ($apply_to_keys_also && is_string($key)) {  
	            $new_key = $function($key);  
	            if ($new_key != $key) {  
	                $array[$new_key] = $array[$key];  
	                unset($array[$key]);  
	            }  
	        }  
	    }  
	    $recursive_counter--;  
	}  
	function JSON($array) {  
	    arrayRecursive($array, 'urlencode', true);  
	    $json = json_encode($array);  
	    return urldecode($json);  
	}  
?>