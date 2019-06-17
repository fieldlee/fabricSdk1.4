var fs = require('fs');
var path = require('path');

var helper = require('./helper.js');
var logger = helper.getLogger('Event-Contract');

var ORGS = hfc.getConfigSetting('network-config');
var connectionProfile = hfc.getConfigSetting('connect_profile');


const gateway = new Gateway();
const gatewayOptions = {
    wallet: {"name":"admin","mspid":"mmOrg","roles":null,"affiliation":"","enrollmentSecret":"","enrollment":{"signingIdentity":"a25a274f5a50e366c1a7680a0d1b055d1ef77aff11f6d3ac5aaa205133250dbb","identity":{"certificate":"-----BEGIN CERTIFICATE-----\nMIIB/jCCAaSgAwIBAgIUH9L7sXAFpXfpz7ianR6xA+gZ4rEwCgYIKoZIzj0EAwIw\nbzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFjAUBgNVBAcTDVNh\nbiBGcmFuY2lzY28xFzAVBgNVBAoTDm1tT3JnLjUxbW0uY29tMRowGAYDVQQDExFj\nYS5tbU9yZy41MW1tLmNvbTAeFw0xOTA2MDUxMDI5MDBaFw0yMDA2MDQxMDM0MDBa\nMCExDzANBgNVBAsTBmNsaWVudDEOMAwGA1UEAxMFYWRtaW4wWTATBgcqhkjOPQIB\nBggqhkjOPQMBBwNCAATdGkm1qICEK+SWMa0cYTNo+ijoU3Xbd1z1JvWfNpiM9/ZY\nzZE5JnN9gdJzQ00Qaif6mv6hh+vr7HoO0zM+7qpUo2wwajAOBgNVHQ8BAf8EBAMC\nB4AwDAYDVR0TAQH/BAIwADAdBgNVHQ4EFgQUWxT8mz86hJ7Ht0RDWb2cj9vRuDIw\nKwYDVR0jBCQwIoAgb2ONM+FKk1b+dEgV87SIZkw2Uon55+wDxy9nINgmAyEwCgYI\nKoZIzj0EAwIDSAAwRQIhAIyPPJd7RWpw2FjuwAI3+KumcSBnHMSnKNhzvyRAkzKU\nAiA6fGeydDm3bgW2y8QOij2iuZsXAC4R7uJ7POIOTpvOaw==\n-----END CERTIFICATE-----\n"}}}, 
    identity: "admin@mmOrg.51mm.com", 
    discovery: { enabled: true, asLocalhost: false },
};

 gateway.connect(connectionProfile, gatewayOptions);
const network = await gateway.getNetwork('mmchannel');
const contract = network.getContract('ledger');

/**
 * @param {String} listenerName the name of the event listener
 * @param {String} eventName the name of the event being listened to
 * @param {Function} callback the callback function with signature (error, event, blockNumber, transactionId, status)
 * @param {module:fabric-network.Network~EventListenerOptions} options
 * const listener = await
**/
 contract.addContractListener('ledger-transfer-listener', 'LEDGER_TX_[^ ]+', (err, event, blockNumber, transactionId, status) => {
    if (err) {
        console.error(err);
        logger.error(err);
        return;
    }
    logger.debug(event);
    console.log(event);
    logger.debug(`Block Number: ${blockNumber} Transaction ID: ${transactionId} Status: ${status}`)
    console.log(`Block Number: ${blockNumber} Transaction ID: ${transactionId} Status: ${status}`);
});

contract.addContractListener('ledger-signature-listener', '[0-9a-f]{64}', (err, event, blockNumber, transactionId, status) => {
    if (err) {
        console.error(err);
        logger.error(err);
        return;
    }
    logger.debug(event);
    console.log(event);
    logger.debug(`Block Number: ${blockNumber} Transaction ID: ${transactionId} Status: ${status}`)
    console.log(`Block Number: ${blockNumber} Transaction ID: ${transactionId} Status: ${status}`);
})
