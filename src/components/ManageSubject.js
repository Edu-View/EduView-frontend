import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { useState, useRef, useEffect } from 'react'
import axios from '../api/axios'
import Spinner from './Spinner'


const ManageSubject = ({ subject, setSubject, mobile, setMobile, semester, facultyName, teacher, setTeacher }) => {
  const [subVal, setSubVal] = useState("")
  const [subName, setSubName] = useState("")
  const [semVal, setSemVal] = useState("SemesterI")
  const [type, setType] = useState("CST")
  const [errMsg, setErrMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const SUB_URL = "/subject"
  const errRef = useRef();


  useEffect(() => {
    setErrMsg('')
  }, [semVal, subVal, type])

  const addSubject = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await axios.post(SUB_URL, JSON.stringify({ semester: semVal, type: type, subject: subVal, name: subName, faculty: facultyName }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )
      const response = await axios.get("subject")
      setSubject(response.data)
      setSubVal("")
      setSubName("")
      setIsLoading(false)
    }
    catch (err) {
      setIsLoading(false)
      if (!err?.response) {
        setErrMsg("No Server Response!")
      }
      else if (err.response?.status === 400) {
        setErrMsg("Please enter  a subject")
      }
      else if (err.response?.status === 409) {
        setErrMsg("Duplicate subject")
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

  const deleteSubject = async (id, sub) => {
    try {
      await axios.delete(SUB_URL, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
        data: JSON.stringify({ id }) // Send data in the 'data' field
      });
      const teacherId = teacher.find(tch => tch.subjectcode.includes(sub))
      const subArray = teacher.find(tch => tch.subjectcode.includes(sub)).subjectcode
      const newSubArray = subArray.filter(subj => subj !== sub)
      await axios.put("/teacher", JSON.stringify({ id: teacherId, subjectcode: newSubArray }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )
      const teacherResponse = await axios.get("teacher")
      setTeacher(teacherResponse.data)
      const response = await axios.get("subject")
      setSubject(response.data)

    } catch (err) {
      setErrMsg(err)
    }
  }


  return (
    <section className='w-full  h-screen bg-[#e5e5e5] flex flex-col'>
      <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
        <button className='block sm:hidden p-2'>
          <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
        </button>
        <h2>Subjects</h2>
      </article>
      <form onSubmit={addSubject} className='shadow-md p-4 flex items-center gap-4 flex-wrap ' >
        <input type="text" value={subVal} onChange={(e) => setSubVal(e.target.value)} className='bg-white rounded-lg p-3 focus:outline-[#fca311] text-lg shadow-md shadow-[#13213d]' placeholder='Subject Code' required />
        <input type="text" value={subName} onChange={(e) => setSubName(e.target.value)} className='bg-white rounded-lg p-3 focus:outline-[#fca311] text-lg shadow-md shadow-[#13213d]' placeholder='Subject Name' required />
        <select className='bg-white rounded-lg p-3 focus:outline-[#fca311] text-lg shadow-md shadow-[#13213d] ' value={type} onChange={(e) => setType(e.target.value)}>
          <option value="CST">CST</option>
          <option value="CS">CS</option>
          <option value="CT">CT</option>
        </select>
        <select value={semVal} onChange={(e) => setSemVal(e.target.value)} className='bg-white rounded-lg p-3 focus:outline-[#fca311] text-lg shadow-md shadow-[#13213d] '>
          {semester.map((semester) =>
            <option value={semester.semester} key={semester._id}>{semester.semester}</option>
          )}
        </select>
        <button type='submit' className=' bg-[#fca311] rounded-2xl p-4  hover:scale-105 shadow-md shadow-[#13213d] text-[#000]'>
          {isLoading && <Spinner />}

          {!isLoading && <FaPlus />}
        </button>
        <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold p-2' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
      </form>
      <ul className='w-full flex flex-col   gap-8 items-start  overflow-y-auto p-4 grow'>
        {semester.map((sem) =>
        (<li key={sem._id} className='w-full lg:w-3/4 shadow-sm  p-4 font-Concert rounded-xl  flex flex-col justify-between  shadow-[#13213d] items-start  bg-[#fff] text-[#000] gap-2'>
          <span className='text-xl  border-[#fca311] border-b-2'>{sem.semester}</span>
          {
            (subject.filter(sub => sub.semester === sem.semester)).map((subject) =>
            (<span key={subject._id} className='text-lg p-3 border-[#000] flex justify-between items-center cursor-pointer gap-4 border-b-2   w-full '>
              <span className='w-24'> {subject.subject}</span>
              <span className='w-96'> {subject.name}</span>
              <FaTrash className=' cursor-pointer hover:text-[#fca311]' onClick={() => deleteSubject(subject._id, subject.subject)} />
            </span>
            )
            )
          }
        </li>)
        )}
      </ul>
    </section>
  )
}

export default ManageSubject