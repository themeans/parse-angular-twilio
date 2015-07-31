/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

var argscheck = require('cordova/argscheck'),
  channel = require('cordova/channel'),
  cordova = require('cordova');

function parseTwilio() {};

/**
 * sendPhone  
 * 
 * @param  String phoneNumber  
 * @return Promise            
 */
parseTwilio.prototype.sendPhone = function(phoneNumber) {
  var promise = new Parse.Promise();

  Parse.Cloud.run('sendCode', {
    'phoneNumber': phoneNumber
  }, {
    success: function(response) {
      promise.resolve(response);
    },
    error: function(error) {
      promise.reject(error);
    }
  });

  return promise;
};

/**
 * sendCode  
 * 
 * @param  String phoneNumber  
 * @param  String codeEntry   
 * @return Promise
 */
parseTwilio.prototype.sendCode = function(phoneNumber, codeEntry) {

  var promise = new Parse.Promise();

  Parse.Cloud.run('logInPhone', {
    'phoneNumber': phoneNumber,
    'codeEntry': codeEntry
  }, {
    success: function(response) {
      promise.resolve(response);
    },
    error: function(error) {
      promise.reject(error);
    }
  });

  return promise;
};

module.exports = new parseTwilio();
