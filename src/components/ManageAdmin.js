import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaTrash, FaPlus, FaEye, FaEyeSlash } from 'react-icons/fa'
import { MdAdminPanelSettings } from 'react-icons/md'
import { useState, useEffect, useRef } from 'react'
import Spinner from './Spinner'
import axios from '../api/axios'

const ManageAdmin = ({ admin, setAdmin, mobile, setMobile, visible, setVisible, isLoading, setIsLoading }) => {
  const [adminForm, setAdminForm] = useState(false)
  const [adminMail, setAdminMail] = useState("")
  const [adminPwd, setAdminPwd] = useState("")
  const [confirmForm, setConfirmForm] = useState(false)
  const [deleteId, setDeleteID] = useState("")
  const [errMsg, setErrMsg] = useState("")
  const ADMIN_URL = "/admin"
  const errRef = useRef()
  useEffect(() => {
    setVisible(false)
  }, [])
  useEffect(() => {
    setErrMsg('')
  }, [adminMail, adminPwd])
  const addAdmin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrMsg("")

    try {

      await axios.post(ADMIN_URL, JSON.stringify({ email: adminMail, password: adminPwd }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }

      )
      const response = await axios.get("admin")
      setAdmin(response.data)
      setAdminForm(false)
      setAdminMail("")
      setAdminPwd("")
      setIsLoading(false)
    }
    catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response!")
      }
      else if (err.response?.status === 400) {
        setErrMsg("Please fill the required fields")
      }
      else if (err.response?.status === 409) {
        setErrMsg("Duplicate Roll Number")
      }
      else {
        setErrMsg(err)
      }
      errRef.current.focus()
      setIsLoading(false)
    }
    finally {
      setIsLoading(false)
    }

  }
  const handleStdDelete = (id) => {
    setConfirmForm(true)
    setDeleteID(id)
  }
  const handleConfirm = async (e) => {
    e.preventDefault();
    if (admin.length < 2) {
      setErrMsg("Action denied: At least one admin is required")
    }
    else {
      try {
        await axios.delete(ADMIN_URL, {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true,
          data: JSON.stringify({ id: deleteId }) // Send data in the 'data' field
        });
        setConfirmForm(false)
        const response = await axios.get("admin")
        await setAdmin(response.data)

      } catch (err) {
        console.log(err);
      }
    }
  }

  return (
    <section className='w-full  h-screen bg-[#e5e5e5]'>
      <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
        <button className='block sm:hidden p-2'>
          <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
        </button>
        <h2 >Admin</h2>
      </article>

      <section className='p-4'>
        {admin.length === 0 && <p className='m-auto text-xl mt-4 p-2 animate-open-menu origin-left'>No Admin to display</p>}
        {admin &&
          <ul className=' w-full  flex flex-col gap-4  p-3'>
            {admin.map((admin) =>
            (<li key={admin._id} className='w-full md:w-1/2 shadow-sm  p-4 font-Concert rounded-xl  flex justify-between  shadow-[#13213d] items-center  bg-[#fff] text-[#000]'>
              <span className='w-96 flex items-center gap-4'><MdAdminPanelSettings className='w-5 h-5' />{admin.email}</span>
              <FaTrash className='cursor-pointer w-8 h-8 p-1  hover:text-[#fca311]' onClick={() => handleStdDelete(admin._id)} />
            </li>)
            )}
          </ul>
        }
      </section>
      <button className='bg-[#fca311] rounded-full p-4 fixed right-0 bottom-0 m-6' onClick={() => setAdminForm(!adminForm)}>
        <FaPlus />
      </button>
      {adminForm &&
        <article className='w-screen h-screen bg-transparent fixed left-0 top-0 flex justify-center items-center'>

          <form className='flex flex-col bg-[#000] p-6 w-full lg:w-1/2  text-[#fca311] gap-2 rounded-xl animate-open-menu max-w-96  shadow-lg shadow-[#13213d]' name='admin adding form'>
            <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold p-2' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
            <h2 className='text-xl'>Add an admin</h2>
            <label htmlFor="email">Email</label>
            <input type="text" id="email" value={adminMail} onChange={(e) => setAdminMail(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />

            <label htmlFor="password">Password</label>
            <span className='flex bg-[#fff] items-center rounded-lg p-2 focus:outline-[#fca311] text-lg shadow-md shadow-[#13213d]'>
              <input type={visible ? 'text' : 'password'} id="password" value={adminPwd} onChange={(e) => setAdminPwd(e.target.value)} className='text-[#14213d] w-full outline-none rounded-md' required autoComplete='off' />
              {visible && adminPwd && <FaEye onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
              {!visible && adminPwd && <FaEyeSlash onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
            </span>
            <span>
              <button type='submit' className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md' onClick={addAdmin}>
                {isLoading && <Spinner />}
                {!isLoading && <p>Add</p>}
              </button>
              <button onClick={() => setAdminForm(false)} className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md'>Cancel</button>
            </span>
          </form>
        </article>

      }

      {confirmForm &&
        <article className='fixed left-0 top-0 bg-transparent w-screen h-screen flex justify-center items-center'>
          <form className='flex flex-col bg-[#000] p-4  w-full lg:w-1/2  text-[#fff] gap-2 rounded-xl animate-open-menu max-w-96 ' name='admin delete form'>
            <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold p-2' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
            <p className='text-xl text-[#fca311]'>Do you want to delete the Admin?</p>
            <span>
              <button type='submit' className='bg-red-600 p-2 px-4 rounded-lg mt-2 mr-4' onClick={handleConfirm} >Delete</button>
              <button className='bg-[#e5e5e5] p-2 px-4 rounded-lg mt-2 mr-4 text-[#14213d]' onClick={() => setConfirmForm(false)}>Cancel</button>
            </span>
          </form>
        </article>
      }

    </section>
  )
}

export default ManageAdmin