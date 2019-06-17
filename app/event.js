var fs = require('fs');
var path = require('path');
var hfc = require('fabric-client');
var {Gateway,FileSystemWallet} = require('fabric-network');
var helper = require('./helper.js');
var logger = helper.getLogger('Event-Contract');

var ORGS = hfc.getConfigSetting('network-config');
var connectionProfile = hfc.getConfigSetting('connect_profile');

const gateway = new Gateway();
const wallet = new FileSystemWallet('/var/fabric-client-kvs_mmOrg');
const gatewayOptions = {
    wallet: wallet, 
    identity: "admin", 
    discovery: { enabled: true, asLocalhost: false },
};

gateway.connect(connectionProfile, gatewayOptions).then(()=>{
    gateway.getNetwork('mmchannel').then((network)=>{
        const contract = network.getContract('ledger');
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
    },(err)=>{
        logger.error(err);
    });
 },(err)=>{
    logger.error(err);
 });