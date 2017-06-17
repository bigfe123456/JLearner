<?php
	header("Content-type: text/html; charset=utf-8");
	$mysql_server_name='xxxxxxxxxxxxxxxxxxxxx'; //改成自己的mysql数据库服务器
	$mysql_username='xxxxxxxxxxxxxxxxxxx'; //改成自己的mysql数据库用户名
	$mysql_password='xxxxxxxxxxxxxxxxxx'; //改成自己的mysql数据库密码
	$mysql_database='xxxxxxxxxxxxxxxxxxxxxxx'; //改成自己的mysql数据库名
	$conn=mysql_connect($mysql_server_name,$mysql_username,$mysql_password) or die("error connecting") ; //连接数据库
	mysql_query("SET NAMES UTF8");
	mysql_select_db($mysql_database,$conn);
	$bookName = $_POST["bookName"];
	$wordID = $_POST["wordID"];
	$userID =  $_POST["userID"];
	if($bookName == 'japaneseN1'){
		mysql_query("UPDATE User SET countOfN1 = '$wordID' WHERE userID = '$userID'");
	}else if($bookName == 'japaneseN2'){
		mysql_query("UPDATE User SET countOfN2 = '$wordID' WHERE userID = '$userID'");
	}else if($bookName == 'japaneseN3'){
		mysql_query("UPDATE User SET countOfN3 = '$wordID' WHERE userID = '$userID'");
	}else if($bookName == 'japaneseN4'){
		mysql_query("UPDATE User SET countOfN4 = '$wordID' WHERE userID = '$userID'");
	}else if($bookName == 'japaneseN5'){
		mysql_query("UPDATE User SET countOfN5 = '$wordID' WHERE userID = '$userID'");
	}else{
		
	}
	$result = mysql_query("SELECT * FROM $bookName WHERE wordID='$wordID'");
	if(mysql_num_rows($result)){
		while($row = mysql_fetch_array($result)){	
			$newWord['japanese'] = $row['japanese'];
			$newWord['pronun'] = $row['pronun'];
			$newWord['pronunVoice'] = $row['pronunVoice'];
			$newWord['chinese'] = $row['chinese'];
			$newWord['exampleJapanese'] = $row['exampleJapanese'];
			$newWord['exampleChinese'] = $row['exampleChinese'];
		}
	}
	echo JSON($newWord);
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