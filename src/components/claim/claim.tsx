import { Address, beginCell, toNano } from "@ton/core";
import { TonConnectButton, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Master } from "../../../wrappers/Master";
import { getClient } from "../../ton/tonConfig";
import styles from "./Main.module.scss"
import { Distributor } from "../../../wrappers/Distributor"
import { Sender } from "../../../scripts/sender";

function ClaimPage() {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const wallet = useTonWallet();
  const MasterAddress = "EQAx-B_myGJ6i7u6_JRZz33n9fDfIF_NF3bwPt3OwP6p_py1";
  const ANON = "EQDv-yr41_CZ2urg2gfegVfa44PDPjIK9F-MilEDKDUIhlwZ";
  const MEH = "EQAVw-6sK7NJepSjgH1gW60lYEkHYzSmK9pHbXstCClDY4BV";
  const DistributorAddress = "EQBpunYORFowzfbNxZdLwP0sRzOR705JrODChkR9yOxIBkBU"
  const DistributorAddress2 = "EQAbjrttvSW1873SgghFzyOuw9hk6-__Ja2ej4MC991Dlj_0"

  async function ClaimRewards() {
    if (wallet?.account?.address == null) return;
    const client = await getClient();
    let NeedAddress = DistributorAddress;
    let DistributorContract = await client.open(Distributor.createFromAddress(Address.parse(DistributorAddress)));
    let Data = await DistributorContract.getAvailableReward(Address.parse(wallet?.account?.address));
    if (Data == 0n) {
      NeedAddress = DistributorAddress2;
    }
    // DistributorContract.sendClaim(new Sender(tonConnectUI), Data);
    // const body = beginCell()
    // .storeUint(0x4d0c099d, 32)
    // .storeUint(0, 64)
    // .endCell();
    await tonConnectUI.sendTransaction({
      messages: [
        {
          address: NeedAddress,
          amount: toNano(0.01).toString(),
          // payload: body.toBoc().toString("base64") 
        },
      ],
      validUntil: Date.now() + 5 * 60 * 1000
    })
  }

  async function CheckInfo() {
    if (wallet?.account?.address == null) {
      setText("Connect your wallet to check if you’re eligible");
      setCan(false);
      return;
    }
    const client = await getClient();
    try {
      let DistributorContract = await client.open(Distributor.createFromAddress(Address.parse(DistributorAddress)));
      let Data = await DistributorContract.getAvailableReward(Address.parse(wallet?.account?.address));
      if (Data == 0n) {
        DistributorContract = await client.open(Distributor.createFromAddress(Address.parse(DistributorAddress2)));
        Data = await DistributorContract.getAvailableReward(Address.parse(wallet?.account?.address));
      }
      const res = (Data / toNano(1)).toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,") + "." + (Data / (toNano(1) / 100n)).toString().slice(-2)
      if (res == "0.0") {
        setText("Sorry, but your wallet address is not eligible for airdrop or you have already received the reward 🙁");
        setCan(false);
      } else {
        setText(`You can claim ${res} $MEH 🥳`);
        setCan(true);
      }
    } catch {
      setText("Sorry, but your wallet address is not eligible for airdrop or you have already received the reward 🙁");
      setCan(false);
      return;
    }
  }

  useEffect(() => {
    CheckInfo();
  });

  const [Text, setText] = useState("Connect your wallet to check if you’re eligible")
  const [Can, setCan] = useState(false);
  return (
    <div className="Main">
      <Link to='/' className="TitleLink">Main</Link>
      <TonConnectButton className="ConBtn" />
      <h1 style={{marginBottom: 12}} className="H1 DownH CenterTimer">Claim your reward for <a className="A1" href="https://t.me/mehtoken/97">Activity Contest</a></h1> 
      <h3 className="H333 CenterTimer TextClaim">{Text}</h3>
      <button id="Claim" disabled={!Can} onClick={() => (Can ? ClaimRewards() : "")} className={`Stake ${Can ? "" : "Blocked"}`}>Claim</button>
    </div>
  )
}

export default ClaimPage
