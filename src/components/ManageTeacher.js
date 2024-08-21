import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaChalkboard, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useState, useRef } from 'react'
import { MdBook, MdPeople } from 'react-icons/md'
import axios from '../api/axios'
import { IoKey } from 'react-icons/io5'

const ManageTeacher = ({ teacher, setTeacher, mobile, setMobile, faculty, admin, visible, setVisible, student }) => {
  const TEACHER_URL = "/teacher"
  const [teacherForm, setTeacherForm] = useState(false)
  const [teacherId, setTeacherId] = useState("")
  const [teacherName, setTeacherName] = useState("")
  const [teacherEmail, setTeacherEmail] = useState("")
  const [teacherPwd, setTeacherPwd] = useState("")
  const [updateForm, setUpdateForm] = useState(false)
  const [confirmForm, setConfirmForm] = useState(false)
  const [roll, setRoll] = useState("")
  const [sub, setSub] = useState("")
  const [stdArray, setStdArray] = useState()
  const [subArray, setSubArray] = useState()
  const [stdForm, setStdForm] = useState(false)
  const [subForm, setSubForm] = useState(false)
  const [resetForm, setResetForm] = useState(false)
  const [errMsg, setErrMsg] = useState("")

  const errRef = useRef()

  const addTeacher = async (e) => {
    e.preventDefault()
    try {

      await axios.post(TEACHER_URL, JSON.stringify({ username: teacherName, email: teacherEmail, pwd: teacherPwd, faculty: admin.faculty, students: [], subjectcode: [] }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }

      )
      const response = await axios.get("teacher")
      setTeacher(response.data)
      setTeacherForm(false)
      setTeacherName("")
      setTeacherEmail("")
      setTeacherPwd("")

    }
    catch (err) {
      console.log(err)
    }
  }

  const handleUpdateForm = (id, username, email) => {
    setUpdateForm(true)
    setTeacherId(id)
    setTeacherEmail(email)
    setTeacherName(username)
  }

  const updateTeacher = async (e) => {
    try {
      e.preventDefault()
      await axios.put(TEACHER_URL, JSON.stringify({ id: teacherId, username: teacherName, email: teacherEmail, students: stdArray, subjectcode: subArray }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )
      setTeacherId("")
      setTeacherName("")
      setTeacherEmail("")
      setTeacherPwd("")
      setUpdateForm(false)
      setStdForm(false)
      setSubForm(false)
      const response = await axios.get("teacher")
      setTeacher(response.data)

    } catch (err) {
      console.log(err);
    }
  }

  const handleUpdateCancel = () => {
    setUpdateForm(false)
    setTeacherId("")
    setTeacherName("")
    setTeacherEmail("")
    setTeacherPwd("")
  }

  const handleTeacherDelete = (id) => {
    setConfirmForm(true)
    setTeacherId(id)
  }

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(TEACHER_URL, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
        data: JSON.stringify({ id: teacherId })
      });
      setConfirmForm(false)
      const response = await axios.get("teacher")
      await setTeacher(response.data)
      setTeacherId("")

    } catch (err) {
      console.log(err);
    }
  }


  const handleStdForm = (id) => {
    setStdForm(true)
    setStdArray((teacher.filter((teacher) => teacher._id === id))[0].students)
    setTeacherId(id)
  }
  const handleSubForm = (id) => {
    setSubForm(true)
    setSubArray((teacher.filter((teacher) => teacher._id === id))[0].subjectcode)
    setTeacherId(id)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    if (!stdArray.includes(roll)) {
      setStdArray(prev => [...prev, student.find((std) => std.rollno === roll)._id])
      setRoll("")
    }
    else {
      setRoll("")
    }
  }
  const handleSubAdd = (e) => {
    e.preventDefault()
    if (!subArray.includes(sub)) {
      setSubArray(prev => [...prev, sub])
      setSub("")
    }
    else {
      setSub("")
    }

  }

  const handleResetForm = (mail, name) => {
    setTeacherEmail(mail)
    setTeacherName(name)
    setResetForm(true)

  }

  const resetPassword = async (e) => {
    e.preventDefault()
    try {

      await axios.put("teacherauth/reset", JSON.stringify({ email: teacherEmail, pwd: teacherPwd }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )
      setResetForm(false)
      const response = await axios.get("teacher")
      await teacher(response.data)
      setTeacherEmail("")
      setTeacherName("")
      setTeacherPwd("")

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

  const handleResetCancel = () => {
    setResetForm(false)
    setTeacherEmail("")
    setTeacherName("")
    setTeacherPwd("")
  }


  return (
    <section className='w-full  h-screen bg-[#e5e5e5] flex flex-col'>
      <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
        <button className='block sm:hidden p-2'>
          <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
        </button>
        <h2 >Teachers</h2>
      </article>

      <section className=' overflow-y-auto  mt-4 p-4 grow' >
        {teacher.filter(teacher => teacher.faculty === admin.faculty).length === 0 && <p className='m-auto text-xl mt-4 p-2 animate-open-menu origin-left'>No Teacher to display</p>}
        {teacher.filter(teacher => teacher.faculty === admin.faculty) &&
          <ul className='w-full  flex flex-col gap-2 '>
            {(teacher.filter(teacher => teacher.faculty === admin.faculty)).filter(teacher => teacher.faculty === admin.faculty).map((teacher) =>
            (<li key={teacher._id} className='w-full shadow-sm  p-4 font-Concert rounded-xl  flex  flex-col lg:flex-row justify-between  shadow-[#13213d] items-start lg:items-center  bg-[#fff] text-[#000] gap-2'>
              <span className='w-52 flex items-center gap-4'><FaChalkboard className='w-5 h-5' />{teacher.username}</span>
              <span className='w-48'>{teacher.email}</span>
              <MdPeople className='cursor-pointer w-8 h-8 p-1 hover:text-[#fca311]' onClick={() => handleStdForm(teacher._id)} />
              <MdBook className='cursor-pointer w-8 h-8 p-1 hover:text-[#fca311]' onClick={() => handleSubForm(teacher._id)} />
              <FaEdit className='cursor-pointer w-8 h-8 p-1 hover:text-[#fca311]' onClick={() => handleUpdateForm(teacher._id, teacher.username, teacher.email)} />
              <IoKey onClick={() => handleResetForm(teacher.email, teacher.username)} className=' cursor-pointer text-[#000] hover:text-[#fca311] w-6 h-6' />
              <FaTrash className='cursor-pointer w-8 h-8 p-1 hover:text-[#fca311]' onClick={() => handleTeacherDelete(teacher._id)} />
            </li>)
            )}
          </ul>
        }
        <button className='bg-[#fca311] rounded-full p-4 fixed right-0 bottom-0 m-6' onClick={() => setTeacherForm(!teacherForm)}><FaPlus /></button>

        {teacherForm &&
          <article className='w-screen h-screen bg-transparent fixed left-0 top-0 flex justify-center items-center p-1'>
            <form className='flex flex-col bg-[#000] p-4 w-full lg:w-1/2  text-[#fca311] gap-2 rounded-xl animate-open-menu max-w-96 '>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />
              <label htmlFor="email">Email</label>
              <input type="text" id="email" value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />
              <label htmlFor="password">Password</label>

              <span className='flex bg-[#fff] items-center  rounded-md'>
                <input type={visible ? 'text' : 'password'} id="password" value={teacherPwd} onChange={(e) => setTeacherPwd(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required autoComplete='off' />
                {visible && teacherPwd && <FaEye onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                {!visible && teacherPwd && <FaEyeSlash onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
              </span>
              <span>
                <button type='submit' className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md' onClick={addTeacher}>Add</button>
                <button onClick={() => setTeacherForm(false)} className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md'>Cancel</button>
              </span>
            </form>
          </article>
        }

        {updateForm &&
          <article className='fixed left-0 top-0 bg-transparent w-screen h-screen flex justify-center items-center'>
            <form className='flex flex-col bg-[#000] p-4  w-full lg:w-1/2  text-[#fca311] gap-2 rounded-xl animate-open-menu max-w-96 '>

              <label htmlFor="name">Name</label>
              <input type="text" id="name" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />
              <label htmlFor="email">Email</label>
              <input type="text" id="email" value={teacherEmail} onChange={(e) => setTeacherEmail(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />

              <span>
                <button type='submit' className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md' onClick={updateTeacher}>Update</button>
                <button onClick={handleUpdateCancel} className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md'>Cancel</button>
              </span>
            </form>
          </article>
        }
        {confirmForm &&
          <article className='fixed left-0 top-0 bg-transparent w-screen h-screen flex justify-center items-center'>
            <form className='p-6 bg-[#000] text-[#e5e5e5] rounded-xl fixed top-1/4 flex flex-col gap-10 animate-open-menu' onSubmit={(e) => e.preventDefault()}>
              <p className='text-xl'>Do you want to delete the Teacher?</p>
              <span>
                <button type='submit' className='bg-red-600 p-2 px-4 rounded-lg mt-2 mr-4' onClick={handleConfirm} >Delete</button>
                <button className='bg-[#e5e5e5] p-2 px-4 rounded-lg mt-2 mr-4 text-[#14213d]' onClick={() => setConfirmForm(false)}>Cancel</button>
              </span>
            </form>
          </article>
        }

        {stdForm &&
          <article className='w-screen h-screen bg-transparent fixed left-0 top-0 flex justify-center items-center p-2'>
            <form className='flex flex-col bg-[#000] p-6 w-full lg:w-1/2  text-[#fca311] gap-4 rounded-xl animate-open-menu ' onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="student">{(teacher.filter((teacher) => teacher._id === teacherId))[0].username} Students</label>
              <span className='flex justify-start gap-6 flex-wrap'>
                <input list="studentForm" id="student" name="student" className='outline-none p-2 text-[#000]  border-[#fca311] border rounded-xl' value={roll} onChange={(e) => setRoll(e.target.value)} />
                <datalist id="studentForm">
                  {
                    (faculty.find((fac) => fac.faculty === admin.faculty).students).map(stud =>
                      <option value={student.find((std) => std._id === stud).rollno}>
                        {student.find((std) => std._id === stud).rollno}
                      </option>
                    )
                  })
                </datalist>
                <button className='bg-[#fca311] text-[#000] px-4 rounded-xl' onClick={handleAdd}>Add</button>
                <button type='submit' onClick={updateTeacher} className='bg-[#fca311] text-[#000] px-4 rounded-xl'>Done</button>
                <button onClick={() => setStdForm(!stdForm)} className='bg-[#fca311] text-[#000] px-4 rounded-xl p-2'>Cancel</button>
              </span>
              <span className='flex gap-4 flex-wrap'>
                {stdArray.map((element, index) =>
                  <span className='bg-[#e5e5e5] text-[#000] p-2 rounded-xl flex items-center justify-between gap-2' key={index}>{student.find(std => std._id === element).rollno}
                    <button onClick={() => setStdArray(stdArray.filter(roll => roll !== element))}><FaTimes /></button>
                  </span>
                )}
              </span>
            </form>
          </article>
        }

        {subForm &&
          <article className='w-screen h-screen bg-transparent fixed left-0 top-0 flex justify-center items-center p-2'>
            <form className='flex flex-col bg-[#000] p-6 w-full lg:w-1/2  text-[#fca311] gap-4 rounded-xl animate-open-menu ' onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="student">{(teacher.filter((teacher) => teacher._id === teacherId))[0].username} Subjects</label>
              <span className='flex justify-start gap-6 flex-wrap'>
                <input list="subjectForm" id="subject" name="student" className='outline-none p-2 text-[#000]  border-[#fca311] border rounded-xl' value={sub} onChange={(e) => setSub(e.target.value)} />
                <datalist id="subjectForm">
                  {
                    (faculty.filter((fac) => fac.faculty === admin.faculty)[0].subjects).map(subj =>
                      <option value={subj}>
                        {subj}
                      </option>
                    )
                  })
                </datalist>
                <button className='bg-[#fca311] text-[#000] px-4 rounded-xl' onClick={handleSubAdd}>Add</button>
                <button type='submit' onClick={updateTeacher} className='bg-[#fca311] text-[#000] px-4 rounded-xl p-2'>Done</button>
                <button onClick={() => setSubForm(!subForm)} className='bg-[#fca311] text-[#000] px-4 rounded-xl p-2'>Cancel</button>
              </span>
              <span className='flex gap-4 flex-wrap'>
                {subArray.map((element, index) =>
                  <span className='bg-[#e5e5e5] text-[#000] p-2 rounded-xl flex items-center justify-between gap-2' key={index}>{element}
                    <button onClick={() => setSubArray(subArray.filter(subj => subj !== element))}><FaTimes /></button>
                  </span>
                )}
              </span>
            </form>
          </article>
        }
        {
          resetForm &&
          <article className='fixed left-0 top-0 bg-transparent w-screen h-screen flex justify-center items-center'>
            <form className='flex flex-col bg-[#000] p-6 w-full lg:w-1/2  text-[#fca311] gap-4 rounded-xl animate-open-menu max-w-96 '>
              <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold p-2' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
              <label htmlFor="reset" >Reset Password  for {teacherName}</label>
              <span className='flex bg-[#fff] items-center rounded-lg p-2  focus:outline-[#fca311] text-lg shadow-md shadow-[#13213d]'>
                <input type={visible ? 'text' : 'password'} id="password" value={teacherPwd} onChange={(e) => setTeacherPwd(e.target.value)} className='text-[#14213d] w-full outline-none rounded-md' required autoComplete='off' placeholder='Password' />
                {visible && teacherPwd && <FaEye onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                {!visible && teacherPwd && <FaEyeSlash onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
              </span>
              <span>
                <button type='submit' className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md' onClick={resetPassword}>Reset</button>
                <button onClick={handleResetCancel} className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md'>Cancel</button>
              </span>
            </form>
          </article>
        }
      </section>
    </section>
  )
}

export default ManageTeacher