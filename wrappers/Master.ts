import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';
import { Helper } from './Helper';

export type MasterConfig = {
    admin: Address;
    ratio: bigint;
    rewards: bigint;
    startTime: number;
    endTime: number;
    helperCode: Cell;
};

export function masterConfigToCell(config: MasterConfig): Cell {
    return beginCell()
        .storeAddress(config.admin)
        .storeUint(config.ratio, 16)
        .storeUint(0, 10)
        .storeRef(
            beginCell()
                .storeUint(0, 2)
                .storeCoins(config.rewards)
                .storeUint(config.startTime, 64)
                .storeUint(config.endTime, 64)
                .storeRef(config.helperCode)
                .endCell(),
        )
        .endCell();
}

export class Master implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Master(address);
    }

    static createFromConfig(config: MasterConfig, code: Cell, workchain = 0) {
        const data = masterConfigToCell(config);
        const init = { code, data };
        return new Master(contractAddress(workchain, init), init);
    }

    async sendDeploy(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        opts: {
            queryId?: bigint;
            wallet1: Address;
            wallet2: Address;
        },
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x34a2ec21, 32)
                .storeUint(opts.queryId ?? 0, 64)
                .storeAddress(opts.wallet1)
                .storeAddress(opts.wallet2)
                .endCell(),
        });
    }

    async getContractData(provider: ContractProvider) {
        let result = (await provider.get('get_contract_data', [])).stack;
        return {
            admin: result.readAddress(),
            ratio: result.readBigNumber(),
            amount1: result.readBigNumber(),
            amount2: result.readBigNumber(),
            wallet1: result.readAddress(),
            wallet2: result.readAddress(),
            rewards: result.readBigNumber(),
            startTime: result.readNumber(),
            endTime: result.readNumber(),
            helperCode: result.readCell(),
        };
    }

    async getHelper(provider: ContractProvider, user: Address) {
        let result = (
            await provider.get('get_helper', [{ type: 'slice', cell: beginCell().storeAddress(user).endCell() }])
        ).stack;
        result.skip();
        return Helper.createFromAddress(result.readAddress());
    }

    async sendSendServiceMessage(
        provider: ContractProvider,
        via: Sender,
        value: bigint,
        opts: {
            queryId?: bigint;
            message: Cell;
            mode: number;
        },
    ) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell()
                .storeUint(0x000a3c66, 32)
                .storeUint(opts.queryId ?? 0, 64)
                .storeRef(opts.message)
                .storeUint(opts.mode, 8)
                .endCell(),
        });
    }
}
