<?php
header('Content-Type: text/javascript; charset=utf8');
header('Access-Control-Allow-Origin: *');

function error($msg,$json=false) {
	if ($json) print_r(json_encode(array("error"=>$msg)));
	else $final['error'] = $msg;
}

$ref = (isset($_SERVER['HTTP_REFERER']))?$_SERVER['HTTP_REFERER']:'';
if (isset($ref) && !empty($ref) && isset($_GET['apikey']) && !empty($_GET['apikey'])) {
	require 'api_auth.php';
	$allow = true;
	foreach($auth as $key => $referer) {
		if ($_GET['apikey'] == $key && strpos($ref,$referer) !== false) { $allow = true; break; }
	}
	if (!$allow) die(error("Bad API Key!",true));
} else {
	if (!isset($_GET['apikey']) || empty($_GET['apikey'])) die(error("API Key Error!",true));
	elseif (!isset($ref) || empty($ref)) die(error("HTTP Referer Error!",true));
}

$mysql = mysql_connect('localhost','root','');
if (!$mysql) die(error(mysql_error(),true));
mysql_select_db('hns');

if (isset($_GET['type']) && !empty($_GET['type'])) $TYPE = (int)$_GET['type'];
if (isset($_GET['dj']) && !empty($_GET['dj'])) $DJ = (int)$_GET['dj'];
if (isset($_GET['name']) && !empty($_GET['name'])) $NAME = $_GET['name'];
if (isset($_GET['queue']) && !empty($_GET['queue'])) $QUEUE = $_GET['queue'];
if (isset($_GET['timestamp']) && !empty($_GET['timestamp'])) $TIMESTAMP = (int)$_GET['timestamp'];

if ($TYPE == 1) { // get queue
	$query = "SELECT name, queue, timestamp FROM hnsquetube WHERE dj = $DJ";
} elseif ($TYPE == 2) { // update queue
	$query = "UPDATE hnsquetube SET queue='".$QUEUE."', timestamp='".$TIMESTAMP."' WHERE dj = $DJ";
} elseif ($TYPE == 3) { // check if queue has been updated
	$query = "SELECT queue, timestamp FROM hnsquetube WHERE dj = $DJ";
} elseif ($TYPE == 4) { // get all dj rooms
	$query = "SELECT dj, name, queue, timestamp FROM hnsquetube ORDER BY timestamp DESC";
} elseif ($TYPE == 5) { // create dj room
	$query = "INSERT INTO hnsquetube (name, timestamp, created_timestamp) VALUES ('".mysql_real_escape_string($NAME)."', '".time()."', '".time()."')";
}

$res = mysql_query($query) or die(error(mysql_error(),true));

if ($TYPE != 5) {
	$num_rows = mysql_num_rows($res);
	while ($row = mysql_fetch_assoc($res)) {
		for ($i=0; $i<mysql_num_fields($res); $i++) {
			$info = mysql_fetch_field($res,$i);
			$type = $info->type;
			if ($type == 'real') $row[$info->name] = doubleval($row[$info->name]);
			else if ($type == 'int') $row[$info->name] = intval($row[$info->name]);
		}
		if ($num_rows > 1) $rows[] = $row;
		else $rows = $row;
	}
}

if ($TYPE == 3 && $TIMESTAMP >= $rows["timestamp"]) $rows = false;
if ($TYPE == 2) $rows = false;
if ($TYPE == 5) {
	if (mysql_affected_rows() == 1) $rows = mysql_insert_id();
	else error(true,true);
}

$final = array(
	"data"=>$rows,
	"error"=>false
);

$json = json_encode($final);
print_r($json);
mysql_close();
?>