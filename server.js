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
  console.log("Got request");

  mjpegReqHandler = mjpegServer.createReqHandler(req, res);
  var i = 0;
  var timer = setInterval(captureImg, 500);

  function captureImg() {
	 var toTransmit ="";
 
	camera.read(function(err, im) {
      if (err) throw err;
      console.log("Image acquired: ", im.size());
      //console.log(im.isBuffer());

      var width = im.width();
      var height = im.height();
      var c = [ "255", "130", "0"];
      im.flip(1);
      
      im.putText(i, 50, height-50, "CV_FONT_HERSHEY_SIMPLEX", [0,200,50],0.5);
      im.putText("image: "+ im.size(), 50, height-150, 'HERSEY_SCRIPT_SIMPLEX', [0,150,150],0.5,9);
   
    im.line([0,0], [200, 200])
      if (im.size()[0] > 0 && im.size()[1] > 0){
        //window.show(im);
	//im.save('./resources/'+i+'.jpg');
	//fs.readFile(__dirname + '/resources/'+ i + '.jpg', sendJPGData);
	
	toTransmit = new Buffer(im);	
	
	console.log("Is it a buffer?", Buffer.isBuffer(toTransmit));
	console.log("Lenght of buffer ", toTransmit.lenght);
	
	//sendJPGData(toTransmit);
	
	i++;
      }
      //window.blockingWaitKey(0, 50);
    });

  }


  function sendJPGData(err, data) {
    mjpegReqHandler.write(data, function() {
      //checkIfFinished();
    });
  }

  function checkIfFinished() {
    if (i > 100) {
      clearInterval(timer);
      mjpegReqHandler.close();
      console.log('End Request');
    }
  }
}).listen(9090);
