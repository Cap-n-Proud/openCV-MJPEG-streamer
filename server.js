//sudo modprobe bcm2835-v4l2
//Based on https://github.com/gluxon/node-mjpeg-server.git

var cv = require('/usr/local/lib/node_modules/opencv');
var i = 0;

var http = require('http');
var fs = require('fs');
var mjpegServer = require('./lib/mjpeg-server');

var camera = new cv.VideoCapture(0);
//var window = new cv.NamedWindow('Video', 0)


http.createServer(function(req, res) {
	//console.log("Got request");

	mjpegReqHandler = mjpegServer.createReqHandler(req, res);
	var i = 0;
	var timer = setInterval(captureImg, 150);

	function captureImg() {
		var toTransmit ="";
		var tempFile = "";
		camera.read(function(err, im) {
			if (err) throw err;
			//console.log("Image acquired: ", im.size());
			//console.log(im.isBuffer());

			var width = im.width();
			var height = im.height();
			var c = ["255", "130", "0"];
			im.flip(1);

			im.putText(i, 50, height - 50, "CV_FONT_HERSHEY_SIMPLEX", [0, 200, 50], 0.5);
			im.putText("image: " + im.size(), 50, height - 150, 'HERSEY_SCRIPT_SIMPLEX', [0, 150, 150], 0.5, 9);
			im.line([0, 0], [200, 200])
			if (im.size()[0] > 0 && im.size()[1] > 0) {
				//window.show(im);
				//im.save('./resources/'+i+'OC.jpg');
				
				toTransmit = im.toBufferAsync(sendJPGData);
					//cv.readImage(toTransmit,sendJPGData);
				//fs.readFile(__dirname + '/resources/'+ i + 'OC.jpg', sendJPGData);
				/*				
				console.log("File: ", i);
				console.log("Is it a buffer?", Buffer.isBuffer(toTransmit));
				console.log("Lenght: ", toTransmit.toString().length, "bytelenght:", Buffer.byteLength(toTransmit, 'utf8'));
				console.log("PREVIEW FIRST 50 CHARS=>|", toTransmit.slice(0, 50).toString(), "|<= END OF PREVIEW");
				console.log("PREVIEW LAST 50 CHARS=>|", toTransmit.slice(toTransmit.length - 50, toTransmit.length).toString(), "|<= END OF PREVIEW");
*/
				//sendJPGData(toTransmit);

				i++;
			}
			//window.blockingWaitKey(0, 50);
		});

	}



	function filePreview(err, data) {
		console.log("OC PREVIEW FIRST 50 CHARS=>|", data.slice(0, 50).toString(), "|<= END OF PREVIEW");
		console.log("OC PREVIEW LAST 50 CHARS=>|", data.slice(data.length - 50, data.length).toString(), "|<= END OF PREVIEW");

	}

	function sendJPGData(err, data) {
		mjpegReqHandler.write(data, function() {
			//checkIfFinished();
		});
	}

	function postConversion(err, data) {
	
		console.log("Converted");
	
	}	
	function checkIfFinished() {
		if (i > 100) {
			clearInterval(timer);
			mjpegReqHandler.close();
			console.log('End Request');
		}
	}
}).listen(9090);
