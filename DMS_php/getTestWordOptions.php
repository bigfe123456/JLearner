<?php
	header("Content-type: text/html; charset=utf-8");
	$mysql_server_name='xxxxxxxxxxxxxxxxx'; //改成自己的mysql数据库服务器
	$mysql_username='xxxxxxxxxxxxxxxxx'; //改成自己的mysql数据库用户名
	$mysql_password='xxxxxxxxxxxxxxxxxx'; //改成自己的mysql数据库密码
	$mysql_database='xxxxxxxxxxxxxxxx'; //改成自己的mysql数据库名
	$conn=mysql_connect($mysql_server_name,$mysql_username,$mysql_password) or die("error connecting") ; //连接数据库
	mysql_query("SET NAMES UTF8");
	mysql_select_db($mysql_database,$conn);
	$bookName = $_POST["bookName"];
	$wordID1 = $_POST["wordID1"];
	$wordID2 = $_POST["wordID2"];
	$wordID3 = $_POST["wordID3"];
	$wordID4 = $_POST["wordID4"];
	$correctWordID =  $_POST["correctWordID"];
	$result = mysql_query("SELECT japanese,pronun,chinese FROM $bookName WHERE wordID='$wordID1'");
	if(mysql_num_rows($result)){
		while($row = mysql_fetch_array($result)){	
			$options['japanese1'] = $row['japanese'];
			$options['pronun1'] = $row['pronun'];
			$options['chinese1'] = $row['chinese'];
		}
	}
	$result = mysql_query("SELECT japanese,pronun,chinese FROM $bookName WHERE wordID='$wordID2'");
	if(mysql_num_rows($result)){
		while($row = mysql_fetch_array($result)){	
			$options['japanese2'] = $row['japanese'];
			$options['pronun2'] = $row['pronun'];
			$options['chinese2'] = $row['chinese'];
		}
	}
	$result = mysql_query("SELECT japanese,pronun,chinese FROM $bookName WHERE wordID='$wordID3'");
	if(mysql_num_rows($result)){
		while($row = mysql_fetch_array($result)){	
			$options['japanese3'] = $row['japanese'];
			$options['pronun3'] = $row['pronun'];
			$options['chinese3'] = $row['chinese'];
		}
	}
	$result = mysql_query("SELECT japanese,pronun,chinese FROM $bookName WHERE wordID='$wordID4'");
	if(mysql_num_rows($result)){
		while($row = mysql_fetch_array($result)){	
			$options['japanese4'] = $row['japanese'];
			$options['pronun4'] = $row['pronun'];
			$options['chinese4'] = $row['chinese'];
		}
	}
	$result = mysql_query("SELECT * FROM $bookName WHERE wordID='$correctWordID'");
	if(mysql_num_rows($result)){
		while($row = mysql_fetch_array($result)){
			$options['japaneseCorrect'] = $row['japanese'];
			$options['pronunCorrect'] = $row['pronun'];
			$options['pronunVoiceCorrect'] = $row['pronunVoice'];
			$options['chineseCorrect'] = $row['chinese'];
			$options['exampleJapaneseCorrect'] = $row['exampleJapanese'];
			$options['exampleChineseCorrect'] = $row['exampleChinese'];
		}
	}
	echo JSON($options);
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