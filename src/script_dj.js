var pcontent = '<div id="tls"><div class="tl arrowright arrowright_e" title="Skip"></div><div class="tl save save_b" title="Share This Queue"></div><div class="alerts"></div></div><div id="oW"><div id="w"><div id="hd" class="cf"><div id="l"><div><span>HnS YouTube Instant</span></div></div><div id="sTW"><div id="sTK"><strong>HnS Quetube</strong><span id="roomname"></span></div></div></div><div id="m" class="cf"><div id="vD"><div id="iVD">Loading...</div></div><div id="pD"><div id="uP"><div id="pI"><input type="text" id="pB" value="Search The Queue" spellcheck="false"></input></div><ul id="pl" class="cf"></ul></div></div></div></div></div>';
var dC = {
	"devkey": "AIzaSyBM5IjRNrb5sAY8_5qPQXLKwIsFcrmdxFs",
	"title": "HnS Quetube",
	"remove": "quetube",
	"vThumbs": 10,
	"playerWidth": 720,
	"playerHeight": 405,
	"timestamp": 1,
	"room": 0,
	"roomname": "",
	"alerts": [],
	"queue": [],
	"history": [],
	"sresults": [],
	"cplaylist": "",
	"csplaylist": "",
	"requirekey": false,
	"pSResults": false,
	"pBFocus": false,
	"sPL": false,
	"sLS": false,
	"MSIE": false,
	"tl": {
		"playlists": false,
		"exact": false,
		"playlist": false
	}
};

function getHash(){return decodeURIComponent(window.location.hash.substring(1))}
function clearHash(){window.location.replace("#")}
function setHash(a){window.location.replace("#" + encodeURI(a))}
function getTitle(){return document.title}
function resetTitle(){document.title = dC.title}
function setTitle(a){document.title = a}

function removeChars(c, d){
	if (typeof c == "string") return d.split(c).join('');
	else {
		$.each(c, function(a, b){
			d = d.split(b).join('');
		});
		return d;
	}
}

Array.prototype.remove = function(a, b){
	var c = this.slice(((b || a) + 1) || this.length);
	this.length = (a < 0) ? (this.length + a) : a;
	return this.push.apply(this, c);
};
Array.prototype.vIndex = function(a){
	for (i = 0; i < this.length; i++){
		if (this[i] == a) return i;
	}
	return -1;
};
Array.prototype.contains = function(a){
	for (var i = (this.length - 1); i >= 0; i--){
		if (this[i] === a) return true;
	}
	return false;
};
Number.prototype.toLength = function(n){
	var a = this.toString();
	while (a.length < n) a = '0' + a;
	return a;
};
String.prototype.startsWith = function(a){
	return (this.match("^" + a) == a);
};
String.prototype.capitalize = function(){
	return this.replace(/(^|\s)([a-z])/g, function(m, a, b){
		return a + b.toUpperCase();
	})
};
String.prototype.toTitleCase = function(){
	return this.replace(/([\w&`'‘’"“.@:\/\{\(\[<>_]+-? *)/g, function(a, b, c, d){
		if (c > 0 && d.charAt(c - 2) !== ":" && a.search(/^(a(nd?|s|t)?|b(ut|y)|en|for|i[fn]|o[fnr]|t(he|o)|vs?\.?|via)[ \-]/i) > -1) return a.toLowerCase();
		if (d.substring(c - 1, c + 1).search(/['"_{(\[]/) > -1) return a.charAt(0) + a.charAt(1).toUpperCase() + a.substr(2);
		if (a.substr(1).search(/[A-Z]+|&|[\w]+[._][\w]+/) > -1 || d.substring(c - 1, c + 1).search(/[\])}]/) > -1) return a;
		return a.charAt(0).toUpperCase() + a.substr(1);
	})
};
String.prototype.stripSlashes = function(){
	return this.replace(/\\(.?)/g, function (s, n1){
		switch (n1) {
			case '\\': return '\\';
			case '0': return '\u0000';
			case '': return '';
			default: return n1;
		}
	});
};

function IsRightButtonClicked(e){
	var a = false;
	e = e || window.event;
	if (e.which) a = (e.which == 3);
	else if (e.button) a = (e.button == 2);
	return a;
}

function getTime(){
	return Math.round(+new Date()/1000);
}

function two(x){
	return ((x > 9) ? "" : "0") + Math.floor(x);
}

function gettime(s){
	var m = Math.floor(s / 60), h = Math.floor(m / 60), d = Math.floor(h / 60);
	if (d > 0) t = d + ":" + two(h % 60) + ":" + two(m % 60) + ":" + two(s % 60);
	else if ((h % 60) > 0) t = (h % 60) + ":" + two(m % 60) + ":" + two(s % 60);
	else t = (m % 60) + ":" + two(s % 60);
	return t;
}

function div_selection(e){
	this.e = e;
	if (arguments.length === 2) this.eq = arguments[1];
	if (this.e.target) this.event = this.e.target;
	else this.event = this.e.srcElement;
	if (this.event.nodeType == 3) this.event = this.event.parentNode;
	if (typeof this.eq === "undefined"){
		this.target_class = function(){ return $(this.event).attr('class'); };
		this.target_id = function(){ return $(this.event).attr('id'); };
		this.target_html = function(){ return $(this.event).html(); };
		this.target_content = function(){ return $(this.event).attr('content'); }
	} else {
		this.selection = $(this.event).parents().eq(this.eq).attr('id');
		this.target_class = function(){ return $(this.event).parents().eq(this.eq).attr('class'); };
		this.target_id = function(){ return $(this.event).parents().eq(this.eq).attr('id'); };
		this.target_html = function(){ return $(this.event).parents().eq(this.eq).html(); };
		this.target_content = function(){ return $(this.event).parents().eq(this.eq).attr('content'); };
		this.main = function(){ return this.selection; }
	}
}

function loadQueue(){
	dC.room = getHash() || 1;
	$.getJSON("json.php",{type:1,dj:dC.room,apikey:"hnsapi"},function(responseData){
		if (responseData){
			dC.queue = $.parseJSON(Base64.decode(responseData["data"].queue));
			dC.timestamp = responseData["data"].timestamp;
			dC.roomname = responseData["data"].name;
			$("#roomname").text(" - "+dC.roomname.stripSlashes());
			if (!$.isArray(dC.queue)){
				dC.queue = [];
				pushQueue();
			}
			updateQueue('load');
		}
	});
}

function updateQueue(){
	if (dC.queue.length > 0){
		$("div#uP ul#pl").empty();
		$.each(dC.queue, function(n, item){
			$("div#uP ul#pl").append('<li id="' + item[0] + '" style="background-image:url(' + item[2] + ')">' + item[1] + '</li>');
		});
		if (arguments[0] == 'load') setTimeout("manageQueue();", 2000);
		else manageQueue();
	} else {
		$("div#uP ul#pl").html('<li class="empty">No Videos Are In The Queue</li>');
		if (playerState == 1) stopVideo();
	}
}

function pushQueue(){
	dC.timestamp = getTime();
	$.get('json.php',{type:2,dj:dC.room,queue:Base64.encode(json_encode(dC.queue)),timestamp:dC.timestamp,apikey:"hnsapi"});
}

function monitorQueue(){
	$.getJSON("json.php",{type:3,dj:dC.room,timestamp:dC.timestamp,apikey:"hnsapi"},function(responseData){
		if (responseData && responseData["data"] !== false){
			dC.queue = $.parseJSON(Base64.decode(responseData["data"].queue));
			dC.timestamp = responseData["data"].timestamp;
			if (!$.isArray(dC.queue)){
				dC.queue = [];
				pushQueue();
			}
			updateQueue();
		}
	});
}

function manageQueue(){
	if (dC.queue.length > 0){
		if (dC.queue[0][0] != currentVideoId) loadAndPlayVideo(dC.queue[0]);
	}
}

$(window).load(function(){
	$("div.tl.arrowright").click(function(){
		if (dC.queue.length > 0){
			if (dC.requirekey){
				var reply = prompt("Admin Access Required To Skip Video", "");
				if (reply != dC.remove) return;
			}
			addAlert('Video Skipped',5000,2000);
			goNextVideo();
		}
	});
	$("div.tl.save").click(function(){
		prompt("Here is the link to share this dj room!","http://hns.netai.net/quetube/room.html#"+dC.room);
	});
	$("div#uP input[type='text']#pB").focus(function(){
		if ($(this).val() == "Search The Queue") $(this).val('');
		dC.pBFocus = true;
	}).blur(function(){
		if ($(this).val() == "") $(this).val('Search The Queue');
		dC.pBFocus = false;
	});
	$("div#uP ul#pl li").live('mousedown', function(e){
		if (dC.queue.length < 1) return;
		var a = new div_selection(e);
		a = a.target_html();
		var b = -1;
		if (IsRightButtonClicked(e)){
			e.preventDefault();
			if (dC.requirekey){
				var reply = prompt("Admin Access Required To Remove Video From Queue", "");
				if (reply != dC.remove) return;
			}
			$.each(dC.queue, function(i,item){
				if (item[1] == a){
					b = i;
					return false;
				}
			});
			if (b > -1){
				if (dC.queue.length == 1){
					$("div#uP ul#pl").html('<li class="empty">No Videos Are In The Queue</li>');
					dC.queue.shift();
					pushQueue();
					if (playerState == 1) stopVideo();
				} else {
					if (b == 0){
						goNextVideo();
					} else {
						dC.queue.remove(b);
						pushQueue();
						$("div#uP ul#pl li:eq(" + b + ")").remove();
					}
				}
			}
			addAlert('Video Removed From Queue', 5000, 2000);
		}
	});
	$("div#l").click(function(){
		window.location.href = "index.html";
	});
});

function loadPlayer(){
	var a = {allowScriptAccess: "always"};
	var b = {id: "ytplayer"};
	swfobject.embedSWF("http://www.youtube.com/apiplayer?version=3&enablejsapi=1&playerapiid=ytplayer&key="+dC.devkey, "iVD", dC.playerWidth, dC.playerHeight, "8", null, null, a, b);
}

function onYouTubePlayerReady(a){
	ytplayer = document.getElementById("ytplayer");
	ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
	ytplayer.addEventListener("onError", "onPlayerError");
	$("input[type='text']#pB").keyup(doQueueSearch);
	$(document.documentElement).keydown(onKeyDown);
	onBodyLoad();
}

function onBodyLoad(){
	currentPSearch = '';
	currentVideoId = '';
	playerState = -1;
}

function onPlayerStateChange(a){
	playerState = a;
	if (playerState == 0){
		goNextVideo();
	}
}

function onPlayerError(a){
	goNextVideo();
	addAlert('<b class="error">Error!</b> oPE Type: ' + a, 5000, 2000);
}

function doQueueSearch(){
	var a = $("input[type='text']#pB");
}

function searchArr(a, b){
	var c = {}, retObj = {};
	if (typeof a === 'string') a = eval(a);
	$.each(b, function(v){
		c = b[v];
		retObj[v] = new Array();
		$.each(c, function(i, t){
			if (t.match(a)) retObj[v].push(t);
		});
	});
	return retObj;
}

function onKeyDown(e){
	var a = e.keyCode || e.which, keys = [];
	if (a == 39 || a == 40){
		if (ytplayer){
			$("div.tl.arrowright").click();
		}
	}
	if (keys.contains(e.keyCode)) e.preventDefault();
}

function goNextVideo(){
	if (dC.queue.length > 1){
		dC.queue.shift();
		$("#pl li:first-child").remove();
	} else if (dC.queue.length > 0){
		dC.queue.shift();
		$("div#uP ul#pl").html('<li class="empty">No Videos Are In The Queue</li>');
		if (playerState == 1) stopVideo();
	}
	pushQueue();
	manageQueue();
}

function loadAndPlayVideo(a){
	if (ytplayer){
		ytplayer.loadVideoById(a[0]);
		currentVideoId = a[0];
	}
	window.setTimeout(function(){
		addAlert("Next Video Starts in " + gettime(getDuration()), 5000, 2000);
	}, 2000);
}

function addAlert(){
	if (arguments.length > 0) dC.alerts.push(arguments);
	if (dC.alerts.length == 1) showAlerts();
}

function showAlerts(){
	$("div.alerts").promise().done(function(){
		var mainargs = dC.alerts.shift();
		if (mainargs.length > 2){
			$(this).html(mainargs[0]).show().delay(mainargs[1]).fadeOut(mainargs[2]);
			if (typeof (mainargs[3]) == 'function') mainargs[3]();
		} else {
			$(this).html(mainargs[0]).fadeIn(function(){
				$(this).fadeOut('fast');
				if (typeof (mainargs[1]) == 'function') mainargs[1]();
			});
		}
		if (dC.alerts.length > 0) showAlerts();
	});
}

function handleSmallScreens(){
	if ($(document).width() < 1060){
		var a = $(document).width();
		var b = 1060 - a;
		var c = $("div#m").width();
		$("div#w").width(a);
		$("div#sTW").width($("div#sTW").width() - b + 10);
		if (b < 31){
			$("div#pD").width(c - b + 5);
		} else {
			$("div#pW, div#pD > div").addClass("small");
			b -= 30;
			var d = dC.playerHeight / dC.playerWidth;
			dC.playerWidth = dC.playerWidth - b - 5;
			dC.playerHeight = Math.floor(dC.playerWidth * d);
			dC.thumbHeight = (dC.playerHeight / 4) - 2;
			$("div#l").css('margin', '0 10px 0 0');
			$("div#pD").width(c - 25).height(dC.playerHeight);
			$("div#uP ul#pl").height(dC.playerHeight - 40);
		}
	}
	if ($(document).height() < 600){
		var e = $(document).height();
		var b = 600 - e;
	}
}

function loadVideo(a){if (ytplayer){ytplayer.cueVideoById(a);currentVideoId=a}}
function playVideo(){if (ytplayer) ytplayer.playVideo()}
function pauseVideo(){if (ytplayer) ytplayer.pauseVideo()}
function stopVideo(){if (ytplayer) ytplayer.stopVideo()}
function setVolume(v){if (ytplayer) ytplayer.setVolume(v)}
function getDuration(){if (ytplayer) return ytplayer.getDuration()}
function getCurrentTime(){if (ytplayer) return ytplayer.getCurrentTime()}
function setSize(w,h){if (ytplayer) return ytplayer.setSize(w,h)}
function seekTo(s){if (ytplayer) return ytplayer.seekTo(s,false)}

$(document).ready(function(){
	$('body').html(pcontent);
	handleSmallScreens();
	loadPlayer();
	loadQueue();
	setInterval("monitorQueue();", 5000);
});

(function(){window._gaq=[['_setAccount','UA-32560649-2'],['_setDomainName','hns.netai.net'],['_trackPageview']];var a=document.createElement('script');a.type='text/javascript';a.async=true;a.src=('https:'==document.location.protocol?'https://ssl':'http://www')+'.google-analytics.com/ga.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(a,s)})();
