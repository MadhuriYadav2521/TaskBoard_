import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Dashboard from './Components/Dashboard'
import TeacherDashboard from './Components/TeacherDashboard'
import Home from './Components/Home'
import Login from './Components/Login'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Home />} />
          <Route path='/' element={<Login />} />
          <Route path='/studentDash' element={<Dashboard />} />
          <Route path='/teacherDash' element={<TeacherDashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
