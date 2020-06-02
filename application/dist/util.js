"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserContext = exports.isUserEnrolled = exports.getUser = exports.enrollUser = exports.registerUser = void 0;
const fabric_network_1 = require("fabric-network");
const path = __importStar(require("path"));
const fs_1 = __importDefault(require("fs"));
const fabric_ca_client_1 = __importDefault(require("fabric-ca-client"));
var network;
var contract;
function registerUser(userid, userpwd, usertype) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'Org1Wallet');
            const wallet = new fabric_network_1.FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            // Create a new gateway for connecting to our peer node.
            const gateway = new fabric_network_1.Gateway();
            const connectionProfile = path.resolve(__dirname, '..', 'connection.json');
            let connectionOptions = { wallet, identity: 'admin',
                discovery: { enabled: true, asLocalhost: true } };
            yield gateway.connect(connectionProfile, connectionOptions);
            // Get the network (channel) our contract is deployed to.
            const network = yield gateway.getNetwork('mychannel');
            // Load connection profile; will be used to locate a gateway
            const ccp = JSON.parse(fs_1.default.readFileSync(connectionProfile, 'utf8'));
            const orgs = ccp.organizations;
            const CAs = ccp.certificateAuthorities;
            const orgMSPID = ccp.client.organization;
            const fabricCAKey = orgs[orgMSPID].certificateAuthorities[0];
            const caURL = CAs[fabricCAKey].url;
            const ca = new fabric_ca_client_1.default(caURL, { trustedRoots: [], verify: false });
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
                    }
                ],
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
        }
        catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    });
}
exports.registerUser = registerUser;
function enrollUser(userid, userpwd, usertype) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create a new file system based wallet for managing identities.
            const walletPath = path.join(process.cwd(), 'Org1Wallet');
            const wallet = new fabric_network_1.FileSystemWallet(walletPath);
            console.log(`Wallet path: ${walletPath}`);
            // Create a new gateway for connecting to our peer node.
            const gateway = new fabric_network_1.Gateway();
            const connectionProfile = path.resolve(__dirname, '..', 'connection.json');
            let connectionOptions = { wallet, identity: 'admin',
                discovery: { enabled: true, asLocalhost: true } };
            yield gateway.connect(connectionProfile, connectionOptions);
            // Get the network (channel) our contract is deployed to.
            const network = yield gateway.getNetwork('mychannel');
            // Load connection profile; will be used to locate a gateway
            const ccp = JSON.parse(fs_1.default.readFileSync(connectionProfile, 'utf8'));
            const orgs = ccp.organizations;
            const CAs = ccp.certificateAuthorities;
            const orgMSPID = ccp.client.organization;
            const fabricCAKey = orgs[orgMSPID].certificateAuthorities[0];
            const caURL = CAs[fabricCAKey].url;
            const ca = new fabric_ca_client_1.default(caURL, { trustedRoots: [], verify: false });
            //Create User JSON Object
            var newUserDetails = {
                enrollmentID: userid,
                enrollmentSecret: userpwd,
                attrs: [
                    {
                        "name": "usertype",
                        "value": usertype,
                        "ecert": true
                    }
                ]
            };
            return ca.enroll(newUserDetails).then(enrollment => {
                //console.log("\n Successful enrollment; Data returned by enroll", enrollment.certificate);
                var identity = fabric_network_1.X509WalletMixin.createIdentity(orgMSPID, enrollment.certificate, enrollment.key.toBytes());
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
        }
        catch (error) {
            console.error(`Failed to submit transaction: ${error}`);
            process.exit(1);
        }
    });
}
exports.enrollUser = enrollUser;
//  function getUser
//  Purpose: get specific registered user
function getUser(userid, adminIdentity) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'Org1Wallet');
        const wallet = new fabric_network_1.FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Create a new gateway for connecting to our peer node.
        const gateway = new fabric_network_1.Gateway();
        const connectionProfile = path.resolve(__dirname, '..', 'connection.json');
        let connectionOptions = { wallet, identity: 'admin',
            discovery: { enabled: true, asLocalhost: true } };
        yield gateway.connect(connectionProfile, connectionOptions);
        let client = gateway.getClient();
        let fabric_ca_client = client.getCertificateAuthority();
        let idService = fabric_ca_client.newIdentityService();
        let user = yield idService.getOne(userid, gateway.getCurrentIdentity());
        let result = { "id": userid };
        // for admin, usertype is "admin";
        if (userid == "admin") {
            result.usertype = userid;
        }
        else { // look through user attributes for "usertype"
            let j = 0;
            while (user.result.attrs[j].name !== "usertype")
                j++;
            result.usertype = user.result.attrs[j].value;
        }
        console.log(result);
        return Promise.resolve(result);
    });
} //  end of function getUser
exports.getUser = getUser;
function isUserEnrolled(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'Org1Wallet');
        const wallet = new fabric_network_1.FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        console.log(`Yes`);
        return wallet.exists(userid).then(result => {
            console.log(result);
            return result;
        }, error => {
            console.log("error in wallet.exists\n" + error.toString());
            throw error;
        });
    });
}
exports.isUserEnrolled = isUserEnrolled;
function setUserContext(userid, pwd) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('\n>>>setUserContext...');
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'Org1Wallet');
        const wallet = new fabric_network_1.FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Create a new gateway for connecting to our peer node.
        const gateway = new fabric_network_1.Gateway();
        const connectionProfile = path.resolve(__dirname, '..', 'connection.json');
        let connectionOptions = { wallet, identity: userid,
            discovery: { enabled: true, asLocalhost: true } };
        yield gateway.connect(connectionProfile, connectionOptions);
        // Verify if user is already enrolled
        const userExists = yield wallet.exists(userid);
        if (!userExists) {
            console.log("An identity for the user: " + userid + " does not exist in the wallet");
            console.log('Enroll user before retrying');
            throw ("Identity does not exist for userid: " + userid);
        }
        try {
            // Connect to gateway using application specified parameters
            console.log('Connect to Fabric gateway with userid:' + userid);
            //let userGateway = new Gateway();
            //await userGateway.connect(ccp, { identity: userid, wallet: wallet, discovery: { enabled: true, asLocalhost: bLocalHost } });
            network = yield gateway.getNetwork("mychannel");
            contract = yield network.getContract("contract");
            console.log(contract);
            return contract;
        }
        catch (error) {
            throw (error);
        }
    });
} //  end of setUserContext(userid)
exports.setUserContext = setUserContext;
this.registerUser("JuliusII", "test", "JuliusType");
this.enrollUser("Julius", "test", "JuliusType");
this.enrollUser("JuliusII", "test", "JuliusType");
this.getUser("Julius");
//# sourceMappingURL=util.js.map