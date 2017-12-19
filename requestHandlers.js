var exec = require("child_process").exec;
var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable");
var path = require('path');

function start(request, response){
	console.log("Request handler 'start' is called. ");

	var body = '<html>'+
				'<head>'+
				'<meta http-equiv="Content-Type" content="text/html; '+
				'charset=UTF-8" />'+
				'</head>'+
				'<body>'+
				'<form action="/upload" enctype="multipart/form-data" ' +
				'method="post"> '+
				'<input type="file" name="upload">'+ 
				'<input type="submit" value="Upload file" />'+
				'</form>'+
				'</body>'+
				'</html>';
				response.writeHead(200, {"Content-Type": "text/html"});
				response.write(body);
				response.end();
}


function upload(request, response){
	console.log("go to upload handler");

	var form = new formidable.IncomingForm();
	console.log("about to parse");
	var dir_path = 'image';
	form.parse(request, function(error, fields, files){
		console.log("parsing done");
		let file_path = path.normalize(files.upload.path);
		let file_name = path.basename(file_path);

		if(!fs.existsSync(dir_path)){
			fs.mkdir(dir_path, function(err){
				if (err) {
					console.log("image exists")
				}
				else{
					console.log("create image successfully")
				}
			});
		}

		fs.readdir(dir_path, function(err, files){	
			if(err){
					console.log("read image error");
					response.writeHead(500, {"Content-type":"text/plain"});
					response.write(err + "\n");
					response.end();
			} 

			else{
				let new_file_name = path.join("image", files.length + ".png");
				fs.renameSync(file_path, new_file_name);
				response.writeHead(200, {"Content-type":"text/html"});
				response.write("received image: <br/>");
				response.write("<img src='/show' />");  //Note here route
				response.end();
			}

		})

	});


}



function show(request, response){
	console.log('go to show');
	var dir_path = path.join(__dirname +"/image");
	var dir_path = "image";
	console.log(dir_path);
	
	fs.readdir(dir_path, function(err, files){
			 
			  	show_file_path = path.join(dir_path, '/' + (files.length-1) + '.png');
				console.log(show_file_path);

				fs.readFile(show_file_path, "binary", function(err, file){
					if(err){
							console.log("show error");
							response.writeHead(500, {"Content-type":"text/plain"});
							response.write(err + "\n");
							response.end();

					}
					else{
						console.log("show not error");

						response.writeHead(200, {"Content-Type": "image/png"}); 
						response.write(file, "binary"); 
						response.end();

					}


				})



			})
	
	
	

}


exports.start = start;
exports.upload = upload;
exports.show = show;



