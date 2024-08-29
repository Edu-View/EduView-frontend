import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import { MdGroupAdd } from 'react-icons/md'
import { FaRegBuilding } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'
import Spinner from './Spinner'
import axios from '../api/axios'
import { FaUsersViewfinder } from 'react-icons/fa6'

const ManageFaculty = ({ faculty, setFaculty, mobile, setMobile, student }) => {
  const [facultyVal, setFcaultyVal] = useState("")
  const [errMsg, setErrMsg] = useState("")
  const [stdForm, setStdForm] = useState(false)
  const [stdInfo, setStdInfo] = useState(false)
  const [roll, setRoll] = useState("")
  const [updateId, setUpdateId] = useState("")
  const [rollAray, setRollArray] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const FAC_URL = "/faculty"
  const errRef = useRef()

  useEffect(() => {
    setErrMsg('')
  }, [facultyVal])

  const addFaculty = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {

      await axios.post(FAC_URL, JSON.stringify({ faculty: facultyVal, subjects: [], students: [] }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }

      )
      const response = await axios.get("faculty")
      setFaculty(response.data)
      setFcaultyVal("")
      setIsLoading(false)
    }
    catch (err) {
      setIsLoading(false)
      if (!err?.response) {
        setErrMsg("No Server Response!")
      }
      else if (err.response?.status === 400) {
        setErrMsg("Please enter a Faculty name")
      }
      else if (err.response?.status === 409) {
        setErrMsg("Duplicate Faculty")
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

  const deleteFaculty = async (id) => {
    try {
      await axios.delete(FAC_URL, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
        data: JSON.stringify({ id }) // Send data in the 'data' field
      });

      const response = await axios.get("faculty")
      setFaculty(response.data)

    } catch (err) {
      setErrMsg(err)
    }
  }


  const handleStdForm = (id) => {
    setStdForm(true)
    setRollArray((faculty.filter((fac) => fac._id === id))[0].students)
    setUpdateId(id)
  }

  const handlStdInfo = (id) => {
    setStdInfo(true)
    setRollArray((faculty.filter((fac) => fac._id === id))[0].students)
    setUpdateId(id)
  }


  const handleAdd = (e) => {
    e.preventDefault()
    if (!rollAray.includes(roll)) {
      setRollArray(prev => [...prev, student.find((std) => std.rollno === roll)._id])
      setRoll("")
    }
    else {
      setRoll("")
    }
  }


  const handleUpdate = async () => {
    setIsLoading(true)
    try {
      await axios.put(FAC_URL, JSON.stringify({ id: updateId, students: rollAray }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )
      const response = await axios.get("faculty")
      await setFaculty(response.data)

      setStdForm(false)
      setIsLoading(false)
    } catch (err) {
      console.log(err);
      setIsLoading(false)
    }

    finally {
      setIsLoading(false)
    }
  }



  return (
    <section className='w-full  h-screen bg-[#e5e5e5] flex flex-col'>
      <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
        <button className='block sm:hidden p-2'>
          <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
        </button>
        <h2 className='px-2'>Faculty</h2>
      </article>
      <article className='p-4'>
        <form onSubmit={addFaculty} className='flex items-center p-2 gap-7  flex-wrap w-full lg:w-1/2' name='faculty adding form'>
          <input type="text" value={facultyVal} onChange={(e) => setFcaultyVal(e.target.value)} required className='bg-white rounded-lg p-3 focus:outline-[#fca311] text-lg shadow-md shadow-[#13213d]  grow ' placeholder='Faculty name' />
          <button type='submit' className=' bg-[#fca311] rounded-2xl p-4  hover:scale-105 shadow-md shadow-[#13213d] text-[#000]'>
            {isLoading && <Spinner />}
            {!isLoading && <FaPlus />}
          </button>
          <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold ' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
        </form>
      </article>
      <ul className='w-full flex flex-col gap-4 items-start  overflow-y-auto  grow p-4'>
        {faculty.map((faculty) =>
        (<li key={faculty._id} className='w-full shadow-sm  p-4 font-Concert rounded-xl  flex justify-between  shadow-[#13213d] items-center  bg-[#fff] text-[#000] gap-8 lg:gap-14 '>
          <span className='text-sm lg:text-lg flex items-center gap-4 grow w-44'><FaRegBuilding className='w-5 h-5' />{faculty.faculty}</span>
          <MdGroupAdd title='add guardian students' className='text-[#000] hover:text-[#fca311] w-6 h-6  lg:w-8 lg:h-8 cursor-pointer' onClick={() => handleStdForm(faculty._id)} />
          <FaUsersViewfinder title='view guardian students' className='text-[#000] hover:text-[#fca311] w-6 h-6  lg:w-8 lg:h-8 cursor-pointer' onClick={() => handlStdInfo(faculty._id)} />
          <FaTrash onClick={() => deleteFaculty(faculty._id)} className=' cursor-pointer text-[#000] hover:text-[#fca311] w-5 h-5' />
        </li>)
        )}
      </ul>
      {stdForm &&
        <article className='w-screen h-screen bg-transparent fixed left-0 top-0 flex justify-center items-center p-2'>
          <form className='flex flex-col bg-[#000] border border-[#fff] p-6 w-full lg:w-1/2  text-[#fca311] gap-4 rounded-xl animate-open-menu flew' onSubmit={(e) => e.preventDefault()} name='faculty-form'>
            <label htmlFor="student">{faculty.filter(fac => fac._id === updateId)[0].faculty}</label>
            <span className='flex justify-start gap-6 flex-wrap'>
              <input list="studentForm" id="student" name="student" className='outline-none p-2 text-[#000]  border-[#fca311] border rounded-xl' value={roll} onChange={(e) => setRoll(e.target.value)} />
              <datalist id="studentForm">
                {
                  student.map((std) =>
                    <option value={std.rollno}>
                      {std.rollno}
                    </option>
                  )
                }

              </datalist>
              <button className='bg-[#fca311] text-[#000] px-4 rounded-xl' onClick={handleAdd}>Add</button>
              <button type='submit' onClick={() => handleUpdate()} className='bg-[#fca311] text-[#000] px-4 rounded-xl p-2'>
                {isLoading && <Spinner />}
                {!isLoading && <span>Done</span>}
              </button>
              <button onClick={() => setStdForm(!stdForm)} className='bg-[#fca311] text-[#000] px-4 rounded-xl p-2'>Cancel</button>
            </span>
            <span className='flex gap-4 flex-wrap overflow-y-auto'>
              {rollAray.map((element, index) =>
                <span className='bg-[#e5e5e5] text-[#000] p-2 rounded-xl flex items-center justify-between gap-2' key={index}>{student.find(std => std._id === element).rollno}
                  <button onClick={() => setRollArray(rollAray.filter(roll => roll !== element))}><FaTimes className='hover:text-[#fca311]' /></button>
                </span>
              )}
            </span>
          </form>
        </article>
      }

      {stdInfo &&
        <article className='w-screen h-screen bg-transparent fixed left-0 top-0 flex justify-center items-center p-2'>
          <section className='flex flex-col bg-[#000] border border-[#fff] p-6 w-full lg:w-1/2  text-[#fca311] gap-4 rounded-xl animate-open-menu flew items-end'>
            <button onClick={() => setStdInfo(!stdInfo)} className='bg-[#fca311] text-[#000] w-12 h-12  rounded-xl flex items-center justify-center'>
              <FaTimes />
            </button>
            <h2 className='text-[#fca311] text-xl w-full text-left'>{faculty.filter(fac => fac._id === updateId)[0].faculty}</h2>
            <section className='overflow-y-auto grow w-full flex flex-col gap-2 max-h-80'>
              {!rollAray.length && <span className='text-[#fff]'>No Guardian student in this faculty</span>}
              {rollAray.map((element, index) =>
                <span className='bg-[#e5e5e5] text-[#000] p-3 rounded-xl flex  justify-start text-sm lg:text-lg items-center w-full gap-2' key={index}>
                  <span className='w-20'> {student.find(std => std._id === element).rollno}</span>
                  <span className='w-40'>{student.find(std => std._id === element).username}</span>
                  <span>{student.find(std => std._id === element).semester}</span>

                </span>
              )}
            </section>

          </section>
        </article>
      }

    </section>
  )
}

export default ManageFaculty