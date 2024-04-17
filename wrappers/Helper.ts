import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export class Helper implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Helper(address);
    }

    async sendClaim(provider: ContractProvider, via: Sender, value: bigint, opts: { queryId?: bigint }) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x4d0c099d, 32)
                .storeUint(opts.queryId ?? 0, 64)
                .endCell(),
        });
    }

    async sendUnstake(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        opts: { queryId?: bigint; amount1?: bigint; amount2?: bigint },
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x30daa8f0, 32)
                .storeUint(opts.queryId ?? 0, 64)
                .storeCoins(opts.amount1 ?? 0)
                .storeCoins(opts.amount2 ?? 0)
                .endCell(),
        });
    }

    async getContractData(provider: ContractProvider) {
        let result = (await provider.get('get_contract_data', [])).stack;
        return {
            master: result.readAddress(),
            user: result.readAddress(),
            amount1: result.readBigNumber(),
            amount2: result.readBigNumber(),
            startTime: result.readNumber(),
            endTime: result.readNumber(),
            lastClaimTime: result.readNumber(),
        };
    }
}