import { Main, Staking } from './components'
import { Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <>
    <Routes>
      <Route path='' element={<Main/>}></Route>
      <Route path='/staking' element={<Staking/>}></Route>
    </Routes>
    </>
  )
}

export default App
