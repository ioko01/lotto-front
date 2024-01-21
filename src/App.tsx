import { Route, Routes, useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import Login from './components/Login'
import { AuthContext } from './context/AuthContextProvider'
import { PageNotFound } from './components/member/PageNotFound'
import { Leftbar } from './components/member/Leftbar'
import axios from "axios";
import { TUserRoleEnum } from './models/User'
import { LeftbarAdmin } from './components/admin/LeftbarAdmin'
import { Home } from './components/member/Home'
import { Bill } from './components/member/Bill'
import { Reward } from './components/member/Reward'
import { Report } from './components/member/Report'
import { Rule } from './components/member/Rule'
import { Howto } from './components/member/Howto'
import { BillCheck } from './components/member/BillCheck'
import { Link } from './components/member/Link'

function App() {
  axios.defaults.withCredentials = true
  axios.defaults.baseURL = import.meta.env.BASE_URL
  const { isUser, status } = useContext(AuthContext)
  const isLoading = document.getElementById("loading")
  const navigate = useNavigate()

  if (isLoading) {
    setTimeout(() => {
      if (status === "SUCCESS" || status === "LOGOUT") {
        isLoading.style.display = "none"
      } else {
        isLoading.removeAttribute("style")
        isLoading.style.position = "fixed"
      }
    }, 100)
  }

  useEffect(() => {
    if (!isUser && (status === "SUCCESS" || status === "LOGOUT")) {
      navigate("/")
    }
  }, [isUser, status])

  return (
    isUser && status === "SUCCESS" ?
      [TUserRoleEnum.ADMIN, TUserRoleEnum.AGENT, TUserRoleEnum.MANAGER, TUserRoleEnum.MANAGE_REWARD].includes(isUser.role as TUserRoleEnum) ?
        <LeftbarAdmin /> :
        isUser.role === TUserRoleEnum.MEMBER ?
          <>
            <Leftbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/bill/:id" element={<Bill />} />
              {/* <Route path="/order/list" element={<OrderList />} /> */}
              {/* <Route path="/order/group" element={<OrderGroup />} /> */}
              <Route path="/report" element={<Report />} />
              <Route path="/reward" element={<Reward />} />
              <Route path="/about/rule" element={<Rule />} />
              <Route path="/about/howto" element={<Howto />} />
              <Route path="/about/link" element={<Link />} />
              <Route path="/bill/check/:id" element={<BillCheck />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </>
          : null :
      status === "LOGOUT" ?
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes> : null
  )
}

export default App
