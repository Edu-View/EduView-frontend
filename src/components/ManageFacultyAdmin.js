import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaPlus, FaTrash, FaEdit, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'
import { MdOutlineAdminPanelSettings } from 'react-icons/md'
import axios from '../api/axios'
import Spinner from './Spinner'
import { IoKey } from 'react-icons/io5'

const ManageFacultyAdmin = ({ facultyAdmin, setFacultyAdmin, mobile, setMobile, faculty, visible, setVisible }) => {
  const [adminName, setAdminName] = useState("")
  const [adminMail, setAdminMail] = useState("")
  const [adminPwd, setAdminPwd] = useState("")
  const [fac, setFac] = useState(faculty[0]?.faculty)
  const [adminId, setAdminId] = useState("")
  const [updateForm, setUpdateForm] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [resetForm, setResetForm] = useState(false)
  const [reset, setReset] = useState("")
  const ADMIN_URL = "/facultyadmin"
  const errRef = useRef();

  useEffect(() => {
    setVisible(false)
  }, [])
  useEffect(() => {
    setErrMsg('')
  }, [adminName, adminMail, fac])


  const addFacultyAdmin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {

      await axios.post(ADMIN_URL, JSON.stringify({ username: adminName, email: adminMail, pwd: adminPwd, faculty: fac }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }

      )
      const response = await axios.get("facultyadmin")
      setFacultyAdmin(response.data)
      setAdminName("")
      setAdminMail("")
      setAdminPwd("")
      setIsLoading(false)
    }
    catch (err) {
      setIsLoading(false)
      if (!err?.response) {
        setErrMsg("No Server Response!")
      }
      else if (err.response?.status === 400) {
        setErrMsg("Please fill the required fields")
      }
      else if (err.response?.status === 409) {
        setErrMsg("Duplicate Admin Email or Faculty")
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

  const deleteFacultyAdmin = async (id) => {
    try {
      await axios.delete(ADMIN_URL, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
        data: JSON.stringify({ id }) // Send data in the 'data' field
      });

      const response = await axios.get("facultyadmin")
      setFacultyAdmin(response.data)

    } catch (err) {
      setErrMsg(err);
    }
  }
  const handleUpdateForm = (id, username, email, faculty) => {
    setUpdateForm(true)
    setAdminId(id)
    setAdminMail(email)
    setAdminName(username)
    setFac(faculty)
  }

  const updateFacultyAdmin = async (e) => {
    e.preventDefault()
    try {

      await axios.put(ADMIN_URL, JSON.stringify({ id: adminId, username: adminName, faculty: fac, email: adminMail }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )
      setUpdateForm(false)
      const response = await axios.get("facultyadmin")
      await setFacultyAdmin(response.data)
      setFacultyAdmin(response.data)
      setAdminName("")
      setAdminMail("")
      setAdminPwd("")

    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response!")
      }
      else if (err.response?.status === 400) {
        setErrMsg("Please fill out required filelds")
      }
      else if (err.response?.status === 204) {
        setErrMsg("No Admin Found")
      }
      else {
        setErrMsg(err)
      }
      errRef.current.focus()
    }
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    try {

      await axios.put("facultyadminauth/reset", JSON.stringify({ email: adminMail, pwd: reset }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )
      setResetForm(false)
      const response = await axios.get("facultyadmin")
      await setFacultyAdmin(response.data)
      setFacultyAdmin(response.data)
      setAdminMail("")
      setReset("")

    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response!")
      }
      else if (err.response?.status === 400) {
        setErrMsg("Please fill out required filelds")
      }
      else {
        setErrMsg(err)
      }
      errRef.current.focus()
    }
  }
  const handleUpdateCancel = () => {
    setUpdateForm(false)
    setAdminName("")
    setAdminMail("")
    setAdminPwd("")
  }

  const handleResetForm = (mail, name) => {
    setAdminMail(mail)
    setAdminName(name)
    setResetForm(true)

  }

  const handleResetCancel = () => {
    setResetForm(false)
    setAdminMail("")
    setReset("")
    setAdminName("")
  }

  return (
    <section className='w-full  h-screen bg-[#e5e5e5] flex flex-col'>
      <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
        <button className='block sm:hidden p-2'>
          <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
        </button>
        <h2>Faculty Admin</h2>
      </article>
      <article className='p-4 '>
        {<form onSubmit={addFacultyAdmin} className='flex flex-row gap-4 items-center flex-wrap  p-2' name='faculty_admin_adding_form'>
          <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} required className='bg-white rounded-lg p-2 md:p-3 focus:outline-[#fca311] text-lg shadow-md shadow-[#13213d] w-1/3 lg:w-1/6' placeholder='Admin Name' />
          <input type="mail" value={adminMail} onChange={(e) => setAdminMail(e.target.value)} required className='bg-white rounded-lg p-2 md:p-3 focus:outline-[#fca311] text-lg shadow-md shadow-[#13213d]  w-1/2 md:w-1/4' placeholder='Admin Mail' />
          <span className='flex bg-[#fff] items-center rounded-lg p-2 md:p-3 focus:outline-[#fca311] text-lg shadow-md shadow-[#13213d] w-1/3  md:w-1/5'>
            <input type={visible ? 'text' : 'password'} id="password" value={adminPwd} onChange={(e) => setAdminPwd(e.target.value)} className='text-[#14213d] w-full outline-none rounded-md' required autoComplete='off' placeholder='Password' />
            {visible && adminPwd && <FaEye onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
            {!visible && adminPwd && <FaEyeSlash onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
          </span>

          <select id="faculty" className='bg-white rounded-lg p-3 focus:outline-[#fca311] text-lg shadow-md shadow-[#13213d] w-2/5' value={fac} onChange={(e) => setFac(e.target.value)} >
            {faculty.map((faculty) =>
              <option value={faculty.faculty} key={faculty._id}>{faculty.faculty}</option>
            )}

          </select>
          <button type='submit' className=' bg-[#fca311] rounded-2xl p-4  hover:scale-105 shadow-md shadow-[#13213d] text-[#000]'>
            {isLoading && <Spinner />}

            {!isLoading && <FaPlus />}
          </button>
          <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold p-2' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
        </form>}
      </article>
      <ul className='w-full flex flex-col gap-4 items-start p-6 overflow-y-auto  grow'>
        {facultyAdmin.map((admin) =>
        (<li key={admin._id} className='w-full shadow-sm  p-4 font-Concert rounded-xl  flex  flex-col lg:flex-row  justify-between  shadow-[#13213d] items-start  lg:items-center  bg-[#fff] text-[#000] gap-2'>
          <span className='flex items-center gap-4 w-72'><MdOutlineAdminPanelSettings className='w-5 h-5' />{admin.faculty}</span>
          <span className='w-44'>{admin.username}</span>
          <span className='w-48'>{admin.email}</span>
          <FaEdit onClick={() => handleUpdateForm(admin._id, admin.username, admin.email, admin.faculty)} className=' cursor-pointer text-[#000] hover:text-[#fca311] w-6 h-6' />
          <IoKey onClick={() => handleResetForm(admin.email, admin.username)} className=' cursor-pointer text-[#000] hover:text-[#fca311] w-6 h-6' />
          <FaTrash onClick={() => deleteFacultyAdmin(admin._id)} className=' cursor-pointer text-[#000] hover:text-[#fca311] w-5 h-5' />
        </li>)
        )}
      </ul>


      {
        updateForm &&
        <article className='fixed left-0 top-0 bg-transparent w-screen h-screen flex justify-center items-center'>
          <form className='flex flex-col bg-[#000] p-6 w-full lg:w-1/2  text-[#fca311] gap-4 rounded-xl animate-open-menu max-w-96 ' name='faculty_admin_updating_form'>
            <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold p-2' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
            <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} className='text-[#14213d] p-1 w-full outline-none rounded-md' required placeholder='Admin Name' />
            <input type="text" value={adminMail} onChange={(e) => setAdminMail(e.target.value)} className='text-[#14213d] p-1 w-full outline-none rounded-md' required placeholder='Admin Mail' />
            <select id="faculty" className='p-2  border border-[#fca311] my-4 rounded-lg font-Concert text-[#000]' value={fac} onChange={(e) => setFac(e.target.value)} >
              {faculty.map((faculty) =>
                <option value={faculty.faculty}>{faculty.faculty}</option>
              )}

            </select>
            <span>
              <button type='submit' className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md' onClick={updateFacultyAdmin}>Update</button>
              <button onClick={handleUpdateCancel} className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md'>Cancel</button>
            </span>
          </form>
        </article>
      }
      {
        resetForm &&
        <article className='fixed left-0 top-0 bg-transparent w-screen h-screen flex justify-center items-center'>
          <form className='flex flex-col bg-[#000] p-6 w-full lg:w-1/2  text-[#fca311] gap-4 rounded-xl animate-open-menu max-w-96 ' name='faculty_admin_password_reset_form'>
            <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold p-2' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
            <label htmlFor="reset" >Reset Password  for {adminName}</label>
            <span className='flex bg-[#fff] items-center rounded-lg p-2  focus:outline-[#fca311] text-lg shadow-md shadow-[#13213d]'>
              <input type={visible ? 'text' : 'password'} id="password" value={reset} onChange={(e) => setReset(e.target.value)} className='text-[#14213d] w-full outline-none rounded-md' required autoComplete='off' placeholder='Password' />
              {visible && reset && <FaEye onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
              {!visible && reset && <FaEyeSlash onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
            </span>
            <span>
              <button type='submit' className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md' onClick={resetPassword}>Reset</button>
              <button onClick={handleResetCancel} className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md'>Cancel</button>
            </span>
          </form>
        </article>
      }
    </section>
  )
}

export default ManageFacultyAdmin