import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type VotingConfig = {
    firstText: string;
    secondText: string;
    voterCode: Cell;
    startTime: number;
    endTime: number;
};

export function votingConfigToCell(config: VotingConfig): Cell {
    return beginCell()
        .storeStringRefTail(config.firstText)
        .storeStringRefTail(config.secondText)
        .storeRef(config.voterCode)
        .storeUint(0, 2)
        .storeUint(config.startTime, 64)
        .storeUint(config.endTime, 64)
        .endCell();
}

export class Voting implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Voting(address);
    }

    static createFromConfig(config: VotingConfig, code: Cell, workchain = 0) {
        const data = votingConfigToCell(config);
        const init = { code, data };
        return new Voting(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint, jettonWallet: Address) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x5b4e69b9, 32).storeUint(0, 64).storeAddress(jettonWallet).endCell(),
        });
    }

    async getContractData(provider: ContractProvider) {
        const result = (await provider.get('get_contract_data', [])).stack;
        return {
            firstText: result.readCell().beginParse().loadStringTail(),
            secondText: result.readCell().beginParse().loadStringTail(),
            voterCode: result.readCell(),
            jettonWallet: result.readAddress(),
            startTime: result.readNumber(),
            endTime: result.readNumber(),
        };
    }

    async getVoterAddress(provider: ContractProvider, user: Address) {
        const result = (
            await provider.get('get_voter_address', [{ type: 'slice', cell: beginCell().storeAddress(user).endCell() }])
        ).stack;
        result.skip();
        return result.readAddress();
    }
}