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
          if (result && _.isFunction(result.then)) {
            return promise(result);
          }
          return result;
        };
      }
    });

    var defer = Q.defer();
    defer.resolve(newObj);
    return defer.promise;
  };

  var one = function(selector) {
    return promisify(driver.findElement(selenium.By.js("var module = {exports: {}};\n" + sizzleCode + "\nvar Sizzle = module.exports;\nreturn (Sizzle(" + (JSON.stringify(selector)) + ") || [])[0];")));
  };
  var all = function(selector) {
    return promise(driver.findElements(selenium.By.js("var module = {exports: {}};\n" + sizzleCode + "\nvar Sizzle = module.exports;\nreturn (Sizzle(" + (JSON.stringify(selector)) + ") || []);")));
  };

  one.all = all;

  return one;
};
