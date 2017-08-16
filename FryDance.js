console.log("Initalizing Fry Dance", location.href);
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
var cIndex = 0;
if (location.pathname != "/")
{
	var args = location.pathname.split("/");
	if (!isNaN(args[1]))
	{
		cIndex = Number(args[1])-1;
		if (cIndex < 0)
			cIndex = 0;
	}
	else
	{
		$("#songSelector a").each(function(ei, el)
		{
			if ($(el).data("title") == unescape(args[1]))
				cIndex = ei;
		});
	}
}

window.onpopstate = function(event)
{
	if (location.pathname != "/")
	{
		var args = location.pathname.split("/");
		if (!isNaN(args[1]))
		{
			cIndex = Number(args[1])-1;
			if (cIndex < 0)
				cIndex = 0;
		}
	}
	else
		cIndex = 0;
	$("#songSelector a:eq(" + cIndex + ")").trigger("click", true);
};

var hasLoaded = false;
var videosToLoad = $("#videosToLoad").children("video").length;
var videosLoaded = 0;
var ytStartTime = new Date();
var timeListened = 0;
var totalTimeListened = 0;
var lastVideo;
var ythWnd;
var yttWnd;
var finalehWnd;
var finalehWnd2;
var isToggling = false;

var LoopType = {
	None: 0,
	One: 1,
	All: 2
};

var currentLoopType = LoopType.One;

var ShuffleType = {
	Off: 0,
	On: 1
};
var currentShuffleType = ShuffleType.Off;

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
};
function playYoutubeVideo(vidid, start, end)
{
	start = Number(start);
	end = Number(end);
	console.log(start, end);
	console.log("playing youtube video id:", vidid);
	ytStartTime = new Date();
	switch (vidid)
	{
		case "j0h2u87JwyA":
			var timings = [3, 1, 4, 4, 4, 3, 2, 4, 4, 4, 3, 2, 4, 4, 4, 3, 2, 4, 4, 1, 1, 1, 1, 3];
			var cTime = 0;
			var dTime = 0;
			var cRot = 45 + (45 * Math.round(Math.random() * 7));
			clearInterval(finalehWnd);
			finalehWnd = setInterval(function(e)
			{
				if (player.getPlayerState() == 1)
				{
					if (player.getCurrentTime().toFixed(2) >= 22.24)
					{
						if (!isToggling)
						{
							isToggling = true;
							//$("#content").css("filter", "hue-rotate(" + Math.round(Math.random() * 360) + "deg)");
							$("#content").css("filter", "hue-rotate(" + cRot + "deg)");
							finalehWnd2 = setInterval(function()
							{
								cTime += (1 / timings[dTime]);
								if (cTime >= dTime+1)
								{
									dTime++;
									console.log(dTime, timings.length);
									if (dTime >= timings.length)
									{
										dTime = 0;
										cTime = 0;
									}
									//$("#content").css("filter", "hue-rotate(" + Math.round(Math.random() * 360) + "deg)");
									cRot += 45;
									if (cRot > 360)cRot = (cRot - 360);
									$("#content").css("filter", "hue-rotate(" + cRot + "deg)");
								}
								
							}, 150);
						}
					}
					else
					{
						cTime = 0;
						dTime = 0;
						isToggling = false;
						clearInterval(finalehWnd2);
					}
				}
			}, 10);
		break;
		default:
			cTime = 0;
			dTime = 0;
			isToggling = false;
			clearInterval(finalehWnd);
			clearInterval(finalehWnd2);
			if ($("#content").attr("style"))
				$("#content").removeAttr("style");
		break;
	}
	player.loadVideoById({
		'videoId': vidid,
		'startSeconds': start,
		'endSeconds': end,
		'suggestedQuality': 'large'
	});
	//$("#ytVideo1").html("<iframe id=\"player\" src=\"https://www.youtube.com/embed/" + vidid + "?controls=1&showinfo=0&modestbranding=1&wmode=transparent&enablejsapi=1&loop=1&rel=0\" frameborder=\"0\" allowfullscreen></iframe>");
}
function OnVideosLoaded(e)
{
	$("#vidIntro").off("ended.frydance");
	$("#vidIntro").on("ended.frydance", function(){$("#videosToLoad").append($("#vidIntro"));$("#vidIntro").get(0).pause();$("#vidIntro").hide();$("#content").append($("#vidLoop"));$("#vidLoop").show();console.log("Playing video:",$("#vidLoop source").attr("src"));$("#vidLoop").get(0).play();$("#songSelector a:eq(" + cIndex + ")").click();});
	console.log("Playing video:",$("#vidIntro source").attr("src"));
	$("#content").append($("#vidIntro"));
	$("#vidIntro").show();
	$("#vidIntro").get(0).play();
}
function onSongSelectClicked(e, prevhist)
{
	e.preventDefault();
	if ($("#vidIntro").is(":visible"))
	{
		cIndex = Number($(this).data("id")-1);
		return;
	}
	timeListened = 0;
	clearInterval(ythWnd);
	$("a.active").removeClass("active");
	cIndex = Number($(this).data("id")-1);
	lastVideo = $(this);
	document.title = lastVideo.data("title") + " - Fry Dance";
	if (typeof prevhist === "undefined" && document.origin != "null")
		window.history.pushState({"html": $("html").html(), "pageTitle": document.title},"", "http://Fry.Dance/" + lastVideo.data("id").pad(2));
	lastVideo.addClass("active");
	if (!isNaN($(this).data("listened")))
		timeListened = Number($(this).data("listened"));
	var video_id = $(this).attr("href").split("v=")[1];
	var ampersandPosition = video_id.indexOf('&');
	if (ampersandPosition != -1)
	{
		video_id = video_id.substring(0, ampersandPosition);
	}
	if (video_id == player.getVideoData().video_id)
	{
		if (!isNaN($(this).data("start")))
			player.seekTo(Number($(this).data("start")));
		else
			player.seekTo(0);
	}
	else
	{
		console.log("Playing id:", video_id);
		playYoutubeVideo(video_id, $(this).data("start"), $(this).data("end"));
	}
}
function onSlideEvent(e)
{
	e.preventDefault();
	switch (e.type)
	{
		case "touchstart":
		case "mousedown":
			$("#sldVolume").data("dragging", true);
		break;
		case "touchmove":
		case "mousemove":
			if ($("#sldVolume").data("dragging") == true)
			{
				$("#ytVideo1").stop();
				$("#btnVolume").html("Volume: Unmuted");
				var newVolume = ((1 - (($("#sldVolume").width() - (e.type == "touchmove" ? e.originalEvent.touches[0].clientX : e.offsetX)) / $("#sldVolume").width()))*100).clamp(0, 100);
				$("#vidIntro").prop("volume", newVolume / 100);
				player.setVolume(newVolume);
				$("#sldVolume").data("volume", newVolume);
				$("#sldVolume").children(".slider-background").css("width", newVolume + "%");
				$("#sldVolume").children(".slider-text").html(Math.round(newVolume) + "%");
			}
		break;
		case "touchend":
		case "mouseup":
			$("#sldVolume").data("dragging", false);
		break;
		default:
		
		break;
	}
}
function onDocumentEvent(e)
{
	switch (e.type)
	{
		case "mousemove":
			e.offsetX = e.pageX;
			onSlideEvent(e);
		break;
		case "mouseup":
			$("#sldVolume").data("dragging", false);
		break;
	}
}
function OnDocumentReady(e)
{
	$("#sldVolume").on("mousedown mousemove mouseup touchstart touchmove touchend", onSlideEvent);
	$(document).on("mousemove mouseup", onDocumentEvent);
	$("#btnVolume").on("click.frydance", function(e)
	{
		e.preventDefault();
		if (player.getVolume() > 0)
		{
			$("#sldVolume .slider-background").stop();
			$("#sldVolume .slider-background").animate({"width": "0%"}, {progress: function(a, p)
			{
				$("#sldVolume .slider-text").html(Math.round($("#sldVolume").data("volume") - (p*$("#sldVolume").data("volume"))) + "%");
				player.setVolume(Math.round($("#sldVolume").data("volume") - (p*$("#sldVolume").data("volume"))));
			}, duration: 250});
			$(this).html("Volume: Muted");
		}
		else
		{
			$("#sldVolume .slider-background").stop();
			$("#sldVolume .slider-background").animate({"width": $("#sldVolume").data("volume") + "%"}, {progress: function(a, p)
			{
				$("#sldVolume .slider-text").html(Math.round(p*$("#sldVolume").data("volume")) + "%");
				player.setVolume(Math.round(p*$("#sldVolume").data("volume")));
			}, duration: 250});
			$(this).html("Volume: Unmuted");
		}
	});
	$("#btnYT").on("click.frydance", function(e)
	{
		e.preventDefault();
		$("#ytVideo1").stop();
		$("#ytVideo1").toggle(500);
	});
	$("#songSelector a").each(function(i, e)
	{
		$(this).data("id", (i+1));
		$(this).children("span.title").html($(this).data("id").pad(2) + " - " + ($(this).data("navtitle") ? $(this).data("navtitle") : $(this).data("title")));
		if (!isNaN($(this).data("listened")))
			$(this).children("span.time").html(parseSeconds($(this).data("listened")));
		else
			$(this).children("span.time").html("0s");
		$(this).off("click.frydance");
		$(this).on("click.frydance", onSongSelectClicked);
	});
	$("#videosToLoad video").each(function()
	{
		var el = $(this);
		console.log("Now loading video:",el.children("source").attr("src"));
		$(this).off("error.frydance");
		$(this).on("error.frydance", function(e)
		{
			console.log(e);
		});
		$(this).off("loadeddata.frydance");
		$(this).on("loadeddata.frydance", function(){videosLoaded++;console.log("loaded",el.children("source").attr("src"));if(videosLoaded>=videosToLoad&&window.YTLoaded===true)OnVideosLoaded(e);});
		$(this).attr("preload", "auto");
	});
	$("#btnLoop").on("click.frydance", function(e)
	{
		e.preventDefault();
		currentLoopType += 1;
		if (currentLoopType > LoopType.All)
			currentLoopType = 0;
		for (var i in LoopType)	
			if (LoopType[i] == currentLoopType) $(this).html("Loop: " + i);
	});
	$("#btnShuffle").on("click.frydance", function(e)
	{
		e.preventDefault();
		if (currentShuffleType == ShuffleType.On)
			currentShuffleType = ShuffleType.Off;	
		else
			currentShuffleType = ShuffleType.On;
		for (var i in ShuffleType)	
			if (ShuffleType[i] == currentShuffleType) $(this).html("Shuffle: " + i);
	});
}
function parseSeconds(seconds)
{
	seconds = Math.round(seconds);
	var retStr = "";
	var mins = Math.floor(seconds / 60).toFixed(0);
	seconds = seconds % 60;
	if (mins > 0)
		retStr = mins + "m " + seconds + "s";
	else
		retStr = seconds + "s";
	return retStr;
}
function UpdatePlayTime()
{
	var now = new Date();
	var diff = now.getTime() - ytStartTime.getTime();
	if (diff >= 250)
	{
		timeListened += (diff / 1000);
		totalTimeListened += (diff / 1000);
	}
	$("#controls span.time").html(parseSeconds(totalTimeListened));
	ytStartTime = new Date();
	lastVideo.data("listened", timeListened);
	lastVideo.children("span.time").html(parseSeconds(lastVideo.data("listened")));
	
	$("#songSelector a").each(function(ei, el)
	{
		if (typeof $(el).data("listened") !== "undefined")
			$(el).children(".timespan").css("width", (($(el).data("listened") / totalTimeListened) * 100) + "%");
	});
	
}
function checkVideoTime()
{
	var start = $("#songSelector a.active").data("start");
	var end = $("#songSelector a.active").data("end");
	if (player.getCurrentTime() >= end)
	{
		if (currentLoopType == LoopType.One)
			player.seekTo(start);
		else if (currentLoopType == LoopType.All)
		{
			clearInterval(yttWnd);
			cIndex++;
			if (cIndex >= $("#songSelector a").length)
				cIndex = 0;
			$("#songSelector a:eq(" + cIndex + ")").trigger("click", true);
		}
	}	
}
$(document).ready(OnDocumentReady);
function OnYoutubeAPIReady(e)
{
	console.log("YouTube API ready.");
	window.hasYoutubed = true;
	player = new YT.Player('ytVideo1', {
		height: '640',
		width: '390',
		videoId: '2xJWQPdG7jE',
		'startSeconds': 58.5,
		'endSeconds': 77,
		'suggestedQuality': 'large',
		events: {
			'onReady': function OnPlayerReady(event)
			{
				console.log("YT Player Ready", event);
				if (typeof $("#sldVolume").data("volume") === "undefined")
				{
					$("#sldVolume").children(".slider-background").css("width", "50%");
					$("#sldVolume").children(".slider-text").html("50%");
					$("#sldVolume").data("volume", 50);
					player.setVolume(50);
				}
				else
				{
					$("#sldVolume").children(".slider-background").css("width", $("#sldVolume").data("volume")+"%");
					$("#sldVolume").children(".slider-text").html($("#sldVolume").data("volume")+"%");
					player.setVolume($("#sldVolume").data("volume"));
				}
				window.YTLoaded = true;
				if(videosLoaded>=videosToLoad&&window.YTLoaded===true)OnVideosLoaded(e);
			},
			'onStateChange': function OnPlayerStateChanged(event)
			{
				if (event.data === 2)
				{
					clearInterval(ythWnd);
					clearInterval(yttWnd);
					UpdatePlayTime();
				}
				if (event.data === 1)
				{
					console.log("Playing video:", player.getVideoData().title);
					ytStartTime = new Date();
					clearInterval(ythWnd);
					ythWnd = setInterval(UpdatePlayTime, 1000);
					clearInterval(yttWnd);
					yttWnd = setInterval(checkVideoTime, 100);
				}
				if (event.data === 0)
				{
					clearInterval(finalehWnd2);
					clearInterval(yttWnd);
					isToggling = false;
					UpdatePlayTime();
					if (currentLoopType == LoopType.One)
						lastVideo.click();
					//playYoutubeVideo("2xJWQPdG7jE");
				}
			},
			'onError': function(event)
			{
				console.log(event);
				if (currentLoopType == LoopType.All)
				{
					clearInterval(yttWnd);
					cIndex++;
					if (cIndex >= $("#songSelector a").length)
						cIndex = 0;
					$("#songSelector a:eq(" + cIndex + ")").trigger("click", true);
				}
			}
		}
	});
}
function OnWindowReady(e)
{
	$("#vidIntro").prop("volume", 0.5);
	console.log("Begin loading YouTube API");
	window.onYouTubeIframeAPIReady = OnYoutubeAPIReady;
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
$(window).ready(OnWindowReady);
console.log("Initalized Fry Dance");