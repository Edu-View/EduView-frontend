import React from 'react'
import { MdOutlineQuestionAnswer, MdSettings } from 'react-icons/md'
import { FaBook, FaGraduationCap, FaTimes, FaRegUserCircle, FaRegBuilding, FaEye, FaEyeSlash } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
import useAuth from '../hooks/useAuth'
import { useState, useEffect, useRef } from 'react'
import axios from '../api/axios'
import { IoGrid, IoLogOut } from 'react-icons/io5'
import { CiBoxList, CiCalendar, CiMail } from 'react-icons/ci'
import { TbSquareRoundedLetterG } from 'react-icons/tb'
import Spinner from './Spinner'
const Student = () => {
  const { auth, setAuth } = useAuth()
  const [mobile, setMobile] = useState(false)
  const [page, setPage] = useState("overview")
  const [subject, setSubject] = useState([])
  const [studentSub, setStudentSub] = useState()
  const [assessment, setAssessment] = useState([])
  const [stdAssessment, setStdAssessment] = useState([])
  const [result, setResult] = useState([])
  const [stdResult, setStdResult] = useState([])
  const [teacher, setTeacher] = useState([])
  const [student, setStudent] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [visible, setVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [pwdForm, setPwdForm] = useState(false)
  const [oldPwd, setOldPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")

  const errRef = useRef();
  useEffect(() => {
    setErrMsg('')
  }, [oldPwd, newPwd, confirmPwd])

  useEffect(() => {
    const getSubject = async () => {
      const response = await axios.get("subject")
      setSubject(response.data)
    }
    const getAssessment = async () => {
      const response = await axios.get("assessment")
      setAssessment(response.data)
    }
    const getResult = async () => {
      const response = await axios.get("result")
      setResult(response.data)
    }
    const getStudent = async () => {
      const response = await axios.get("student")
      setStudent((response.data).find(std => std.email === auth.user))
    }

    const getTeacher = async () => {
      const response = await axios.get("teacher")
      setTeacher(response.data)
    }
    getSubject()
    getStudent()
    getAssessment()
    getResult()
    getTeacher()
  }, [])

  const subjectType = () => {
    setPage("subjects")
    if (student.rollno.includes("CS")) {
      setStudentSub((subject.filter(sub => sub.semester === student.semester)).filter(subject => subject.type === "CS" || subject.type === "CST"))
    }
    else {
      setStudentSub((subject.filter(sub => sub.semester === student.semester)).filter(subject => subject.type === "CT" || subject.type === "CST"))
    }
  }

  const handleAssessment = () => {
    setStdAssessment(assessment.filter(sa => sa.rollno === student.rollno))
    setPage("assessment")
  }
  const handleResult = () => {
    setStdResult(result.find(sr => sr.rollno === student.rollno))
    setPage("result")
  }

  const updatePassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (newPwd !== confirmPwd) {
      setErrMsg("New Password and Confirm Password should be match")
      setIsLoading(false)
    }
    else {
      try {
        await axios.put("/studentauth", JSON.stringify({ email: auth.user, pwd: oldPwd, newPwd: newPwd }), {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
        )
        setPwdForm(false)
        setOldPwd("")
        setNewPwd("")
        setConfirmPwd("")
        setIsLoading(false)
      } catch (err) {
        if (!err?.response) {
          setErrMsg("No Server Response!")
        }
        else if (err.response?.status === 400) {
          setErrMsg("Please fill the required fields")
        }
        else if (err.response?.status === 401) {
          setErrMsg("Wrong Password")
        }
        else {
          setErrMsg(err)
        }
        setIsLoading(false)
      }
      finally {
        setIsLoading(false)
      }
    }

  }
  return (
    <div className='flex font-Concert'>
      <header>
        {student &&
          <nav className='bg-[#000] font-Concert min-h-screen w-44 text-[#fff] hidden sm:flex flex-col justify-start p-2 items-center gap-6 animate-open-menu'>
            <figure className='flex flex-col items-center my-4'>
              <FaRegUserCircle className=' w-20 h-20' />
              <figcaption className='p-4'>
                {student?.username}
              </figcaption>
            </figure>
            <menu className='flex flex-col items-start justify-evenly gap-7'>
              <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'overview' && `text-[#fca311]`}`} onClick={() => setPage("overview")}><IoGrid className='w-5 h-5' />Overview</button>
              <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'subjects' && `text-[#fca311]`}`} onClick={subjectType}><FaBook className='w-5 h-5' />Subjects</button>
              <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'assessment' && `text-[#fca311]`}`} onClick={handleAssessment}><MdOutlineQuestionAnswer className='w-5 h-5' />Assessment</button>
              <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'result' && `text-[#fca311]`}`} onClick={handleResult}><FaGraduationCap className='w-5 h-5' />Result</button>
              <button className="hover:text-[#fca311] flex items-center gap-4" onClick={() => setAuth({})}><IoLogOut className='w-5 h-5' />Logout</button>
            </menu>
          </nav>
        }
        {mobile && student &&
          <section className='flex flex-row animate-open-menu origin-left'>
            <nav className='bg-[#000] font-Concert min-h-screen w-44 text-[#fff] flex flex-col justify-start p-2 items-center gap-6  fixed left-0 '>
              <figure className='flex flex-col items-center my-4'>
                <FaRegUserCircle className=' w-20 h-20' />
                <figcaption className='p-4'>{student.username}</figcaption>
              </figure>
              <menu className='flex flex-col items-start justify-evenly gap-7' onClick={() => setMobile(false)}>
                <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'overview' && `text-[#fca311]`}`} onClick={() => setPage("overview")}><IoGrid className='w-5 h-5' />Overview</button>
                <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'subjects' && `text-[#fca311]`}`} onClick={subjectType}><FaBook className='w-5 h-5' />Subjects</button>
                <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'assessment' && `text-[#fca311]`}`} onClick={handleAssessment}><MdOutlineQuestionAnswer className='w-5 h-5' />Assessment</button>
                <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'result' && `text-[#fca311]`}`} onClick={handleResult}><FaGraduationCap className='w-5 h-5' />Result</button>
                <button className="hover:text-[#fca311] flex items-center gap-4" onClick={() => setAuth({})}><IoLogOut className='w-5 h-5' />Logout</button>
              </menu>
            </nav>
            <FaTimes className=' text-[#fff] fixed top-0 left-44 w-10 h-10 cursor-pointer p-2 bg-[#000] rounded-r-xl' onClick={() => setMobile(!mobile)} />
          </section>
        }
      </header>
      <main className='w-full' >
        {page === "overview" && student && teacher &&
          <section className='w-full  h-screen bg-[#e5e5e5] flex flex-col'>
            <article className='flex  font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
              <button className='block sm:hidden p-2'>
                <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
              </button>
              <h2 className='flex justify-between  w-full px-2'>Personal Information
                <button onClick={() => setPwdForm(true)}>
                  <MdSettings className='w-7 h-7  hover:animate-spin' />
                </button>
              </h2>
            </article>
            <section className='p-10 flex flex-col items-center  md:items-start gap-4 overflow-y-auto'>
              <section className='w-full lg:w-1/2  shadow-sm  p-4 font-Concert rounded-xl  flex justify-start gap-4  shadow-[#13213d] items-center  bg-[#fff] text-[#000]'>
                <FaRegUserCircle className='w-5 h-5' /> Name : {student.username}
              </section>
              <section className='w-full lg:w-1/2  shadow-sm  p-4 font-Concert rounded-xl  flex justify-start gap-4  shadow-[#13213d] items-center  bg-[#fff] text-[#000]'>
                <CiBoxList className='w-5 h-5' /> Rollno : {student.rollno}
              </section>
              <section className='w-full lg:w-1/2  shadow-sm  p-4 font-Concert rounded-xl  flex justify-start gap-4  shadow-[#13213d] items-center  bg-[#fff] text-[#000]'>
                <CiMail className='w-5 h-5' />Email : {student.email}
              </section>
              <section className='w-full lg:w-1/2  shadow-sm  p-4 font-Concert rounded-xl  flex justify-start gap-4  shadow-[#13213d] items-center  bg-[#fff] text-[#000]'>
                <CiCalendar className='w-5 h-5' />Semester : {student.semester}
              </section>

              <section className='w-full lg:w-1/2  shadow-sm  p-4 font-Concert rounded-xl  flex justify-start gap-4  shadow-[#13213d] items-center  bg-[#fff] text-[#000]'>
                <TbSquareRoundedLetterG className='w-5 h-5' />Guardian : {teacher.find(teacher => (teacher.students).includes(student._id))?.username}
              </section>
              <section className='w-full lg:w-1/2  shadow-sm  p-4 font-Concert rounded-xl  flex justify-start gap-4  shadow-[#13213d] items-center  bg-[#fff] text-[#000]'>
                <FaRegBuilding className='w-5 h-5' />Faculty : {teacher.find(teacher => (teacher.students).includes(student._id))?.faculty}
              </section>

            </section>
            {pwdForm &&
              <article className='w-screen h-screen bg-transparent fixed left-0 top-0 flex justify-center items-center'>
                <form className='flex flex-col bg-[#000] p-8 w-full lg:w-1/3  text-[#fca311] gap-2 rounded-xl animate-open-menu max-w-96  shadow-lg shadow-[#13213d]'>
                  <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert  p-2' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
                  <h3 className='text-lg border-b border-[#fca311] pb-3 mb-3'>Change Your Password</h3>
                  <label htmlFor="old">Old Password</label>
                  <span className='flex bg-[#fff] items-center  rounded-md'>
                    <input type={visible ? 'text' : 'password'} id="new" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required autoComplete='off' />
                    {visible && oldPwd && <FaEye onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                    {!visible && oldPwd && <FaEyeSlash onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                  </span>
                  <label htmlFor="old">New Password</label>
                  <span className='flex bg-[#fff] items-center  rounded-md'>
                    <input type={visible1 ? 'text' : 'password'} id="new" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required autoComplete='off' />
                    {visible1 && newPwd && <FaEye onClick={() => setVisible1(!visible1)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                    {!visible1 && newPwd && <FaEyeSlash onClick={() => setVisible1(!visible1)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                  </span>
                  <label htmlFor="confirm">Confirm Password</label>
                  <span className='flex bg-[#fff] items-center  rounded-md'>
                    <input type={visible2 ? 'text' : 'password'} id="confirm" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required autoComplete='off' />
                    {visible2 && confirmPwd && <FaEye onClick={() => setVisible2(!visible2)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                    {!visible2 && confirmPwd && <FaEyeSlash onClick={() => setVisible2(!visible2)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                  </span>
                  <span>
                    <button type='submit' className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#000] outline-none rounded-md' onClick={updatePassword}>
                      {isLoading && <Spinner />}
                      {!isLoading && <p>Change</p>}
                    </button>
                    <button onClick={() => setPwdForm(false)} className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#000] outline-none rounded-md'>Cancel</button>
                  </span>
                </form>
              </article>
            }
          </section>
        }
        {
          page === "subjects" &&
          <section className='w-full  h-screen flex flex-col bg-[#e5e5e5]'>
            <article className='flex  font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
              <button className='block sm:hidden p-2'>
                <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
              </button>
              <h2 className='px-4'>Subjects</h2>
            </article>
            <section className='p-4 flex flex-col items-center  md:items-start gap-4 overflow-y-auto text-sm mt-4 grow'>
              {
                studentSub.map((sub) => (
                  <span className='w-full lg:w-1/2  shadow-sm  p-4 font-Concert rounded-lg  flex justify-start gap-8  shadow-[#13213d] items-center  bg-[#fff] text-[#000]'>

                    <span className='flex items-center gap-2 '><FaBook className='w-5 h-5' />{sub.subject} </span>
                    <span>{sub.name}</span>
                  </span>
                ))
              }
            </section>
          </section>
        }
        {
          page === "assessment" &&
          <section className='w-full  h-screen flex flex-col bg-[#e5e5e5]'>
            <article className='flex  font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
              <button className='block sm:hidden p-2'>
                <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
              </button>
              <h2 className='px-4'>Assessment</h2>
            </article>
            <section className='p-4 flex flex-col items-center  md:items-start gap-4 overflow-y-auto text-sm mt-4'>
              {
                stdAssessment.map((sub) => (
                  <span className='w-full  shadow-sm  p-4 font-Concert rounded-xl  flex justify-between  shadow-[#13213d] items-center  bg-[#fff] text-[#000]'>

                    <span className='w-24 flex items-center gap-2'>  <MdOutlineQuestionAnswer className='w-5 h-5' />{sub.subjects} </span>
                    <span className='w-40'>{sub.type}</span>
                    <span className='w-10'>{sub.marks[0]}</span>
                    <span className='w-10'>{sub.marks[1]}</span>
                  </span>
                ))
              }
            </section>
          </section>
        }
        {
          page === "result" && result &&
          <section className='w-full  h-screen flex flex-col bg-[#e5e5e5]'>
            <article className='flex  font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
              <button className='block sm:hidden p-2'>
                <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
              </button>
              <h2 className='px-4'>Result</h2>
            </article>
            <section className='p-4 flex flex-col items-center  md:items-start gap-4 overflow-y-auto text-sm'>
              {!stdResult && <p>No Result</p>}
              {stdResult &&
                stdResult.subjects.map((element, index) =>
                (
                  <span className='w-full lg:w-1/2  shadow-sm  p-4 font-Concert rounded-xl  flex justify-between  shadow-[#13213d] items-center  bg-[#fff] text-[#000]'>
                    <span className='flex items-center gap-2'> <FaGraduationCap className='w-5 h-5' />{element}</span>
                    <span>{stdResult.grading[index]}</span>
                    <span>{stdResult.gradeScore[index]}</span>
                  </span>
                )
                )
              }
            </section>
          </section>
        }
      </main>

    </div>
  )
}

export default Student