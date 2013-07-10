#!/usr/bin/env node
/*Automatically grade fiels for the presence of specificed HTML tags/attributes. 
Uses commander.js and cheerio. Teaches command line application development and basic DOM parsing.
*/

var rest = require('restler');
var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exisit. Exiting.", instr);
	process.exit(1); 
	}
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var htmlToLocal = function(tempFile) {
    var response2console = function(result, response) {
	fs.writeFileSync(tempFile, result);
    };
    return response2console;
};    

var getHtmlFile = function(url, tempFile) {
    var response2console = htmlToLocal(tempFile);
    rest.get(url).on('complete', response2console);
    return tempFile.toString();
};

var loadChecks= function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    //Workaround for commander.js issue.
    //stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
    .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
    .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
    .option('u, --url <URL>', 'URL to index.html') 
    .parse(process.argv);
    var checkJson;
    if(program.url) {
	checkJson = checkHtmlFile(getHtmlFile(program.url, 'tempHtml.html'), program.checks);
    } else {
	checkJson = checkHtmlFile(program.file, program.checks);
    }
    var outJson =JSON.stringify(checkJson, null, 4);
    console.log(outJson);
} else {
    exports.checkHtmlFile;
}
