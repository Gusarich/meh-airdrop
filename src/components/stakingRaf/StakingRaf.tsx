import { TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonWallet  } from "@tonconnect/ui-react";
import * as buffer from "buffer"
import { JettonWallet } from '../../../wrappers/JettonWallet';
import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import { anon, meh, raff } from "../../assets";
import { ChangeEventHandler, useEffect, useState } from "react";
import { getClient } from "../../ton/tonConfig";
import { Address, beginCell, Cell, OpenedContract, toNano } from '@ton/core'
import { Master } from "../../../wrappers/MasterRaf"
import { JettonMaster } from "@ton/ton";
import {Link} from "react-router-dom"
import {Sender} from "../../../scripts/sender"

interface InputProps {
  value: string;
  disabled: boolean;
  img: string;
  placeholder: string;
  CurValue: string;
  id: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

function InputU(props: InputProps) {
  return (
    <div className="InputU"> 
      <input min="0" value={props.CurValue} disabled={props.disabled} onChange={(e: any) => props.onChange(e.target.value)} id={props.id} placeholder={props.placeholder} type="text" className="NotDisab InputUMain" />
      <img src={props.img} className="InputUImg" alt="" />
    </div>
  );
}

function InputU2(props: InputProps) {
  return (
    <div className="InputU2"> 
      <input min="0" value={props.value.toString()} disabled={props.disabled} onChange={(e: any) => props.onChange(e.target.value)} id={props.id} placeholder={props.placeholder} type="text" className="InputUMain Sm" />
      <img src={props.img} className="InputUImg" alt="" />
    </div>
  );
}

function App() {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const wallet = useTonWallet();
  const [ratio, setRatio] = useState(0);
  const [ClaimReward, setClaimReward] = useState("0");
  const [ClaimReward2, setClaimReward2] = useState("0");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [reward, setReward] = useState("0");
  const [reward2, setReward2] = useState("0");
  const [Open, setOpen] = useState(false);
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [Balance1, setBalance1] = useState("0 RAFF");
  const [Balance2, setBalance2] = useState("0 MEH");
  const [APR, setAPR] = useState("0");
  const [MasterNumber1, setMasterNumber1] = useState("0");
  const [MasterNumber2, setMasterNumber2] = useState("0");
  const [HelperNumber1, setHelperNumber1] = useState("0 RAFF");
  const [HelperNumber2, setHelperNumber2] = useState("0 MEH");
  const [Text, setText] = useState("not enough MEH");
  const [Enough, setEnough] = useState(true);
  const [Announcement, setAnnouncement] = useState(false);
  const MasterAddress = "UQCahmPNnECWJziD-r75vjFf8g_E_AQ38nrQ_Gw9kOz7TDuU";
  const RAFF = "EQCJbp0kBpPwPoBG-U5C-cWfP_jnksvotGfArPF50Q9Qiv9h";
  const MEH = "EQAVw-6sK7NJepSjgH1gW60lYEkHYzSmK9pHbXstCClDY4BV";

  function RAFFChange(val: any) {
    const T = val.replaceAll(",", "");
    setValue1(T.replace(/(\d)(?=(\d{3})+$)/g, "$1,"));
    // (document.getElementById("MEH") as HTMLInputElement).value = (Number(val) * ratio).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    setValue2((Number(T) * ratio).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,"));
    if (toNano(T) > toNano(Balance1.slice(0, -5).replaceAll(",", "")) || toNano(Number(T) * ratio) > toNano(Balance2.slice(0, -4).replaceAll(",", ""))) {
      setEnough(false);
      if (toNano(T) > toNano(Balance1.slice(0, -5).replaceAll(",", ""))) setText("not enough RAFF");
      else setText("not enough MEH");
    } else {
      setEnough(true);
    }
  }
  
  function MehChange(val: any) {
    const T = val.replaceAll(",", "");
    setValue2(T.replace(/(\d)(?=(\d{3})+$)/g, "$1,"));
    // (document.getElementById("RAFF") as HTMLInputElement).value = (Number(val) / ratio).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    setValue1(Math.trunc(Number(T) / ratio).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,") + "." + (Number(T) % ratio).toString().padStart(2, '0').slice(0, 2));
    if (toNano(T) > toNano(Balance2.slice(0, -4).replaceAll(",", "")) || toNano(Number(T) / ratio) > toNano(Balance1.slice(0, -5).replaceAll(",", ""))) {
      setEnough(false);
      if (toNano(T) > toNano(Balance2.slice(0, -4).replaceAll(",", ""))) setText("not enough MEH");
      else setText("not enough RAFF");
    } else {
      setEnough(true);
    }
  }

  async function GetInfo(){
    const client = await getClient();
    let MasterContract = await client.open(Master.createFromAddress(Address.parse(MasterAddress)));
    let Data = await MasterContract.getContractData();
    setStartTime(Data.startTime * 1000);
    setEndTime(Data.endTime * 1000);
    setRatio(Number(Data.ratio));
    const R = Data.ratio;
    setMasterNumber1((Data.amount1 / toNano(1)).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,") + " RAFF");
    setMasterNumber2((Data.amount2 / toNano(1)).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,") + " MEH");
    let MnAmount = Data.amount1 * Data.ratio;
    if (Data.amount2 < MnAmount) { MnAmount = Data.amount2; }
    const ResultAPR = 660000000000000000 / Number(MnAmount) / 3 * 365;
    setAPR(ResultAPR.toFixed(2).toString());
    // console.log("Okay", ResultAPR, Data);
    setReward((Data.rewards1 / toNano(1)).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,"));
    setReward2((Data.rewards2 / toNano(1)).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,"));
    let Bal1 = "0 RAFF", Bal2 = "0 MEH";
    if (wallet?.account?.address != null) { 
        Bal1 = await GetBalance(RAFF);
        Bal2 = await GetBalance(MEH);
        setBalance1(Bal1.replace(/(\d)(?=(\d{3})+$)/g, "$1,") + " RAFF");
        setBalance2(Bal2.replace(/(\d)(?=(\d{3})+$)/g, "$1,") + " MEH");
    }
    try {
      const T1 = (document.getElementById("RAFF") as HTMLInputElement).value.replaceAll(",", "");
      const T2 = (document.getElementById("MEH") as HTMLInputElement).value.replaceAll(",", "");
      if (toNano(T1) > toNano(Bal1) || toNano(T2) > toNano(Bal2)) {
        setEnough(false);
        if (toNano(T1) > toNano(Bal1)) setText("not enough RAFF");
        else setText("not enough MEH");
      } else {
        setEnough(true);
      }
    } catch {}
    if (wallet?.account?.address != null) {
      setOpen(true);
      let HelperContract = await client.open(await MasterContract.getHelper(Address.parse(wallet?.account?.address)));
      let DataHelper = await HelperContract.getContractData()
      setHelperNumber1((DataHelper.amount1 / toNano(1)).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,") + " RAFF");
      setHelperNumber2((DataHelper.amount2 / toNano(1)).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,") + " MEH");
      let effective_amount: any = DataHelper.amount1 * R;
      if (DataHelper.amount2 < effective_amount) {
        effective_amount = DataHelper.amount2;
      }
      let total_effective_amount: any = Data.amount1 * R;
      if (Data.amount2 < total_effective_amount) {
        total_effective_amount = Data.amount2;
      }
      let delta: any = BigInt(Math.floor(Date.now() / 1000) - DataHelper.lastClaimTime);
      const DifTime: any = BigInt(Data.endTime - Data.startTime)
      let rewards1: any = effective_amount * Data.rewards1 * delta / total_effective_amount / DifTime;
      const result1 = (rewards1 / toNano(1)).toString();
      let ost1 = (rewards1 / (toNano(1) / 100n)).toString().slice(-2);
      setClaimReward(result1.replace(/(\d)(?=(\d{3})+$)/g, "$1,") + "." + ost1 + " RAFF");
      let rewards2: any = effective_amount * Data.rewards2 * delta / total_effective_amount / DifTime;
      const result2 = (rewards2 / toNano(1)).toString();
      let ost2 = (rewards2 / (toNano(1) / 100n)).toString().slice(-2);
      setClaimReward2(result2.replace(/(\d)(?=(\d{3})+$)/g, "$1,") + "." + ost2 + " MEH");
    } 
  }

  async function ClaimRewards() {
    if (wallet?.account?.address == null) return;
    const client = await getClient();
    let MasterContract = await client.open(Master.createFromAddress(Address.parse(MasterAddress)));
    let HelperContract = await client.open(await MasterContract.getHelper(Address.parse(wallet?.account?.address)));
    const body = beginCell()
    .storeUint(0x4d0c099d, 32)
    .storeUint(0, 64)
    .endCell();
    await tonConnectUI.sendTransaction({
      messages: [
        {
          address: HelperContract.address.toString(), // this.Master.address.toString()
          amount: toNano(0.2).toString(),
          payload: body.toBoc().toString("base64") 
        },
      ],
      validUntil: Date.now() + 5 * 60 * 1000
    })
  }

  async function Go2() {
    if (wallet?.account?.address == null) return;
    const client = await getClient();
    let MasterContract = await client.open(Master.createFromAddress(Address.parse(MasterAddress)));
    let HelperContract = await client.open(await MasterContract.getHelper(Address.parse(wallet?.account?.address)));
    const Amount1 = HelperNumber1.slice(0, -5).replaceAll(",", "");
    const Amount2 = HelperNumber2.slice(0, -4).replaceAll(",", "");
    const body = beginCell()
    .storeUint(0x30daa8f0, 32)
    .storeUint(0, 64)
    .storeCoins(toNano(Amount1))
    .storeCoins(toNano(Amount2))
    .endCell();
    await tonConnectUI.sendTransaction({
      messages: [
        {
          address: HelperContract.address.toString(), // this.Master.address.toString()
          amount: toNano(0.2).toString(),
          payload: body.toBoc().toString("base64") 
        },
      ],
      validUntil: Date.now() + 5 * 60 * 1000
    })
  }

  async function GetBalance(address: string) {
    if (tonConnectUI.account?.address == null) return "0";
    const client = await getClient();
		let jettonMasterJUSD = client.open(JettonMaster.create(Address.parse(address)));
		let jettonWalletJUSD = await jettonMasterJUSD.getWalletAddress(Address.parse(tonConnectUI.account?.address));
		let ContactJUSD = await client.open(JettonWallet.createFromAddress(Address.parse(jettonWalletJUSD.toString())));
		const Ans = await ContactJUSD.getJettonBalance();
    return (Ans / toNano(1)).toString();
  }

  async function Go() {
    if (tonConnectUI.account?.address == null) return;
    const T1 = (document.getElementById("RAFF") as HTMLInputElement).value.replaceAll(",", "");
    const T2 = (document.getElementById("MEH") as HTMLInputElement).value.replaceAll(",", "");
    if (toNano(T1) > toNano(Balance1.slice(0, -5).replaceAll(",", "")) || toNano(T2) > toNano(Balance2.slice(0, -4).replaceAll(",", ""))) {
      return;
    }
    const client = await getClient();
    // RAFF
    let body1 = beginCell()
        .storeUint(0xf8a7ea5, 32)         
        .storeUint(0, 64)                       
        .storeCoins(toNano((document.getElementById("RAFF") as HTMLInputElement).value.replaceAll(",", ""))) // amount                
        .storeAddress(Address.parse(MasterAddress))                 
        .storeAddress(Address.parse(tonConnectUI.account.address))             
        .storeUint(0, 1)                      
        .storeCoins(toNano(0.1))               
        .storeUint(0,1)                        
        .endCell();
    let jettonMasterCustom1 = client.open(JettonMaster.create(Address.parse(RAFF)));
    let jettonWalletJUSD1 = await jettonMasterCustom1.getWalletAddress(Address.parse(tonConnectUI.account?.address));
    // MEH
    let body = beginCell()
        .storeUint(0xf8a7ea5, 32)         
        .storeUint(0, 64)                       
        .storeCoins(toNano((document.getElementById("MEH") as HTMLInputElement).value.replaceAll(",", ""))) // amount                
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
      <Link to='/' className="TitleLink">Main</Link>
      <TonConnectButton className="ConBtn" />
      <h1 className="H1">Staking</h1> 
      <h3 className="H33 CenterTimer">Reward pool: {reward} RAFF + {reward2} MEH</h3>
      <h3 className="H333 CenterTimer">{Date.now() >= startTime ?  "Staking APR" : "Estimated APR (might change)"}: {APR}%</h3>
      <h4 className="H3 CenterTimer">{Date.now() < startTime ? "Timer is counting down to the end of the deposit period" : "Timer is counting down to the end of the rewarding period"}</h4>
      <FlipClockCountdown 
        to={Date.now() >= startTime ? endTime : startTime} 
        // to={startTime}
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
          {Date.now() >= startTime ? <h3 className="H3Reward">Available rewards: {ClaimReward} + {ClaimReward2}</h3> :
          <div className="Tog">
            <div className="Show">
              <h5 className="H5">available: {Balance1}</h5>
              <InputU CurValue={value1} value={"0"} disabled={false} onChange={RAFFChange} img={raff} placeholder={"RAFF"} id={"RAFF"} />
            </div>
            <div className="Show">
              <h5 className="H5">available: {Balance2}</h5>
              <InputU CurValue={value2} value={"0"} disabled={false} onChange={MehChange} img={meh} placeholder={"MEH"} id={"MEH"} />
            </div>
          </div>}
          <div className="Tog3">
            {Date.now() >= startTime ?
            <div className="Show">
              <button onClick={ClaimRewards} className="Stake">{Date.now() >= endTime ? "Unstake & Claim" : "Claim"}</button>
            </div> :
            <>
              <button onClick={Go} className="Stake">Stake</button>
              <button onClick={Go2} className="Stake">Unstake all</button>
            </>
            }
          </div>
          {!Enough ? <h4 className="Anoun">{Text}</h4> : ""}
          {Announcement ? <h4 className="Anoun2">Your MEH to RAFF ratio is incorrect. Please “Unstake all” and stake again.</h4> : ""}
        </> 
      }
      <div className="Info">
        <h1 className="AllTitle">Total staked</h1>
        <div className="Tog2">
          <InputU2 CurValue={""} value={MasterNumber1} disabled={true} onChange={RAFFChange} img={raff} placeholder={"RAFF"} id={"RAFF"} />
          <InputU2 CurValue={""} value={MasterNumber2} disabled={true} onChange={MehChange} img={meh} placeholder={"MEH"} id={"MEH"} />
        </div>
        {!Open ? 
        <>
          <h2 className="Center">Connect your wallet to stake</h2>
          <button onClick={OpenModal} className="BtnCon2">Connect</button>
        </> : 
        <>
          <h1 className="AllTitle">Your stake</h1>
          <div className="Tog2">
            <InputU2 CurValue={""} value={HelperNumber1} disabled={true} onChange={RAFFChange} img={raff} placeholder={"RAFF"} id={"RAFF"} />
            <InputU2 CurValue={""} value={HelperNumber2} disabled={true} onChange={MehChange} img={meh} placeholder={"MEH"} id={"MEH"} />
          </div>
        </>}
      </div>
      <footer className="Footer">
        <a href="https://t.me/mehtoken">Telegram</a>
        <a href="https://x.com/meh_ton">X</a>
      </footer>
    </div>
  )
}

export default App
