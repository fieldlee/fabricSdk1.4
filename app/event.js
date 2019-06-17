var fs = require('fs');
var path = require('path');
var hfc = require('fabric-client');
var {Gateway,FileSystemWallet} = require('fabric-network');
var helper = require('./helper.js');
var logger = helper.getLogger('Event-Contract');

var ORGS = hfc.getConfigSetting('network-config');
var connectionProfile = hfc.getConfigSetting('connect_profile');

const gateway = new Gateway();
const wallet = new FileSystemWallet('/var/wallet');


const adminExists = await wallet.exists('admin');
if (adminExists) {
    console.log('An identity for the admin user "admin" already exists in the wallet');
}

var client = await helper.getClientForOrg("mmOrg");
var ca = client.getCertificateAuthority();
// Enroll the admin user, and import the new identity into the wallet.
const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
const identity = X509WalletMixin.createIdentity('mmOrg', enrollment.certificate, enrollment.key.toBytes());
await wallet.import('admin', identity);
console.log('Successfully enrolled admin user "admin" and imported it into the wallet');


const gatewayOptions = {
    wallet: wallet, 
    identity: "admin"
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