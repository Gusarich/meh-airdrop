import { Main, Staking, ClaimPage } from './components'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <>
    <Routes>
      <Route path='' element={<Main/>}></Route>
      <Route path='/staking' element={<Staking/>}></Route>
      <Route path='/claim' element={<ClaimPage/>}></Route>
    </Routes>
    </>
  )
}

export default App
