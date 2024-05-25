import { Main, Staking, StakingRaf, ClaimPage, Vote } from './components'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <>
    <Routes>
      <Route path='' element={<Main/>}></Route>
      <Route path='/staking' element={<Staking/>}></Route>
      <Route path='/stakingraff' element={<StakingRaf/>}></Route>
      <Route path='/claim' element={<ClaimPage/>}></Route>
      <Route path='/DAO' element={<Vote/>}></Route>
    </Routes>
    </>
  )
}

export default App
