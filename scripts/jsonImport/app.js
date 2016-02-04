var jsonfile = require('jsonfile')
var util = require('util')
var fs = require('fs');

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
    	console.log(err)
      onError(err);
      return;
    }


    filenames.forEach(function(filename) {
    	var fullPath = '/Users/Daryl/Desktop/niteworksTweets/' + filename
    	// console.log(fullPath)
    	var processedPath =  '/Users/Daryl/Desktop/processed/' + filename



		fs.exists(processedPath, function(exists) {
		    if (exists) {
		    	//console.log('already done', processedPath)
		       return;
		    }
		});



		var obj = jsonfile.readFileSync(fullPath);

		var newJson = obj.interactions
console.log('about to write', processedPath)

		  jsonfile.writeFile(processedPath, newJson, {spaces: 2}, function (err) {
			  if (err) console.error(err)
			})
		  // console.log(newJson)
		// })


  //     jsonfile.readFile(fullPath, function(err, obj) {
  //     		if (err) {
  //     			console.log(err)
  //     		}
		//   // console.dir(obj)
		//   var newJson = obj.interactions


		//   jsonfile.writeFile(processedPath, newJson, {spaces: 2}, function (err) {
		// 	  if (err) console.error(err)
		// 	})
		//   // console.log(newJson)
		// })
    });
  });
}




function readFilesSync(path) {
	var filesArr = fs.readdirSync(path)
	console.log(filesArr.length)
	filesArr.forEach(function(filename) {
		// console.log(filename)
		var fullPath = '/Users/Daryl/Desktop/niteworksTweets/' + filename
    	// console.log(fullPath)
    	var processedPath =  '/Users/Daryl/Desktop/processed/' + filename



		fs.exists(processedPath, function(exists) {
		    if (exists) {
		    	console.log('already done', processedPath)
		       return;
		    }
		});



		var obj = jsonfile.readFileSync(fullPath);

		var newJson = obj.interactions
		console.log('about to write', processedPath)

		jsonfile.writeFileSync(processedPath, newJson)

		 //  jsonfile.writeFile(processedPath, newJson, {spaces: 2}, function (err) {
			//   if (err) console.error(err)
			// })
	});
}

readFilesSync('/Users/Daryl/Desktop/niteworksTweets')
// readFiles('/Users/Daryl/Desktop/toprocess')