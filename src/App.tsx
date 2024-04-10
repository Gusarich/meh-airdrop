import { TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonWallet  } from "@tonconnect/ui-react";
import './App.css'
import * as buffer from "buffer"
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import { anon, meh } from "./assets";
import { ChangeEventHandler, useEffect, useState } from "react";
import { getClient } from "./ton/tonConfig";
import { Address, beginCell, Cell, OpenedContract, toNano } from '@ton/core'
import { Master } from "../wrappers/Master"
import { JettonMaster } from "@ton/ton";
import {Sender} from "../scripts/sender"

interface InputProps {
  value: string;
  disabled: boolean;
  img: string;
  placeholder: string;
  id: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

function InputU(props: InputProps) {
  return (
    <div className="InputU"> 
      <input min="0" defaultValue={props.value} disabled={props.disabled} onChange={(e: any) => props.onChange(e.target.value)} id={props.id} placeholder={props.placeholder} type="number" className="NotDisab InputUMain" />
      <img src={props.img} className="InputUImg" alt="" />
    </div>
  );
}

function InputU2(props: InputProps) {
  return (
    <div className="InputU"> 
      <input min="0" value={props.value.toString()} disabled={props.disabled} onChange={(e: any) => props.onChange(e.target.value)} id={props.id} placeholder={props.placeholder} type="text" className="InputUMain Sm" />
      <img src={props.img} className="InputUImg" alt="" />
    </div>
  );
}

function App() {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const wallet = useTonWallet();
  const [ratio, setRatio] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [reward, setReward] = useState("0");
  const [Open, setOpen] = useState(false);
  const [MasterNumber1, setMasterNumber1] = useState("0");
  const [MasterNumber2, setMasterNumber2] = useState("0");
  const [HelperNumber1, setHelperNumber1] = useState("0");
  const [HelperNumber2, setHelperNumber2] = useState("0");
  const MasterAddress = "EQAx-B_myGJ6i7u6_JRZz33n9fDfIF_NF3bwPt3OwP6p_py1";
  const ANON = "EQDv-yr41_CZ2urg2gfegVfa44PDPjIK9F-MilEDKDUIhlwZ";
  const MEH = "EQAVw-6sK7NJepSjgH1gW60lYEkHYzSmK9pHbXstCClDY4BV";

  function AnonChange(val: any) {
    (document.getElementById("MEH") as HTMLInputElement).value = (Number(val) * ratio).toString();
  }
  
  function MehChange(val: any) {
    (document.getElementById("ANON") as HTMLInputElement).value = (Number(val) / ratio).toString();
  }

  async function GetInfo(){
    const client = await getClient()
    let MasterContract = await client.open(Master.createFromAddress(Address.parse(MasterAddress)));
    let Data = await MasterContract.getContractData()
    setStartTime(Data.startTime * 1000);
    setRatio(Number(Data.ratio));
    setMasterNumber1((Data.amount1 / toNano(1)).toString() + " ANON");
    setMasterNumber2((Data.amount2 / toNano(1)).toString() + " MEH");
    setReward((Data.rewards / toNano(1)).toString());
    if (wallet?.account?.address != null) {
      setOpen(true);
      let HelperContract = await client.open(await MasterContract.getHelper(Address.parse(wallet?.account?.address)));
      let Data = await HelperContract.getContractData()
      setHelperNumber1((Data.amount1 / toNano(1)).toString() + " ANON");
      setHelperNumber2((Data.amount2 / toNano(1)).toString() + " MEH");
    } 
  }

  async function Go2() {
    if (tonConnectUI.account?.address == null) return;
    const client = await getClient();
    let MasterContract = await client.open(Master.createFromAddress(Address.parse(MasterAddress)));
    let HelperContract = await client.open(await MasterContract.getHelper(Address.parse(tonConnectUI.account?.address)));
    await HelperContract.sendUnstake(
      new Sender(tonConnectUI),
      toNano(0.2),
      {
        amount1: toNano(HelperNumber1.slice(0, -5)),
        amount2: toNano(HelperNumber2.slice(0, -4)),
      }
    )
  }

  async function Go() {
    if (tonConnectUI.account?.address == null) return;
    const client = await getClient();
    // ANON
    let body1 = beginCell()
        .storeUint(0xf8a7ea5, 32)         
        .storeUint(0, 64)                       
        .storeCoins(toNano((document.getElementById("ANON") as HTMLInputElement).value)) // amount                
        .storeAddress(Address.parse(MasterAddress))                 
        .storeAddress(Address.parse(tonConnectUI.account.address))             
        .storeUint(0, 1)                      
        .storeCoins(toNano(0.1))               
        .storeUint(0,1)                        
        .endCell();
    let jettonMasterCustom1 = client.open(JettonMaster.create(Address.parse(ANON)));
    let jettonWalletJUSD1 = await jettonMasterCustom1.getWalletAddress(Address.parse(tonConnectUI.account?.address));
    // MEH
    let body = beginCell()
        .storeUint(0xf8a7ea5, 32)         
        .storeUint(0, 64)                       
        .storeCoins(toNano((document.getElementById("MEH") as HTMLInputElement).value)) // amount                
        .storeAddress(Address.parse(MasterAddress))                 
        .storeAddress(Address.parse(tonConnectUI.account.address))             
        .storeUint(0, 1)                      
        .storeCoins(toNano(0.1))               
        .storeUint(0,1)                        
        .endCell();
    let jettonMasterCustom = client.open(JettonMaster.create(Address.parse(MEH)));
    let jettonWalletJUSD = await jettonMasterCustom.getWalletAddress(Address.parse(tonConnectUI.account?.address));

    await tonConnectUI.sendTransaction({
			messages: [
        {
					address: jettonWalletJUSD1.toString(), // this.Master.address.toString()
					amount: toNano(0.15).toString(),
					payload: body1.toBoc().toString("base64") 
				},
				{
					address: jettonWalletJUSD.toString(), // this.Master.address.toString()
					amount: toNano(0.15).toString(),
					payload: body.toBoc().toString("base64") 
				},
			],
			validUntil: Date.now() + 5 * 60 * 1000
		})
  }

  async function OpenModal(){
    await tonConnectUI.openModal();
  }

  useEffect(() => {GetInfo(); setInterval(() => GetInfo(), 5000)}, [wallet]);
  return (
    <div className="Main">
      <TonConnectButton className="ConBtn" />
      <h1 className="H1">Staking</h1> 
      <h3 className="H3">Reward pool: {reward} MEH</h3>
      <FlipClockCountdown 
        to={startTime} 
        className={"FlipClock"}
        digitBlockStyle={{background: "linear-gradient(180deg, #272E32 0%, #232A2E 100%)", 
        color: "#9FA2A4", height: 48, fontSize: 35, borderRadius: 10,
        width: 36}}
        labelStyle={{color: "#9FA2A4"}}
        separatorStyle={{color: "#9FA2A4", size: 5.5}}
        dividerStyle={{height: 0}}
        hideOnComplete={false}
      >
      </FlipClockCountdown>
      {!Open ? "" :
        <>
          <div className="Tog">
            <InputU value={"0"} disabled={false} onChange={AnonChange} img={anon} placeholder={"ANON"} id={"ANON"} />
            <InputU value={"0"} disabled={false} onChange={MehChange} img={meh} placeholder={"MEH"} id={"MEH"} />
          </div>
          <div className="Tog3">
            <button onClick={Go} className="Stake">Stake</button>
            <button onClick={Go2} className="Stake">Unstake all</button>
          </div>
        </> 
      }
      <div className="Info">
        <h1 className="AllTitle">Total staked</h1>
        <div className="Tog2">
          <InputU2 value={MasterNumber1} disabled={true} onChange={AnonChange} img={anon} placeholder={"ANON"} id={"ANON"} />
          <InputU2 value={MasterNumber2} disabled={true} onChange={MehChange} img={meh} placeholder={"MEH"} id={"MEH"} />
        </div>
        {!Open ? 
        <>
          <h2 className="Center">Connect your wallet to stake</h2>
          <button onClick={OpenModal} className="BtnCon2">Connect</button>
        </> : 
        <>
          <h1 className="AllTitle">Your stake</h1>
          <div className="Tog2">
            <InputU2 value={HelperNumber1} disabled={true} onChange={AnonChange} img={anon} placeholder={"ANON"} id={"ANON"} />
            <InputU2 value={HelperNumber2} disabled={true} onChange={MehChange} img={meh} placeholder={"MEH"} id={"MEH"} />
          </div>
        </>}
      </div>
      <footer className="Footer">
        <a href="https://t.me/mehtoken">Telegram</a>
      </footer>
    </div>
  )
}

export default App
