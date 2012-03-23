var https = require('https');
var util = require('util');
var events = require('events');
var _ = require('underscore');

var Crawler = function () {
  var self = this;
  self.interval = 800;
  self.latestIdCrawled = null;

  this.on('data', function(data) {
    events = JSON.parse(data);
    for (var i = events.length - 1; i>=0; i--) {
      if (parseInt(events[i].id, 10) > self.latestIdCrawled) {
        self.emit('event', events[i]);
      }
    }
    self.latestIdCrawled = _.max([
                                 parseInt(events[0].id, 10),
                                 self.latestIdCrawled
                                 ]);
  });
}

util.inherits(Crawler, events.EventEmitter);

Crawler.prototype.crawl = function() {
  var self = this;
  var request = https.request({
    host: 'api.github.com',
    path: '/events'
  }, function(response) {
    var body = '';
    response.on('data', function(chunk) {
      body += chunk;
    });
    response.on('end', function() {
      if (response.statusCode == 200) {
        self.emit('data', body);
      }
    });
  });
  request.end();
};
Crawler.prototype.start = function() {
  var self = this;
  setInterval(function() {
    self.crawl();
  }, self.interval);
};

exports.Crawler = Crawler;
