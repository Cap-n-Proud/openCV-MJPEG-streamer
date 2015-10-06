//sudo modprobe bcm2835-v4l2

var cv = require('/usr/local/lib/node_modules/opencv');
var i = 0;

try {
  var camera = new cv.VideoCapture(0);
  //var window = new cv.NamedWindow('Video', 0)

  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;
      console.log(im.size())
      var width = im.width();
      var height = im.height();
      var c = [ "255", "130", "0"];
      //putText(self->mat, text, cv::Point(x, y), constFont, scale, color, 2);
      im.flip(0);
      
      im.putText("3.684", 50, height-50, "CV_FONT_HERSHEY_SIMPLEX", [0,200,50],0.5);
      im.putText("3.684 thick "+im.width(), 50, height-150, 'HERSEY_SCRIPT_SIMPLEX', [0,200,150],3,9);
   
    im.line([0,0], [200, 200])
      if (im.size()[0] > 0 && im.size()[1] > 0){
        //window.show(im);
	//im.save('./resources/'+i+'.jpg');

  	i++;
      }
      //window.blockingWaitKey(0, 50);
    });
  }, 50);

} catch (e){
  console.log("Couldn't start camera:", e)
}
