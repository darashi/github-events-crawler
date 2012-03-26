var https = require('https');
var util = require('util');
var events = require('events');
var _ = require('underscore');
var Deduper = require('./deduper').Deduper;

var Crawler = function () {
  var self = this;
  self.interval = 800;
  self.deduper = new Deduper();

  this.on('data', function(data) {
    var receivedEvents = JSON.parse(data);
    for (var i = receivedEvents.length - 1; i>=0; i--) {
      if (self.deduper.isNew(receivedEvents[i].id)) {
        self.emit('event', receivedEvents[i]);
      }
    }
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
