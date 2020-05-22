import { FileSystemWallet, Gateway } from 'fabric-network';
import * as path from 'path';

//ALT: main() WEG!
/*
async function main() {
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'Org1Wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        const connectionProfile = path.resolve(__dirname, '..',
        'connection.json');
        let connectionOptions = { wallet, identity: 'org1Admin',
        discovery: { enabled: true, asLocalhost: true }};
        await gateway.connect(connectionProfile, connectionOptions);
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('contract');
        // Submit the specified transaction.
        //await contract.submitTransaction('createAsset', '002', 'Night Watch');
        console.log(`Transaction has been submitted`);
        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}
main();
*/

//noch nicht geprüft...
export async function createAsset(assetId: string, assetName: string, category: string, station: string) {
    let response = {};
    try {
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'Org1Wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        const connectionProfile = path.resolve(__dirname, '..',
        'connection.json');
        let connectionOptions = { wallet, identity: 'org1Admin',
        discovery: { enabled: true, asLocalhost: true }};
        await gateway.connect(connectionProfile, connectionOptions);
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');
        // Get the contract from the network.
        const contract = network.getContract('contract');
        // Submit the specified transaction.
        // createCategory transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('createAsset', assetId, assetName, category, station);
        console.log('Transaction has been submitted');
        // Disconnect from the gateway.
        await gateway.disconnect();
        //Return
        return response;
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

export async function readAsset(assetId: string) {

}

export async function queryAllAssets(assetId: string) {

}
