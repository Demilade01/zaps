import { Horizon } from '@stellar/stellar-sdk';
import config from '../config';

export class BlockchainService {
    private server: Horizon.Server;

    constructor() {
        this.server = new Horizon.Server(config.stellar.rpcUrl);
    }

    async getAccount(address: string) {
        // Fetch account details from Stellar
        return this.server.loadAccount(address);
    }

    async submitTransaction(xdr: string) {
        // Submit transaction to the network
    }
}

export default new BlockchainService();
