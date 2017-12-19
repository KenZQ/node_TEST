
function route(handlers, pathname, request, response){
	console.log("route to receive a request from " + pathname);
	if (typeof handlers[pathname] == "function"){
			return handlers[pathname](request, response);
	}
	else{
		console.log("no proper handler is for this url" + pathname);
		response.writeHead(400, {"content-type":"text-plain"});
		response.write("404 not found");
		response.end();
	}

}

exports.route = route;