import {Link} from "react-router-dom"
import { Logo, telegram, X } from "../../assets"
import styles from "./Main.module.scss"

function Main() {
  return (
    <div className={styles.Main}>
        <header className={styles.Header}>
            <h1 className={styles.LogoH}>MEH</h1>
            <div className={styles.Links}>
                <a className={styles.A} href="https://t.me/mehtoken"><img src={telegram} className={styles.Ico} alt="" /></a>
                <a className={styles.A} href="https://x.com/meh_ton"><img src={X} className={styles.Ico2} alt="" /></a>
            </div>
        </header>
        <div className={styles.Start}>
            <img src={Logo} className={styles.Logo} alt="" />
             <h1 className={styles.Text}>For those who<br/>don't care</h1>
        </div>
        <div className={styles.Buy}>
          <div className={styles.Info}>
            <h2 className={styles.InfoTitle}>What is $MEH?</h2>
            <p className={styles.InfoText}>Community-driven token for those who don’t care about what others think. Originally a simple meme coin, it has now attracted a strong base of supporters, giving it the potential to expand further.</p>
            <div className={styles.InfoLinks}>
              <a href="https://dedust.io/swap/ton/meh" className={styles.A2}>Swap</a>
              <a href="https://tonviewer.com/EQAVw-6sK7NJepSjgH1gW60lYEkHYzSmK9pHbXstCClDY4BV?section=jetton" className={styles.A2}>Explorer</a>
              <Link to="/staking" className={styles.A2}>Staking</Link>
              <Link to="/claim" className={styles.A2}>Claim</Link>
            </div>
          </div>
          <div className={styles.Info}> 
            <h2 className={styles.Title2}>Our links</h2>
            <ul className={styles.Ul}>
              <li className={styles.Spec}><a className={styles.Process2} href="https://coinmarketcap.com/currencies/meh-coin/">Coinmarketcap</a></li>
              <li className={styles.Spec}><a className={styles.Process2} href="https://www.coingecko.com/en/coins/meh-on-ton">Coingecko</a></li>
              <li className={styles.Spec}><a className={styles.Process2} href="https://t.me/mehtoken">Telegram</a></li>
              <li className={styles.Spec}><a className={styles.Process2} href="https://x.com/meh_ton">X</a></li>
            </ul>
          </div>
        </div>
        <h1 className={styles.TitleRoad}>Roadmap</h1>
        <ul className={styles.ListRoad}>
          <li><p className={styles.Done}>Presale</p></li>
          <li><p className={styles.Done}>DeDust.io listing</p></li>
          <li><p className={styles.Done}>Double Staking Event</p></li>
          <li><p className={styles.Done}>Activity Contest</p></li>
          <li><p className={styles.Done}>Coingecko & Coinmarketcap listings</p></li>
          <li className={styles.Spec}><p className={styles.Process}>MEH DAO</p></li>
          <li className={styles.Spec}><p className={styles.Process}>Welcoming Airdrop for new Holders</p></li>
          <li className={styles.Spec}><p className={styles.Process}>Retrodrop for DAO voters</p></li>
          <li className={styles.Spec}><p className={styles.Process}>Airdrop Creation platform</p></li>
          <li className={styles.Spec}><p className={styles.Process}>NFT Collection with more utility</p></li>
          <li className={styles.Spec}><p className={styles.Process}>Airdrops V2</p></li>
          <li className={styles.Spec}><p className={styles.Process}>DAO Creation Platform</p></li>
        </ul>
        <footer className={styles.Footer}>
          <a href="https://t.me/mehtoken">Telegram</a>
          <a href="https://x.com/meh_ton">X</a>
        </footer>
    </div>
  )
}

export default Main
