var assert = require('assert');
var path = require('path');
var webdriver = require('selenium-webdriver');
var webdriverSizzle = require('..');

var url = function(page) {
  return "file://" + (path.join(__dirname, page));
};

var assertUncaught = function(regex, done) {
  var listeners = process.listeners('uncaughtException');

  process.removeAllListeners('uncaughtException');

  process.once('uncaughtException', function(err) {
    assert(regex.test(err.message, "" + err.message + " doesn't match " + regex));
    listeners.forEach(function(listener) {
      process.on('uncaughtException', listener);
    });
    done();
  });
};

describe('webdriver-sizzle', function() {
  var $ = null;

  describe('once driving a webdriver Builder', function() {
    before(function(done) {
      var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.phantomjs()).build();

      this.timeout(0);

      driver.get(url('finnegan.html')).then(function() {
        done();
      });

      $ = webdriverSizzle(driver);
    });

    describe('calling with a CSS selector', function() {
      it('returns the first matching webdriver element', function() {
        return $('.test-el').then(function(el) {
          return el.getText().then(function(text) {
            assert.equal(text, "The following text is an excerpt from Finnegan's Wake by James Joyce");
          });
        });
      });

      describe('that matches no elements', function() {
        it('throws an error that includes the selector', function(done) {
          $('.does-not-match').then(function(el) {
            done(new Error('element does not exist'));
          },
          function() {
            done();
          });
        });
      });
    });
    describe('all', function() {
      it('returns all matching elements', function() {
        return $.all('p').then(function(elements) {
          assert.equal(elements.length, 2);
        });
      });
    });
  });
});
