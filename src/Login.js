import React from 'react'
import { MdAdminPanelSettings, MdPeople, MdSchool } from 'react-icons/md'
import { FaChalkboard } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import useAuth from './hooks/useAuth'
import axios from './api/axios'
import { useNavigate } from 'react-router-dom'
import Spinner from './components/Spinner'
const Login = () => {

  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [show, setShow] = useState(false)
  const [form, setForm] = useState(false)
  const [person, setPerson] = useState('')
  const [errMsg, setErrMsg] = useState("")
  const [visible, setVisible] = useState(false)
  const [login, setlogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [pwdForm, setPwdForm] = useState(false)
  const [oldPwd, setOldPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")

  const errRef = useRef();
  const loginRef = useRef();
  useEffect(() => {
    setErrMsg('')
  }, [user, pwd])

  useEffect(() => {
    loginRef.current.focus()
  }, [])

  const handleForm = (p) => {
    setForm(!form)
    setPerson(p)
  }

  const handleCancel = () => {
    setForm(false)
    setShow(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const lOGIN_URL = person === "Admin" ? "/adminauth" : person === "Teacher" ? "/teacherauth" : person === "Faculty Admin" ? "/facultyadminauth" : "/studentauth"
      const response = await axios.post(lOGIN_URL, JSON.stringify({ email: user, pwd }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )
      const roles = await response?.data?.roles
      setAuth({ user, pwd, roles })
      setUser('')
      setPwd('')
      const path = person === "Admin" ? "/admin" : person === "Teacher" ? "/teacher" : person === "Faculty Admin" ? "/facultyadmin" : "/student"
      setIsLoading(false)
      navigate(path)
    }
    catch (err) {
      setIsLoading(false)
      if (!err?.response) {
        setErrMsg("No Server Response!")
      }
      else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password")
      }
      else if (err.response?.status === 401) {
        setErrMsg("Unauthroized User")
      }
      else {
        setErrMsg(err)
      }
      errRef.current.focus()
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleVisible = () => {
    setVisible(!visible)
  }
  const handleLoginButton = () => {
    setShow(!show)
    setlogin(!login)
    setForm(false)
  }

  return (
    <article className=" bg-[#fff] min-h-screen">
      <header className='flex justify-between p-2 fixed top-0 w-full px-6 bg-[#fff] shadow-sm shadow-[#13213d]'>
        <button className=' w-16 h-16 sm:w-20 sm:h-20 '>
          <a href="/"><img src="./img/ucsp.png" alt="ucsp-logo" /></a>
        </button>
        <button className=' text-[#14213d] font-bold w-24 h-10 border border-[#14213d] rounded-full text-sm my-4 hover:text-[#fca311] shadow-sm shadow-[#13213d] outline-none ' onClick={handleLoginButton} ref={loginRef}>
          {login && <span>Login</span>}
          {!login && <span>Cancel</span>}
        </button>
      </header>
      <main className='flex flex-col lg:flex-row justify-center items-center h-screen p-2 '>
        {!form && !show && <h1 className=' text-2xl font-bold font-Concert text-center animate-open-menu selection:text-[#e5e5e5] selection:bg-[#13213d]'><span className=' selection:text-[#fca311] ]'>U</span>niversity Of <span className=' selection:text-[#fca311]'>C</span>omputer <span className=' selection:text-[#fca311]'>S</span>tudies(<span className=' selection:text-[#fca311]'>P</span>athein) <br /><span className='text-[#fca311]'>EDUVIEW</span></h1>}

        <img src="./img/hero.png" alt="University of computer studies" className=' w-screen h-auto lg:w-2/3' />

        {!form && show &&
          <article className=' absolute top-1/4 flex flex-col lg:flex-row justify-center gap-10  w-3/4 items-center sm:justify-center max-w-2xl animate-open-menu '>
            <button className='border-[#fca311] text-[#fca311]  px-14 py-4 rounded-full bg-[#13213d] flex justify-center gap-4 items-center font-Concert max-w-56 shadow-lg shadow-[#13213d]' onClick={() => handleForm("Admin")}>
              <MdAdminPanelSettings className=' w-10 h-10' />
              Admin
            </button >
            <button className='border-[#fca311] text-[#fca311]  px-14 py-4 rounded-full bg-[#13213d] flex justify-center gap-4 items-center font-Concert max-w-56 shadow-lg shadow-[#13213d] ' onClick={() => handleForm("Faculty Admin")}>
              <MdSchool className=' w-10 h-10' />
              Faculty Admin
            </button >
            <button className='border-[#fca311] text-[#fca311]  px-14 py-4 rounded-full bg-[#13213d] flex justify-center gap-4 items-center font-Concert max-w-56 shadow-lg shadow-[#13213d]' onClick={() => handleForm("Teacher")}>
              <FaChalkboard className='w-10 h-10' />
              Teacher
            </button>
            <button className='border-[#fca311] text-[#fca311]  px-14 py-4 rounded-full bg-[#13213d] flex justify-center gap-4 items-center font-Concert max-w-56 shadow-lg shadow-[#13213d]' onClick={() => handleForm("Student")}>
              <MdPeople className='w-10 h-10' />
              Student
            </button>
          </article>

        }

        {/* login form */}
        {form &&
          <article className=' absolute top-1/4'>

            <form className='bg-[#13213d] text-[#fca311] p-8 font-Concert flex flex-col gap-2 w-80 rounded-3xl animate-open-menu shadow-sm shadow-[#e5e5e5] ' onSubmit={handleSubmit}>
              <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
              <h2 className=' text-lg'>{person} Login</h2>
              <label htmlFor="mail">Mail:</label>
              <input
                type="text"
                id="mail"
                autoComplete="off"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                className=' p-1 rounded-md text-[#463e3e] outline-none text-lg '
                spellCheck='false'
              />

              <label htmlFor="password">Password:</label>
              <span className='flex bg-[#fff] items-center  rounded-md'>
                <input
                  type={visible ? 'text' : 'password'}
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  className=' p-1  text-[#000] outline-none text-lg grow  rounded-md'
                />
                {visible && pwd && <FaEye onClick={handleVisible} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                {!visible && pwd && <FaEyeSlash onClick={handleVisible} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
              </span>



              <span className='flex justify-between mt-5'>
                <button className='bg-[#fca311] text-[#000] w-24 p-2 rounded-2xl ' type='submit'>
                  {isLoading && <Spinner />}

                  {!isLoading && <p>Login</p>}
                </button>
                <button className='bg-[#fca311] text-[#000] w-24 p-2 rounded-2xl ' onClick={handleCancel}>
                  Cancel
                </button>
              </span>
            </form>
          </article>
        }
      </main>
    </article>
  )
}

export default Login