Locate a [selenium-webdriver](https://npmjs.org/package/selenium-webdriver) element by sizzle CSS selector.

### Everything returns a promise

`$` and `$.all` return a `Q` promise.

Methods on Selenium `WebElement`s and arrays of `WebElement`s will also return a `Q` promise instead of a Selenium promise. 

### Usage

```js
var selenium = require('selenium-webdriver');
var sizzle = require('webdriver-sizzle-promised');
var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.phantomjs()).build()
var $ = sizzle(driver);

// Find the first element with class btn and click it
$('.btn').then(function(el) {
  //el is a selenium WebElement
  el.click()
});

// Count the paragraphs
$.all('p').then(function(elements) {
  console.log(elements.length);
});

```
