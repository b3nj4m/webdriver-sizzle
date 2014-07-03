Locate a [selenium-webdriver](https://npmjs.org/package/selenium-webdriver) element by sizzle CSS selector.

```js
var selenium = require('selenium-webdriver'),
    sizzle = require('webdriver-sizzle'),
    driver = new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.phantomjs())
      .build()
    $ = sizzle(driver)

// Find the first element with class btn and click it
$('.btn').click()

// Count the paragraphs
$.all('p').then(function (elements) {
  console.log(elements.count);
});

```
