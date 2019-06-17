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


wallet.exists('admin').then((adminExists)=>{
    if (adminExists) {
        console.log('An identity for the admin user "admin" already exists in the wallet');
    } else {
        helper.getClientForOrg("mmOrg").then((client)=>{
            var ca = client.getCertificateAuthority();
            ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' }).then((enrollment)=>{
                const identity = X509WalletMixin.createIdentity('mmOrg', enrollment.certificate, enrollment.key.toBytes());
                wallet.import('admin', identity).then(()=>{

                },(err)=>{
                    logger.error(err);
                });
            },(err)=>{
                logger.error(err);
            });
        },(err)=>{
            logger.error(err);
        })
    }
    const gatewayOptions = {
        wallet: wallet,
        identity: "admin"
    };
    gateway.connect(connectionProfile, gatewayOptions).then(()=>{
        const network = gateway.getNetwork('mmchannel');

        const contract = network.getContract('ledger');
        contract.addContractListener('ledger', 'LEDGER_TX_fieldlee', (err, event, blockNumber, transactionId, status) => {
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
    });
},(err)=>{
    logger.error(err);
});

var RegisterEvent = async function () {
    const adminExists = await wallet.exists('admin');
    
    const gatewayOptions = {
        wallet: wallet,
        identity: "admin"
    };

    await gateway.connect(connectionProfile, gatewayOptions);

    const network = gateway.getNetwork('mmchannel');

    const contract = network.getContract('ledger');

    var listenerTx = await contract.addContractListener('ledger', 'LEDGER_TX_fieldlee', (err, event, blockNumber, transactionId, status) => {
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

    var listenerPay = await contract.addContractListener('ledger', '[0-9a-f]{64}', (err, event, blockNumber, transactionId, status) => {
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

    var listenerBlock = await network.addBlockListener('my-block-listener', (err, block) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(`Block: ${block}`);
    });

    listenerTx.register();
    listenerPay.register();
    listenerBlock.register();
    logger.debug("===========================================register=============");
};


logger.debug("===========================================RegisterEvent=============");