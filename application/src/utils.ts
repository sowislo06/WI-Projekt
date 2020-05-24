import { FileSystemWallet, Gateway } from 'fabric-network';
import * as path from 'path';
import fs from 'fs';
import FabricCAServices from 'fabric-ca-client';

export async function registerUser(userid:string, userpwd:string, usertype:string) {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'Org1Wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        const connectionProfile = path.resolve(__dirname, '..', 'connection.json');
        let connectionOptions = { wallet, identity: 'org1Admin',
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
         //Möglich Fehlerquelle!!
         const trustedRoots = new Buffer('');
         const ca = new FabricCAServices(caURL, {  trustedRoots, verify: false });

         

         

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
  

    
        ca.register(gateway.getCurrentIdentity(), newUserDetails);

/*
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
*/

        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}
