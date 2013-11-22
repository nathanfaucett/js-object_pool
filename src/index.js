var util = require("util"),
	
	fs = require("fs"),
	path = require("path"),
	cwd = process.cwd(),
	
	crypto = require("crypto"),
	UID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
	UID_CHARS_LENGTH = UID_CHARS.length,
	
	diveDefaultOpts = {
		all: false,
		recursive: true,
		files: true,
		directories: false
	};



function uid(length) {
	length || (length = 24);
	var out = "",
		bytes = crypto.pseudoRandomBytes(length),
		i;
	
	for (i = length; i--;) out += UID_CHARS[bytes[i] % UID_CHARS_LENGTH];
	return out;
}
util.uid = uid;


function merge(obj, add){
	var key;
	
	for (key in add) if (obj[key] === undefined) obj[key] = add[key];
	
	return obj;
}
util.merge = merge;


function dive(dir, opts, action, complete){
	if (typeof(opts) === "function") {
		if (typeof(action) === "undefined") {
			complete = function() {};
		}
		else {
			complete = action;
		}
		
		action = opts;
		opts = {};
	} else if (typeof(complete) === "undefined") {
		complete = function() {};
	}
	
	if (typeof(dir) !== "string") dir = cwd;
	merge(opts, diveDefaultOpts);
	
	function doDive(dir) {
		
		fs.readdir(dir, function(err, files) {
			todo--;
			if (err) {
				action(err);
				return;
			}
			
			files.forEach(function(file) {
				
				if (opts.all || file[0] !== ".") {
					todo++;
					
					var fullPath = path.resolve(dir, file);
					
					fs.stat(fullPath, function(err, stat) {
						if (err) {
							todo--;
							action(err);
							return;
						}
						
						if (stat) {
							if (stat.isDirectory()) {
								if (opts.directories) action(null, fullPath);
								if (opts.recursive) doDive(fullPath);
							} else {
								if (opts.files) action(null, fullPath);
								if (!--todo) complete();
							}
						}
					});
				}
			});
			
			if (!todo) complete();
		});
	}
	
	var todo = 1;
	doDive(dir);
};
util.dive = dive;


function diveSync(dir, opts, action){
	if (typeof(opts) === "function") {
		action = opts;
		opts = {};
	}
	
	if (typeof(dir) !== "string") dir = cwd;
	merge(opts, diveDefaultOpts);
	
	function doDive(dir) {
		var files;
		
		todo--;
		try{
			files = fs.readdirSync(dir);
		} catch(e) {
			action(e);
			return;
		}
		
		files.forEach(function(file) {
			
			if (opts.all || file[0] !== ".") {
				todo++;
				
				var fullPath = path.resolve(dir, file),
					stat;
				
				try{
					stat = fs.statSync(fullPath);
				} catch(e) {
					todo--;
					action(e);
					return;
				}
				
				if (stat) {
					if (stat.isDirectory()) {
						if (opts.directories) action(null, fullPath);
						if (opts.recursive) doDive(fullPath);
					} else {
						if (opts.files) action(null, fullPath);
					}
				}
			}
		});
	}
	
	var todo = 1;
	doDive(dir);
};
util.diveSync = diveSync;


module.exports = util;