import { FileSystemWallet, Gateway, X509WalletMixin } from 'fabric-network';
import * as path from 'path';
import fs from 'fs';
import FabricCAServices from 'fabric-ca-client';

export async function registerUser(userid, userpwd, usertype) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'Org1Wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        const connectionProfile = path.resolve(__dirname, '..', 'connection.json');
        let connectionOptions = { wallet, identity: 'admin',
        discovery: { enabled: true, asLocalhost: true }};
        await gateway.connect(connectionProfile, connectionOptions);
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        
         // Load connection profile; will be used to locate a gateway
         const ccp = JSON.parse(fs.readFileSync(connectionProfile, 'utf8'));

         const orgs = ccp.organizations;
         const CAs = ccp.certificateAuthorities;
         const orgMSPID = ccp.client.organization;
         const fabricCAKey = orgs[orgMSPID].certificateAuthorities[0];
         const caURL = CAs[fabricCAKey].url;
         const ca = new FabricCAServices(caURL, {  trustedRoots: [], verify: false });

         

         

        //Create User JSON Object
        var newUserDetails = {
            enrollmentID: userid,
            enrollmentSecret: userpwd,
            role: "client",
            //affiliation: orgMSPID,
            //profile: 'tls',
            attrs: [
                {
                    "name": "usertype",
                    "value": usertype,
                    "ecert": true
                }],
            maxEnrollments: 5
        };
  
        //  Register is done using admin signing authority
        return ca.register(newUserDetails, gateway.getCurrentIdentity())
        .then(newPwd => {
        //  if a password was set in 'enrollmentSecret' field of newUserDetails,
        //  the same password is returned by "register".
        //  if a password was not set in 'enrollmentSecret' field of newUserDetails,
        //  then a generated password is returned by "register".
        console.log('\n Secret returned: ' + newPwd);
        return newPwd;
        }, error => {
        console.log('Error in register();  ERROR returned: ' + error.toString());
        return Promise.reject(error);
        });


        // Disconnect from the gateway.
       // await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

export async function enrollUser(userid, userpwd, usertype) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'Org1Wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        const connectionProfile = path.resolve(__dirname, '..', 'connection.json');
        let connectionOptions = { wallet, identity: 'admin',
        discovery: { enabled: true, asLocalhost: true }};
        await gateway.connect(connectionProfile, connectionOptions);
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        
         // Load connection profile; will be used to locate a gateway
         const ccp = JSON.parse(fs.readFileSync(connectionProfile, 'utf8'));

         const orgs = ccp.organizations;
         const CAs = ccp.certificateAuthorities;
         const orgMSPID = ccp.client.organization;
         const fabricCAKey = orgs[orgMSPID].certificateAuthorities[0];
         const caURL = CAs[fabricCAKey].url;
         const ca = new FabricCAServices(caURL, {  trustedRoots: [], verify: false });

         

         

        //Create User JSON Object
        var newUserDetails = {
            enrollmentID: userid,
            enrollmentSecret: userpwd,
            attrs: [
                {
                    "name": "usertype", // application role
                    "value": usertype,
                    "ecert": true
                }]
        };
  
        return ca.enroll(newUserDetails).then(enrollment => {
            //console.log("\n Successful enrollment; Data returned by enroll", enrollment.certificate);
            var identity = X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
            return wallet.import(userid, identity).then(notused => {
                return console.log('msg: Successfully enrolled user, ' + userid + ' and imported into the wallet');
            }, error => {
                console.log("error in wallet.import\n" + error.toString());
                throw error;
            });
        }, error => {
            console.log("Error in enrollment " + error.toString());
            throw error;
        });


        // Disconnect from the gateway.
       // await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}
this.enrollUser("TESTUSERII", "userpwd", "test");