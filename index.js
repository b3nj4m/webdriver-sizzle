var _ = require('underscore');
var selenium = require('selenium-webdriver');
var path = require('path');
var fs = require('fs');
var Q = require('q');

module.exports = function(driver) {
  var sizzleCode = fs.readFileSync(path.join(__dirname, './lib', 'sizzle.min.js'));

  var promise = function(p) {
    var defer = Q.defer();

    p.then(function() {
      defer.resolve.apply(defer, arguments);
    });

    p.thenCatch(function() {
      defer.reject.apply(defer, arguments);
    });

    return defer.promise;
  };

  var promisify = function(obj) {
    var newObj = _.clone(obj);
    _.each(newObj, function(val, key) {
      if (_.isFunction(val)) {
        newObj[key] = function() {
          var result = obj[key].apply(this, arguments);
          if (result && _.isFunction(result.then) && !Q.isPromise(result)) {
            return promise(result);
          }
          return result;
        };
      }
    });

    delete newObj.then;

    return newObj;
  };

  var one = function(selector) {
    var defer = Q.defer();
    var locator = selenium.By.js("var module = {exports: {}};\n" + sizzleCode + "\nvar Sizzle = module.exports;\nreturn (Sizzle(" + (JSON.stringify(selector)) + ") || [])[0];");

    var exists = driver.isElementPresent(locator);
    exists.then(function(isPresent) {
      if (isPresent) {
        defer.resolve(promisify(driver.findElement(locator)));
      }
      else {
        defer.reject('element not found');
      }
    });

    return defer.promise;
  };
  var all = function(selector) {
    return promise(driver.findElements(selenium.By.js("var module = {exports: {}};\n" + sizzleCode + "\nvar Sizzle = module.exports;\nreturn (Sizzle(" + (JSON.stringify(selector)) + ") || []);")));
  };

  one.all = all;

  return one;
};
