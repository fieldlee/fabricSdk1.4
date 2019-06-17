var fs = require('fs');
var path = require('path');
var hfc = require('fabric-client');
var { Gateway, FileSystemWallet, X509WalletMixin } = require('fabric-network');
var helper = require('./helper.js');
var logger = helper.getLogger('Event-Contract');

var ORGS = hfc.getConfigSetting('network-config');
var connectionProfile = hfc.getConfigSetting('connect_profile');

const gateway = new Gateway();
const wallet = new FileSystemWallet('/var/wallet');


var RegisterEvent = async function () {
    const adminExists = await wallet.exists('admin');
    if (adminExists) {
        console.log('An identity for the admin user "admin" already exists in the wallet');
    } else {
        var client = await helper.getClientForOrg("mmOrg");
        var ca = client.getCertificateAuthority();
        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const identity = X509WalletMixin.createIdentity('mmOrg', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import('admin', identity);
    }
    const gatewayOptions = {
        wallet: wallet,
        identity: "admin"
    };

    await gateway.connect(connectionProfile, gatewayOptions);

    const network = gateway.getNetwork('mmchannel');

    const contract = network.getContract('ledger');

    const listenerTx = await contract.addContractListener('ledger', 'LEDGER_TX_fieldlee', (err, event, blockNumber, transactionId, status) => {
        if (err) {
            console.error(err);
            logger.error(err);
            return;
        }
        logger.debug(event);
        console.log(event);
        logger.debug(`Block Number: ${blockNumber} Transaction ID: ${transactionId} Status: ${status}`)
        console.log(`Block Number: ${blockNumber} Transaction ID: ${transactionId} Status: ${status}`);
    }, { unregister: false, disconnect: false });

    const listenerPay = await contract.addContractListener('ledger', '[0-9a-f]{64}', (err, event, blockNumber, transactionId, status) => {
        if (err) {
            console.error(err);
            logger.error(err);
            return;
        }
        logger.debug(event);
        console.log(event);
        logger.debug(`Block Number: ${blockNumber} Transaction ID: ${transactionId} Status: ${status}`)
        console.log(`Block Number: ${blockNumber} Transaction ID: ${transactionId} Status: ${status}`);
    }, { unregister: false, disconnect: false });



    const listenerBlock = await network.addBlockListener('my-block-listener', (error, block) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Block: ${block}`);
    })

    listenerTx.register();
    listenerPay.register();
    listenerBlock.register();
    logger.debug("===========================================register=============");
};

await RegisterEvent();
logger.debug("===========================================RegisterEvent=============");