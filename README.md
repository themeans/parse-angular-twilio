# README #

# package parse-angular-twilio

## Description

Plugin provides cordova/phonegap app authorization method by phone number(sms code). Parse.com is a required backend service!

## Install

Add this plugin to your cordova/phonegap project using command:

```
#!cmd

cordova plugin add https://github.com/themeans/parse-angular-twilio
```

This plugin is dependent to parse.com JSSDK. Add this to your cordova/phonegap project.
Then init Parse SDK.

```
#!javascript

Parse.initialize('<APP_KEY>', '<JS_KEY>');

```

Then use "parseTwilio" object in your code:

```
#!javascript

/**
* phoneNumber string digital 10 characters
**/
parseTwilio.sendPhone(phoneNumber).then(
    function(response) { 
        //success 
    },
    function(err) {   
        //error
    });

parseTwilio.sendCode(phoneNumber, codeEntry).then(
    function(response) { 
        //success 
    },
    function(err) {   
        //error
    });

```

Functions "sendPhone" and "sendCode" is a promise.

**Parse.com Cloud code:**

```
#!javascript

// cloud/main.js
/**
 * twilio account settings 
 */
var twilioConfig = require("cloud/settings.js").twilioConfig;
var twilio = require('twilio')(twilioConfig.AccountSid, twilioConfig.AuthToken);
var secretPasswordToken = 'SomethingSecretWord';
/**
 * sendCode
 * @param  {[type]} req   
 * @param  {[type]} res   
 * @return {[type]}      
 */
Parse.Cloud.define("sendCode", function(req, res) {
  var phoneNumber = req.params.phoneNumber;
  phoneNumber = phoneNumber.replace(/\D/g, ''); 

  if (!phoneNumber || (phoneNumber.length != 10 && phoneNumber.length != 11)) return res.error('Invalid Parameters');
  Parse.Cloud.useMasterKey();
  var query = new Parse.Query(Parse.User);
  query.equalTo('username', phoneNumber + "");
  query.first().then(function(result) {
    var min = 1000;
    var max = 9999;
    var num = Math.floor(Math.random() * (max - min + 1)) + min;

    if (result) {
      result.setPassword(secretPasswordToken + num);    
      result.save().then(function() {
        return sendCodeSms(phoneNumber, num);
      }).then(function(data) { 
        res.success({
              msg: "SMS send" 
            });
      }, function(err) {
        res.error(err);
      });
    } else {
      var user = new Parse.User();
      user.setUsername(phoneNumber);
      user.setPassword(secretPasswordToken + num); 
      user.setACL({});
      user.save().then(function(a) {
         return sendCodeSms(phoneNumber, num);       
      }).then(function(data) { 
        res.success({
              msg: "SMS send" 
            });
      }, function(err) {
        res.error({
          err: err,
          msg: "No save"
        });
      });
    }
  }, function(err) {
    res.error({
      err: err,
      msg: "Fatal error"
    });
  });
});
/**
 * sendCodeSms 
 * 
 * @param  String   phoneNumber 
 * @param  String   code          
 * @return Promise             
 */
function sendCodeSms(phoneNumber, code) {
  var prefix = "+";
  var promise = new Parse.Promise();

  twilio.sendSms({
    to: prefix + phoneNumber.replace(/\D/g, ''),
    from: twilioConfig.PhoneNumber.replace(/\D/g, ''),
    body: 'Your login code is ' + code
  }, function(err, responseData) {
    if (err) { 
      promise.reject(err.message);
    } else {
      promise.resolve(responseData);
    }
  });
  return promise;
}

/**
 * logInPhone
 * @param    req      
 * @param    res    
 * @return       
 */
Parse.Cloud.define("logInPhone", function(req, res) {
  Parse.Cloud.useMasterKey();

  var phoneNumber = req.params.phoneNumber;
  phoneNumber = phoneNumber.replace(/\D/g, '');

  if (phoneNumber && req.params.codeEntry) {
    Parse.User.logIn(phoneNumber, secretPasswordToken + req.params.codeEntry).then(function(user) {
      res.success(user._sessionToken);
    }, function(err) {
      res.error(err);
    });
  } else {
    res.error('Invalid parameters.');
  }
});

// cloud/settings.js
module.exports = { 
  twilioConfig: {
    PhoneNumber: "<Twilio Phone Number>",
    AccountSid: '<Twilio Account Sid>',
    AuthToken: '<Twilio Auth Token>'
  }
}

```

## License

The MIT License