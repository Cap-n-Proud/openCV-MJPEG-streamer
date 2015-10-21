//sudo modprobe bcm2835-v4l2
//Based on https://github.com/gluxon/node-mjpeg-server.git

var cv = require('/usr/local/lib/node_modules/opencv');
var i = 0;

var http = require('http');
var fs = require('fs');
var mjpegServer = require('./lib/mjpeg-server');

var camera = new cv.VideoCapture(0);
//var window = new cv.NamedWindow('Video', 0)
var imageW = 320,
	imageH = 240;

camera.setWidth(imageW);
camera.setHeight(imageH);

http.createServer(function(req, res) {
	//console.log("Got request");

	mjpegReqHandler = mjpegServer.createReqHandler(req, res);
	var i = 0;
	var timer = setInterval(captureImg, 24);

	function captureImg() {
		var toTransmit = "";
		var tempFile = "";
		camera.read(function(err, im) {
			if (err) throw err;
			//console.log("Image acquired: ", im.size());
			//console.log(im.isBuffer());

			var width = im.width();
			var height = im.height();
			var c = ["255", "130", "0"];
			im.rotate(180);
			//im.convertGrayscale();
			im.putText("f: " + i, 15, height - 10, "CV_FONT_HERSHEY_SIMPLEX", [100, 200, 50], 0.5);
			im.putText("p:", width - 50, height - 50, "CV_FONT_HERSHEY_SIMPLEX", [100, 200, 50], 0.5);
			im.putText("b:", width - 50, height - 30, "CV_FONT_HERSHEY_SIMPLEX", [100, 200, 50], 0.5);
			im.putText("r:", width - 50, height - 10, "CV_FONT_HERSHEY_SIMPLEX", [100, 200, 50], 0.5);


			im.line([width / 2 - 20, height / 2], [width / 2 - 40, height / 2])
			im.line([width / 2 + 20, height / 2], [width / 2 + 40, height / 2])

			if (im.size()[0] > 0 && im.size()[1] > 0) {

				toTransmit = im.toBufferAsync(sendJPGData);


				i++;
			}
		});

	}



	
	function sendJPGData(err, data) {
		mjpegReqHandler.write(data, function() {});
	}

	function checkIfFinished() {
		if (i > 100) {
			clearInterval(timer);
			mjpegReqHandler.close();
			console.log('End Request');
		}
	}
}).listen(9090);
