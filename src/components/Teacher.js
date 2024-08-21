import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { FaChalkboard, FaGraduationCap, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa'
import { IoGrid } from 'react-icons/io5'
import { MdBook, MdPeople, MdQuestionAnswer, MdSettings } from 'react-icons/md'
import { GiHamburgerMenu } from 'react-icons/gi'
import { BiLogOut } from 'react-icons/bi'
import useAuth from '../hooks/useAuth'
import axios from '../api/axios'
import GuardianStudent from './GuardianStudent'
import TeacherSubject from './TeacherSubject'
import GuardianExamResult from './GuardianExamResult'
import Assessment from './Assessment'
import StudentAssessment from './StudentAssessment'
import Spinner from './Spinner'
const Teacher = () => {

  const [mobile, setMobile] = useState(false)
  const [student, setStudent] = useState([])
  const [page, setPage] = useState("overview")
  const [teacher, setTeacher] = useState()
  const [subject, setSubject] = useState()
  const [result, setResult] = useState([])
  const [assessment, setAssessment] = useState([])
  const { auth, setAuth } = useAuth()
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
    const getTeacher = async () => {
      const response = await axios.get("teacher")
      setTeacher((response.data).find(teacher => teacher.email === auth.user))
    }

    const getStudent = async () => {
      const response = await axios.get("student")
      setStudent(response.data)

    }
    const getResult = async () => {
      const response = await axios.get("result")
      setResult(response.data)
    }
    const getSubject = async () => {
      const response = await axios.get("subject")
      setSubject(response.data)
    }

    const getAssessment = async () => {
      const response = await axios.get("assessment")
      setAssessment(response.data)
    }

    getTeacher()
    getStudent()
    getResult()
    getSubject()
    getAssessment()
  }, [])

  const updatePassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (newPwd !== confirmPwd) {
      setErrMsg("New Password and Confirm Password should be match")
      setIsLoading(false)
    }
    else {
      try {
        await axios.put("/teacherauth", JSON.stringify({ email: auth.user, pwd: oldPwd, newPwd: newPwd }), {
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
        <nav className='bg-[#000] font-Concert min-h-screen w-44 text-[#fff] hidden sm:flex flex-col justify-start p-2 items-center gap-6 animate-open-menu'>
          <figure className='flex flex-col items-center'>
            <FaChalkboard className=' w-20 h-20' />
            <figcaption>Teacher</figcaption>
          </figure>
          <menu className='flex flex-col items-start justify-evenly gap-7'>
            <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'overview' && `text-[#fca311]`}`} onClick={() => setPage("overview")}><IoGrid className="w-5 h-5" />Overview</button>
            <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'student' && `text-[#fca311]`}`} onClick={() => setPage("student")}><MdPeople className='w-5 h-5' />Students</button>
            <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'subject' && `text-[#fca311]`}`} onClick={() => setPage("subject")}><MdBook className='w-5 h-5' />Subjects</button>
            <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'assessment' && `text-[#fca311]`}`} onClick={() => setPage("assessment")}> <MdQuestionAnswer className='w-5 h-5' />Assessment</button>
            <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 's-assessment' && `text-[#fca311]`}`} onClick={() => setPage("s-assessment")}><MdQuestionAnswer className='w-5 h-5' />Gdn-Marks</button>
            <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'result' && `text-[#fca311]`}`} onClick={() => setPage("result")}><FaGraduationCap className='w-5 h-5' />Gdn-Result</button>
            <button className="hover:text-[#fca311] flex items-center gap-4" onClick={() => setAuth({})}><BiLogOut className="w-5 h-5" />Logout</button>
          </menu>
        </nav>
        {mobile &&
          <section className='flex flex-row animate-open-menu origin-left'>
            <nav className='bg-[#000] font-Concert min-h-screen w-44 text-[#fff] flex flex-col justify-start p-2 items-center gap-6  fixed left-0 '>
              <figure className='flex flex-col items-center'>
                <FaChalkboard className=' w-20 h-20' />

                <figcaption>Admin</figcaption>
              </figure>
              <menu className='flex flex-col items-start justify-evenly gap-7' onClick={() => setMobile(false)}>
                <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'overview' && `text-[#fca311]`}`} onClick={() => setPage("overview")}><IoGrid className="w-5 h-5" />Overview</button>
                <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'student' && `text-[#fca311]`}`} onClick={() => setPage("student")}><MdPeople className='w-5 h-5' />Students</button>
                <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'subject' && `text-[#fca311]`}`} onClick={() => setPage("subject")}><MdBook className='w-5 h-5' />Subjects</button>
                <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'assessment' && `text-[#fca311]`}`} onClick={() => setPage("assessment")}> <MdQuestionAnswer className='w-5 h-5' />Assessment</button>
                <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 's-assessment' && `text-[#fca311]`}`} onClick={() => setPage("s-assessment")}><MdQuestionAnswer className='w-5 h-5' />Gdn-Marks</button>
                <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'result' && `text-[#fca311]`}`} onClick={() => setPage("result")}><FaGraduationCap className='w-5 h-5' />Gdn-Result</button>
                <button className="hover:text-[#fca311] flex items-center gap-4" onClick={() => setAuth({})}><BiLogOut className="w-5 h-5" />Logout</button>
              </menu>
            </nav>
            <FaTimes className=' text-[#fff] fixed top-0 left-44 w-10 h-10 cursor-pointer p-2 bg-[#000] rounded-r-xl' onClick={() => setMobile(!mobile)} />
          </section>
        }
      </header>
      <main className='w-full'>
        {page === "overview" &&
          <section className='w-full  h-screen flex flex-col'>
            <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
              <button className='block sm:hidden p-2'>
                <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
              </button>
              {
                teacher &&
                <h2 className='flex justify-between  w-full'>{teacher.username}'s Dashboard
                  <button onClick={() => setPwdForm(true)}>
                    <MdSettings className='w-7 h-7  hover:animate-spin' />
                  </button>
                </h2>
              }

            </article>
            <section className="flex flex-col items-center justify-start flex-wrap">
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full p-6">

                {
                  teacher &&
                  <article className="bg-[#fca311] p-6 rounded-2xl flex flex-col items-center cursor-pointer shadow-xl shadow-[#13213d]" onClick={() => setPage("student")}>
                    <MdPeople className='w-10 h-10' />
                    <span className='text-2xl font-Concert'>{(teacher.students).length}</span>
                    <p className='text-xl'>Students</p>
                  </article>

                }
                {
                  teacher &&
                  <article className="bg-[#000] p-6 rounded-2xl flex flex-col items-center cursor-pointer shadow-xl shadow-[#13213d] text-[#fff]" onClick={() => setPage("student")}>
                    <MdPeople className='w-10 h-10' />
                    <span className='text-2xl font-Concert'>{(teacher.subjectcode).length}</span>
                    <p className='text-xl'>Subjects</p>
                  </article>

                }
              </section>

            </section>
            {pwdForm &&
              <article className='w-screen h-screen bg-transparent fixed left-0 top-0 flex justify-center items-center'>
                <form className='flex flex-col bg-[#000] p-8 w-full lg:w-1/3  text-[#fca311] gap-2 rounded-xl animate-open-menu max-w-96  shadow-lg shadow-[#13213d]'>
                  <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold p-2' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
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
          page === "student" &&
          <GuardianStudent teacher={teacher} mobile={mobile} setMobile={setMobile} student={student} />
        }
        {
          page === "subject" &&
          <TeacherSubject teacher={teacher} mobile={mobile} setMobile={setMobile} subject={subject} />
        }
        {
          page === "result" &&
          <GuardianExamResult result={result} mobile={mobile} setMobile={setMobile} student={teacher.students} />
        }
        {
          page === "assessment" &&
          <Assessment mobile={mobile} setMobile={setMobile} teacher={teacher} />
        }

        {
          page === "s-assessment" &&
          <StudentAssessment mobile={mobile} setMobile={setMobile} students={student} student={teacher.students} assessment={assessment} />
        }
      </main>
    </div>
  )
}

export default Teacher