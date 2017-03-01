/*
    *File: DockerSandbox.js
    *Author: Austin Zielinski
    *Created: 9th Feb 2017
*/

var exec = require('child_process').exec;
var fs = require('fs');

/**
    * @Constructor
    * @variable DockerSandbox
    * @description
		* @param {String} vm_name: name of the Docker virtual machine
		* @param {String} wdir: folder containing app.js
		* @param {String} folder: folder for user content and scripts
		* @param {int} hw_num: homework number
		* @param {String} hw_type: currently supports C, bash, written (TODO: R)
		* @param {String} content: code or text submitted by user
    * @param {Number} timeout: timeout limit (seconds) for code execution in Docker
*/

var DockerSandbox = function(vm_name, wdir, folder, class_code, hw_num, hw_type, content, timeout) {
	this.vm_name = vm_name;
	this.wdir = wdir;
	this.folder = folder;

	this.class_code = class_code;
	this.hw_num = hw_num;
	this.hw_type = hw_type;
	this.content = content;
	this.file_name = '';

	this.timeout = timeout;
}

/**
    * @function
    * @name DockerSandbox.run
    * @description Function that prepares the Docker environment then executes
    * @param {Function pointer} success ?????
*/

DockerSandbox.prototype.run = function(success) {
    var sandbox = this;

    this.prepare(function() {
        sandbox.execute(success);
    });
}

/**
         * @function
         * @name DockerSandbox.prepare
         * @description function that does the following:
				 	* makes a folder for user submission and scripts
					* copies grading script and wrapper to folder
					* changes permissions on the folder
					* writes user content to a file
         * @param {Function pointer} success ?????
*/

DockerSandbox.prototype.prepare = function(success) {
	var cmd;

	console.log('\n*** PREPARING ***');

	//make folder for user content
	exec('mkdir ' + this.wdir + this.folder, (err) => {
		console.log('* mkdir ' + this.wdir + this.folder);

		if (err) console.error(err); //error making directory this.wdir/this.folder
		else {
			//copy scripts to new folder
			cmd = 'cp -r ' + this.wdir + '../../solutions/' + this.class_code + '/hw' + this.hw_num + '/* ' + this.wdir + this.folder + ' && cp ' + this.wdir + '../scripts/wrapper.sh ' + this.wdir + this.folder;
			exec(cmd, (err) => {
				console.log('* ' + cmd);

				if (err) console.error('error copying payload to new folder');
				else {
					//give all permission on new folder
					cmd = 'chmod 777 ' + this.wdir + this.folder;
					exec(cmd, (err) => {
						console.log('* ' + cmd);

						if (err) console.error('error changing permissions on ' + this.wdir + this.folder);
						else {
							//write content to file
							this.file_name = ((hw_type) => {
								switch(hw_type) {
									case 'c': return 'file.c';
									case 'r': return 'file.R';
									default: return 'file';
								}
							})(this.hw_type);
							fs.writeFile(this.wdir + this.folder + '/' + this.file_name, this.content, (err) => {
								if (err) console.error('error writing user content to file');
								else {
									console.log('* ' + this.wdir + this.folder + '/' + this.file_name + ' saved');
									console.log('*****************')
									success();
								}
							});
						}
					});
				}
			});
		}
	});
}

/**
         * @function
         * @name DockerSandbox.execute
         * @precondition: DockerSandbox.prepare() has successfully completed
         * @description: This function takes the newly created folder prepared by DockerSandbox.prepare() and spawns a Docker container
         * with the folder mounted inside the container with the name '/usercode/' and calls the script.sh file present in that folder
         * to carry out the compilation. The Sandbox is spawned ASYNCHRONOUSLY and is supervised for a timeout limit specified in timeout_limit
         * variable in this class. This function keeps checking for the file "Completed" until the file is created by script.sh or the timeout occurs
         * In case of timeout an error message is returned back, otherwise the contents of the file (which could be the program output or log of
         * compilation error) is returned. In the end the function deletes the temporary folder and exits
         *
         * Summary: Run the Docker container and execute script.sh inside it. Return the output generated and delete the mounted folder
         *
         * @param {Function pointer} success ?????
*/

DockerSandbox.prototype.execute = function(success) {
	console.log('*** EXECUTING ***');

	var timer = 0; //variable for timeout
  var sandbox = this;

  //statement to be executed
  var st = this.wdir + '../scripts/DockerTimeout.sh ' + this.timeout +
  	's -e \'NODE_PATH=/usr/local/lib/node_modules\' -i -t -v "' + this.wdir +
    this.folder + '":/usercode ' + this.vm_name + ' /usercode/wrapper.sh /usercode/' + this.hw_type + '.sh /usercode/' + this.file_name;

  //print satement to console
  console.log('-------------------------------');
  console.log(st);

  //execute the Docker; this is done ASYNCHRONOUSLY
  exec(st, (err) => { if (err) { console.error(err); console.log('THIS ERROR') } });
  console.log('-------------------------------');

  //Check For File named "completed" after every 1 second
  var intid = setInterval(function() {
  	//Displaying the checking message after 1 second interval, testing purposes only
  	console.log("Checking " + sandbox.wdir + sandbox.folder + ": for completion: " + timer);
    timer += 1;

  	fs.readFile(sandbox.wdir + sandbox.folder + '/completed', 'utf8', function(err, data) {
    	//if file is not available yet and the file interval is not yet up carry on
      if (err && timer < sandbox.timeout) {
      	//console.log(err);
        return;
      }
      //if file is found simply display a message and proceed
      else if (timer < sandbox.timeout) {
      	console.log("DONE");
        //check for possible errors
        fs.readFile(sandbox.wdir + sandbox.folder + '/errors', 'utf8', function(err2, data2) {
        	if (!data2) data2 = "";
          console.log("Error file: ");
          console.log(data2);

          console.log("Main File:");
          console.log(data);

          var lines = data.toString().split('EXECUTION COMPLETE');
          var time = lines[1];
	
		  //console.log('lines[0]: ' + check);
		  if (lines[0] == "" && data2 == "") data = 'SUCCESS';
		  else data = 'FAILURE'; 

          console.log("Time: ");
          console.log(time);

          success(data, time, data2);
        });

        //return the data to the calling function
			}
	    //if time is up. Save an error message to the data variable
      else {
      	//Since the time is up, we take the partial output and return it.
        fs.readFile(sandbox.wdir + sandbox.folder + '/logfile.txt', 'utf8', function(err, data) {
	        if (!data) data = "";
	        data += "\nExecution Timed Out";
	        console.log("Timed Out: " + sandbox.folder);
	        fs.readFile(sandbox.wdir + sandbox.folder + '/errors', 'utf8', function(err2, data2) {
		    	  if(!data2) data2 = "";

		        var lines = data.toString().split('*---*');
		        data = lines[0];
		        var time = lines[1];

		        console.log("Time: ");
		        console.log(time);

		    	  success(data, data2);
    			});
    		});
  		}

	  	//now remove the temporary directory
	  	console.log("ATTEMPTING TO REMOVE: " + sandbox.wdir + sandbox.folder);
	  	console.log("------------------------------");
	  	exec("rm -r " + sandbox.wdir + sandbox.folder);

	  	clearInterval(intid);
		});
	}, 1000);
}

module.exports = DockerSandbox;