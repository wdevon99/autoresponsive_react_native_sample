'use strict';

var fs = require('fs');
var path = require('path');

var diffImage = require('./utils.js').diffImage;

var appPath = path.resolve(process.env.APP_PATH);

//options for IOS
var iOSOpts = {
  deviceName: 'iPhone 5s',
  platformName: 'iOS',
  app: appPath
};

//options for Android
var androidOpts = {
  platformName: 'android',
  app: appPath
};

//Getting the correct options based on the OS
var wd = require('webdriver-client')(process.env.platform === 'android' ? androidOpts : iOSOpts);

describe('base', function() {
  this.timeout(5 * 60 * 1000);

  var driver = wd.initPromiseChain();

  driver.configureHttp({
    timeout: 300 * 60 * 1000
  });

  before(function() {
    return driver
      .initDriver()
      .sleep(20 * 1000);
  });

  after(function() {
    return driver
      .sleep(1000)
      .quit();
  });

  it('#1 login picture should be the same.', function() {
    return driver
      .sleep(40 * 1000)
      .waitForElementByName('autoresponsive')
      .takeScreenshot()
      .then(imgData => {
        var newImg = new Buffer(imgData, 'base64');
        var screenshotFolder = path.resolve(__dirname, '../screenshot');
        var oldImgPath = path.join(screenshotFolder, process.env.platform === 'android' ? 'android.png' : 'ios.png');
        var diffImgPath = path.join(screenshotFolder, process.env.platform === 'android' ? 'android-diff.png' : 'ios-diff.png');
        return diffImage(oldImgPath, newImg, 0.3, diffImgPath);
      })
      .then(result => {
        result.should.be.true();
      })
      .catch(e => {
        console.log(e);
      });
  });
});
