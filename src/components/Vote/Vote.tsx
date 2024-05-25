import { TonConnectButton, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { getClient } from "../../ton/tonConfig";
import { Voting } from "../../../wrappers/Voting"
import { Voter } from "../../../wrappers/Voter"
import { Address, beginCell, toNano } from "@ton/core";
import { Link } from "react-router-dom";
import { JettonMaster } from "@ton/ton";


function Vote() {
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const wallet = useTonWallet();
    const [Voted, setVoted] = useState(false); 
    const [Choose, setChoose] = useState("");
    const VotingAddress = "EQAUA0ZFKqqwJAPQpM-ts7-XCw3Jep8Abmhb-x45Q776v_2H";
    const MEH = "EQAVw-6sK7NJepSjgH1gW60lYEkHYzSmK9pHbXstCClDY4BV";

    async function GetInfo(){ 
        if (wallet?.account?.address == null) {
            return;
        }
        const client = await getClient();
        let MasterContract = await client.open(Voting.createFromAddress(Address.parse(VotingAddress)));
        let Data = await MasterContract.getContractData();
        let VoterAddress = await MasterContract.getVoterAddress(Address.parse(wallet?.account?.address));
        let VoterContract = await client.open(Voter.createFromAddress(VoterAddress));
        let VoterData = await VoterContract.getContractData();
        if (VoterData.vote == 0) {return;}
        setChoose(VoterData.vote == 2 ? "YES" : "NO");
        setVoted(true);
    }
    
    useEffect(() => {
        document.title = "MEH DAO";
        GetInfo();
        setInterval(() => GetInfo(), 10000)
    }, [wallet]);

    async function Go() {
        if (tonConnectUI.account?.address == null) return;
        const client = await getClient();
        let body = beginCell()
            .storeUint(0xf8a7ea5, 32)         
            .storeUint(0, 64)                       
            .storeCoins(1) // amount                
            .storeAddress(Address.parse(VotingAddress))                 
            .storeAddress(Address.parse(tonConnectUI.account.address))             
            .storeUint(0, 1)                      
            .storeCoins(toNano(0.02))   
            .storeUint(0, 1)            
            .storeUint(2,2) // 1 вариант                     
            .endCell();
        let jettonMasterCustom = client.open(JettonMaster.create(Address.parse(MEH)));
        let jettonWalletJUSD = await jettonMasterCustom.getWalletAddress(Address.parse(tonConnectUI.account?.address));

        await tonConnectUI.sendTransaction({
                messages: [
            {
                        address: jettonWalletJUSD.toString(),
                        amount: toNano(0.15).toString(),
                        payload: body.toBoc().toString("base64") 
                    }
                ],
                validUntil: Date.now() + 5 * 60 * 1000
            })
    }

    async function Go2() {
        if (tonConnectUI.account?.address == null) return;
        const client = await getClient();
        let body = beginCell()
            .storeUint(0xf8a7ea5, 32)         
            .storeUint(0, 64)                       
            .storeCoins(1) // amount                
            .storeAddress(Address.parse(VotingAddress))                 
            .storeAddress(Address.parse(tonConnectUI.account.address))             
            .storeUint(0, 1)                      
            .storeCoins(toNano(0.02))               
            .storeUint(3,2) // 2 вариант                     
            .endCell();
        await tonConnectUI.sendTransaction({
                messages: [
            {
                        address: VotingAddress, // this.Master.address.toString()
                        amount: toNano(0.15).toString(),
                        payload: body.toBoc().toString("base64") 
                    }
                ],
                validUntil: Date.now() + 5 * 60 * 1000
            })
    }

    return (
        <div className="Main">
            <Link to='/' className="TitleLink">Main</Link>
            <TonConnectButton className="ConBtn" />
            <h1 className="H1">MEH DAO</h1> 
            <h2 className="H3 CenterTimer">Burn 5,000,000 MEH?</h2>
            {Voted ? <h3 className="H3 CenterTimer">You have already voted for: {Choose}</h3> : ""}
            <div className="Tog4">
                {Voted ?
                <>
                <button className="Voting Voted">YES</button>
                <button className="Voting Voted">NO</button>
                </> :
                <>
                <button onClick={Go} className="Voting">YES</button>
                <button onClick={Go2} className="Voting">NO</button>
                </>
                }
            </div>
        </div>
    )
}

export default Vote
