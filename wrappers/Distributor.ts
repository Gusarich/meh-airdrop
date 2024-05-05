import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Dictionary,
    Sender,
    SendMode,
    toNano,
} from '@ton/core';

export type DistributorConfig = {
    prefix: number;
    users: Dictionary<Address, bigint>;
    admin: Address;
};

export function distributorConfigToCell(config: DistributorConfig): Cell {
    return beginCell()
        .storeUint(config.prefix, 2)
        .storeDict(config.users)
        .storeAddress(config.admin)
        .storeUint(0, 2)
        .endCell();
}

export class Distributor implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Distributor(address);
    }

    static createFromConfig(config: DistributorConfig, code: Cell, workchain = 0) {
        const data = distributorConfigToCell(config);
        const init = { code, data };
        return new Distributor(contractAddress(workchain, init), init);
    }

    async sendSetJettonWallet(provider: ContractProvider, via: Sender, value: bigint, jettonWallet: Address) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x1e13798f, 32).storeAddress(jettonWallet).endCell(),
        });
    }

    async sendSendServiceMessage(provider: ContractProvider, via: Sender, value: bigint, message: Cell, mode: number) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x011055e7, 32).storeRef(message).storeUint(mode, 16).endCell(),
        });
    }

    async sendClaim(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        });
    }

    async getAvailableReward(provider: ContractProvider, user: Address): Promise<bigint> {
        const result = (
            await provider.get('get_available_reward', [
                { type: 'slice', cell: beginCell().storeAddress(user).endCell() },
            ])
        ).stack;
        return result.readBigNumber();
    }
}