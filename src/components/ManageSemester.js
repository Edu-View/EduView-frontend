import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaPlus, FaTrash, FaRegCalendarAlt } from 'react-icons/fa'
import { IoIosArrowDropup, IoIosArrowDropdown } from 'react-icons/io'
import { useState, useRef, useEffect } from 'react'
import axios from '../api/axios'
import Spinner from './Spinner'

const ManageSemester = ({ semester, setSemester, mobile, setMobile }) => {
  const [semVal, setSemVal] = useState("Semester I")
  const [errMsg, setErrMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const SEM_URL = "/semester"
  const errRef = useRef();
  useEffect(() => {
    setErrMsg('')
  }, [semVal])

  const addSemester = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await axios.post(SEM_URL, JSON.stringify({ semester: semVal }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )
      const response = await axios.get("semester")
      setSemester(response.data)
      setIsLoading(false)
    }
    catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response!")
      }
      else if (err.response?.status === 400) {
        setErrMsg("Please selecta a semester")
      }
      else if (err.response?.status === 409) {
        setErrMsg("Duplicate Semester")
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

  const deleteSemester = async (id) => {
    try {
      await axios.delete(SEM_URL, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
        data: JSON.stringify({ id })
      });

      const response = await axios.get("semester")
      setSemester(response.data)

    } catch (err) {
      setErrMsg(err)
    }
  }

  const handleClick = (val) => {
    setSemVal(val)
    setOpen(false)
  }

  return (
    <section className='w-full  h-screen bg-[#e5e5e5] flex flex-col'>
      <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff]  '>
        <button className='block sm:hidden p-2'>
          <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
        </button>
        <h2 className='px-2'>Semester</h2>
      </article>
      {!mobile && <section className='flex gap-6 items-center  text-xl  relative'>

        <form onSubmit={addSemester} className='flex items-center gap-6 p-6 flex-wrap' name='semester-adding-form'>
          <span
            onClick={() => setOpen(prev => !prev)}
            className='bg-white rounded-xl px-6 py-3 shadow-md shadow-[#13213d] flex items-center gap-4 cursor-pointer'
          >
            <span>{semVal}</span>
            <span className='text-xl'>{open ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}</span>
          </span>
          <button
            type='submit'
            className=' bg-[#fca311] rounded-2xl p-4  hover:scale-105 shadow-md shadow-[#13213d] text-[#000]'
          >
            {isLoading ? <Spinner /> : <FaPlus />}
          </button>
          <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold text-lg' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
        </form>

        {open && (
          <section className='flex flex-col items-start top-20 left-6 z-10 bg-white gap-1 rounded-xl shadow-lg shadow-[#13213d] border-[#fca311] border animate-dropdown max-h-72 overflow-y-auto origin-top absolute'>
            {['Semester I', 'Semester II', 'Semester III', 'Semester IV', 'Semester V', 'Semester VI', 'Semester VII', 'Semester VIII', 'Semester IX', 'Semester X'].map((semester, index) => (
              <button
                key={index}
                onClick={() => handleClick(semester)}
                className='text-md hover:text-white p-3 flex items-center gap-2 hover:bg-[#14213d] w-full active:text-[#fca311]'
              >
                <FaRegCalendarAlt className='w-5 h-5' />
                {semester}
              </button>
            ))}
          </section>
        )}
      </section>}

      <ul className='w-full flex flex-col gap-4 items-start px-6 overflow-y-auto grow'>
        {semester.map((semester) =>
        (<li key={semester._id} className='w-full lg:w-2/3 shadow-sm  p-3 font-Concert rounded-xl  flex justify-between  shadow-[#13213d] items-center  bg-[#fff] text-[#000]'>
          <span className='flex gap-4 items-center text-xl'><FaRegCalendarAlt className='w-5 h-5' />{semester.semester}</span>
          <button onClick={() => deleteSemester(semester._id)} className=' cursor-pointer p-2 px-6 rounded-2xl shadow-md shadow-[#13213d] bg-[#000]  text-[#fff]  flex gap-4 items-center hover:scale-105'>Delete <FaTrash /></button>
        </li>)
        )}
      </ul>
    </section>
  )
}

export default ManageSemester