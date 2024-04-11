import { SendTransactionRequest, TonConnect, UserRejectsError, WalletInfo, WalletInfoInjected, WalletInfoInjectable, TonConnectUI } from "@tonconnect/ui-react";
import { Address, SenderArguments, beginCell, Cell } from "@ton/core";
import { StateInit, storeStateInit } from "@ton/ton"
import TonWeb from "tonweb";

export interface ISender {
    readonly address?: Address;
    connector: TonConnect;
    send(args: SenderArguments): Promise<void>;

}


export class Sender implements ISender {
    readonly address: Address | undefined;
    connector: TonConnect;
    constructor(tonConnectUI: TonConnectUI) {
        this.connector = tonConnectUI.connector as TonConnect;
        this.address = tonConnectUI.account ? Address.parse(tonConnectUI.account.address) : undefined;
    }

    async send(args: SenderArguments): Promise<void> {
        const stateInit: StateInit = {
            code: args.init?.code,
            data: args.init?.data,
        }
        const stateInitCell = beginCell()
            .store(storeStateInit(stateInit))
            .endCell();
        let state_init_boc = TonWeb.utils.bytesToBase64(await stateInitCell.toBoc());
        await this.connector.sendTransaction({
            messages: [
                {
                    address: args.to.toString(),
                    amount: args.value.toString(),
                    payload: args.body?.toBoc().toString("base64"),
                    stateInit: state_init_boc,
                },
            ],
            validUntil: Date.now() + 5 * 60 * 1000
        });
    }
}

function addReturnStrategy(url: string, returnStrategy: 'back' | 'none'): string {
    const link = new URL(url);
    link.searchParams.append('ret', returnStrategy);
    return link.toString();
}
