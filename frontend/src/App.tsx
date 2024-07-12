
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import { Game } from "./pages/Game"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import  Dummy  from "./pages/Dummy"
import { Simulation } from "./pages/Simulation"
// import { Simulation } from "./pages/Simulation"
function App() {

  return (
   <>
   <BrowserRouter>
      <Routes>
        {/* <Route path="simulation" element={<Simulation />} /> */}
        <Route path='/' index element={<Navigate to='/login' />} />
        <Route path="simulation" element={<Simulation />} />
        <Route path="game" index element={<Game />} />

        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        {/* <Route path="simulation" element={<Simulation />} /> */}

      </Routes>
   </BrowserRouter>
   </>
  )
}

export default App
