/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('Helper');
logger.setLevel('DEBUG');

var path = require('path');
var util = require('util');

var hfc = require('fabric-client');
hfc.setLogger(logger);
var ORGS = hfc.getConfigSetting('network-config');
var CONNECT = hfc.getConfigSetting('connect_profile');
async function getClientForOrg (userorg, username) {
	logger.debug('getClientForOrg - ****** START %s %s', userorg, username);

	let client = hfc.loadFromConfig(CONNECT);

	client.loadFromConfig(ORGS[userorg]);

	await client.initCredentialStores();

	if(username) {
		let user = await client.getUserContext(username, true);
		if(!user) {
			throw new Error(util.format('{"status":400,"message":"User was not found : %s"}', username));
		} else {
			logger.debug('User %s was found to be registered and enrolled', username);
		}
	}
	logger.debug('getClientForOrg - ****** END %s %s \n\n', userorg, username)

	return client;
}

var getRegisteredUser = async function(username, userOrg, isJson) {
    console.log("=================================================");
	try {
        var client = await getClientForOrg(userOrg);
        console.log(client);
		logger.debug('Successfully initialized the credential stores');
			// client can now act as an agent for organization Org1
			// first check to see if the user is already enrolled
        var user = await client.getUserContext(username, true);

		if (user && user.isEnrolled()) {
			logger.info('Successfully loaded member from persistence');
		} else {
			// user was not enrolled, so we will need an admin user object to register
			logger.info('User %s was not enrolled, so we will need an admin user object to register',username);

            var adminusername = hfc.getConfigSetting('caUser');
            var adminpassword = hfc.getConfigSetting('caSecret');

			let adminUserObj = await client.setUserContext({username: adminusername, password: adminpassword});
			let caClient = client.getCertificateAuthority();
			let secret = await caClient.register({
				enrollmentID: username,
				affiliation:  'org1.department1'
			}, adminUserObj);
			logger.debug("secret:");
			logger.debug(secret);
			logger.debug('Successfully got the secret for user %s',username);
			user = await client.setUserContext({username:username, password:secret});
			logger.debug('Successfully enrolled username %s  and setUserContext on the client object', username);
		}
		if(user && user.isEnrolled) {

			if (isJson && isJson === true) {
				var response = {
					success: true,
					secret: user._enrollmentSecret,
					message: username + ' enrolled Successfully',
				};
				return response;
			}
		} else {
			throw new Error('User was not enrolled ');
		}
	} catch(error) {
		logger.error('Failed to get registered user: %s with error: %s', username, error.toString());
		return 'failed '+error.toString();
	}

};


var setupChaincodeDeploy = function() {
	process.env.GOPATH = hfc.getConfigSetting('CC_SRC_PATH');
};

var getLogger = function(moduleName) {
	var logger = log4js.getLogger(moduleName);
	logger.setLevel('DEBUG');
	return logger;
};

exports.getClientForOrg = getClientForOrg;
exports.getLogger = getLogger;
exports.setupChaincodeDeploy = setupChaincodeDeploy;
exports.getRegisteredUser = getRegisteredUser;
