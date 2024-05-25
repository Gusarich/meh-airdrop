import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export class Voter implements Contract {
    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    static createFromAddress(address: Address) {
        return new Voter(address);
    }

    async getContractData(provider: ContractProvider) {
        const result = (await provider.get('get_contract_data', [])).stack;
        return {
            voting: result.readAddress(),
            user: result.readAddress(),
            vote: result.readNumber(),
        };
    }
}