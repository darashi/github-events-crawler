var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mkdirp = require('mkdirp');

var Crawler = require('./crawler').Crawler;

exports.run = function() {
  if (!process.env.DB_PATH) {
    console.info('USAGE:');
    console.info();
    console.info('env DB_PATH="[/data/github/github].YYYYMMDD.HH.[jsons]" ' +process.argv[1]);
    process.exit(-1);
  }

  var lastPath = '';
  var logStream = null;
  var crawler = new Crawler();

  crawler.on('event', function(data) {
    var currentPath = moment().utc().format(process.env.DB_PATH);
    if (currentPath !== lastPath) {
      if (logStream) {
        logStream.end();
      }
      mkdirp.sync(path.dirname(currentPath));
      logStream = fs.createWriteStream(currentPath, {flags: 'a'});
      console.log("Opened %s", currentPath);
    }

    console.log(currentPath, data.id);
    logStream.write(JSON.stringify(data) + '\n');
    lastPath = currentPath;
  });
  crawler.start();
};
