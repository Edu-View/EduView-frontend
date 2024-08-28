import React from 'react'
import { MdAdminPanelSettings, MdOutlineAdminPanelSettings, MdPeople, MdQuestionAnswer, MdSettings } from 'react-icons/md'
import { FaChalkboard, FaEdit, FaTrash, FaPlus, FaRegCalendarAlt, FaTimes, FaRegBuilding, FaBook, FaGraduationCap, FaEye, FaEyeSlash } from 'react-icons/fa'
import { IoMdCodeDownload } from 'react-icons/io'
import { IoGrid, IoKey } from 'react-icons/io5'
import { GiHamburgerMenu } from 'react-icons/gi'
import { BiLogOut } from 'react-icons/bi'
import { useState, useEffect, useRef } from 'react'
import * as XLSX from 'xlsx';
import axios from '../api/axios'
import ManageSemester from './ManageSemester'
import ManageAdmin from './ManageAdmin'
import ManageFaculty from './ManageFaculty'
import ManageFacultyAdmin from './ManageFacultyAdmin'
import ManageResult from './ManageResult'
import GuardianAssessment from './GuardianAssessment'
import useAuth from '../hooks/useAuth'
import Spinner from './Spinner'
import Subject from './Subject'

const Admin = () => {
  const { auth, setAuth } = useAuth()
  const [page, setPage] = useState("overview")
  const [student, setStudent] = useState([])
  const [teacher, setTeacher] = useState([])
  const [facultyAdmin, setFacultyAdmin] = useState([])
  const [admin, setAdmin] = useState([])
  const [search, setSearch] = useState("all")
  const [semester, setSemester] = useState([])
  const [sem, setSem] = useState()
  const [assessment, setAssessment] = useState([])
  const [faculty, setFaculty] = useState([])
  const [subject, setSubject] = useState([])
  const [list, setList] = useState(student)
  const [stdName, setStdName] = useState("")
  const [stdPwd, setStdPwd] = useState("")
  const [stdMail, setStdMail] = useState("")
  const [stdRoll, setStdRoll] = useState("")
  const [stdId, setStdId] = useState("")
  const [stdForm, setStdForm] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [confirmForm, setConfirmForm] = useState(false)
  const [deleteId, setDeleteID] = useState("")
  const [filterStd, setFilterStd] = useState("")
  const [updateForm, setUpdateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [pwdForm, setPwdForm] = useState(false)
  const [oldPwd, setOldPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [visible, setVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [resetForm, setResetForm] = useState(false)
  const Student_URL = "/student"

  const errRef = useRef();

  useEffect(() => {
    setErrMsg('')
  }, [stdName, stdRoll, stdMail, stdPwd, sem, oldPwd, newPwd, confirmPwd])

  useEffect(() => {
    setFilterStd("")
  }, [search])

  useEffect(() => {

    const getStudent = async () => {
      const response = await axios.get("student")
      sorting(response.data)
    }
    const getFacultyAdmin = async () => {
      const response = await axios.get("facultyadmin")
      setFacultyAdmin(response.data)

    }
    const getTeacher = async () => {
      const response = await axios.get("teacher")
      setTeacher(response.data)
    }
    const getAdmin = async () => {
      const response = await axios.get("admin")
      setAdmin(response.data)
    }
    const getSemester = async () => {
      const response = await axios.get("semester")
      setSemester(response.data)
      setSem(response.data[0].semester)
    }
    const getSubject = async () => {
      const response = await axios.get("subject")
      setSubject(response.data)
    }
    const getFaculty = async () => {
      const response = await axios.get("faculty")
      setFaculty(response.data)
    }
    const getAssessment = async () => {
      const response = await axios.get("assessment")
      setAssessment(response.data)
    }
    getStudent()
    getFacultyAdmin()
    getTeacher()
    getAdmin()
    getSemester()
    getSubject()
    getFaculty()
    getAssessment()

  }, [])

  const sorting = (student) => {
    const semesterOrder = {
      "Semester I": 1,
      "Semester II": 2,
      "Semester III": 3,
      "Semester IV": 4,
      "Semester V": 5,
      "Semester VI": 6,
      "Semester VII": 7,
      "Semester VIII": 8,
      "Semester IX": 9,
      "Semester X": 10,
    };
    const rollOrder = {
      "CST": 1,
      "CS": 2,
      "CT": 3,
    };
    const getPrefix = (rollno) => {
      if (rollno.includes("CST")) return "CST";
      if (rollno.includes("CS")) return "CS";
      if (rollno.includes("CT")) return "CT";
      return ""; // Fallback if no prefix matches
    };
    const getNumber = (rollno) => {
      const match = rollno.match(/-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    };
    const sortedStudents = student.sort((a, b) => {
      const semesterComparison = semesterOrder[a.semester] - semesterOrder[b.semester];
      if (semesterComparison !== 0) {
        return semesterComparison;
      }
      const prefixA = getPrefix(a.rollno);
      const prefixB = getPrefix(b.rollno);
      const prefixComparison = rollOrder[prefixA] - rollOrder[prefixB];
      if (prefixComparison !== 0) {
        return prefixComparison;
      }
      return getNumber(a.rollno) - getNumber(b.rollno);
    });

    setStudent(sortedStudents);
    setList(sortedStudents)
  }
  const exportToExcel = () => {
    // Compute the data directly
    const data = list.map((li) => ({
      rollno: li.rollno,
      username: li.username,
      email: li.email,
      semester: li.semester
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = search === "all" ? "All Student" : search;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const handleStudent = () => {
    setPage("student")
    setList(student)
    setFilterStd("")
  }
  const handleSearch = (e) => {
    e.preventDefault()

    if (filterStd) {
      !list.length && setSearch("all")
      setList(student.filter((student) => student.rollno === filterStd))
      setSearch((student.filter((student) => student.rollno === filterStd))[0]?.semester)
    }
    else {
      search === "all" ? setList(student) : setList(student.filter(student => student.semester === search))
      setFilterStd("")
    }


  }

  const addStudent = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (!sem) setSem(semester[0].semester)
    try {
      await axios.post(Student_URL, JSON.stringify({ rollno: stdRoll, username: stdName, email: stdMail, pwd: stdPwd, semester: sem }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )
      const response = await axios.get("student")
      await sorting(response.data)
      setStdForm(false)
      setStdRoll("")
      setStdName("")
      setStdMail("")
      setStdPwd("")
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
    setIsLoading(true)
    try {
      await axios.delete(Student_URL, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
        data: JSON.stringify({ id: deleteId }) // Send data in the 'data' field
      });
      setConfirmForm(false)
      const facId = faculty.find(fac => fac.students.includes(deleteId))._id
      const studentArray = (faculty.find(fac => fac.students.includes(deleteId)).students)
      const rollarray = studentArray.filter(std => std !== deleteId)
      await axios.put("/faculty", JSON.stringify({ id: facId, students: rollarray }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )

      const response = await axios.get("student")
      await sorting(response.data);
      setIsLoading(false)
      const facresponse = await axios.get("faculty")
      await setFaculty(facresponse.data)
      const guardianId = teacher.find(fac => fac.students.includes(deleteId))._id
      const guardianArray = (teacher.find(fac => fac.students.includes(deleteId)).students)
      const guardianRollArray = guardianArray.filter(std => std !== deleteId)
      await axios.put("/teacher", JSON.stringify({ id: guardianId, students: guardianRollArray }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )

    } catch (err) {
      setIsLoading(false)
    }
    finally {
      setIsLoading(false)
    }
  }
  const updateStudent = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {

      await axios.put(Student_URL, JSON.stringify({ id: stdId, username: stdName, rollno: stdRoll, semester: sem, email: stdMail }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )
      setStdId("")
      setStdRoll("")
      setStdName("")
      setStdMail("")
      setSem("")
      setIsLoading(false)
      setUpdateForm(false)
      const response = await axios.get("student")
      await sorting(response.data);
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response!")
      }
      else if (err.response?.status === 400) {
        setErrMsg("Please fill the required fields")
      }
      else if (err.response?.status === 409) {
        setErrMsg("Duplicate Roll Number")
      }
      else if (err.response?.status === 204) {
        setErrMsg("No Student matches with this roll no")
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

  const handleUpdateForm = (id, username, rollno, email, semester) => {
    setUpdateForm(true)
    setStdId(id)
    setStdMail(email)
    setStdName(username)
    setSem(semester)
    setStdRoll(rollno)
  }

  const handleUpdateCancel = () => {
    setUpdateForm(false)
    setStdId("")
    setStdMail("")
    setStdName("")
    setSem("")
    setStdRoll("")
    setStdPwd("")
  }
  const handlePwd = () => {
    setPwdForm(true)
  }

  const resetPassword = async (e) => {
    e.preventDefault()
    try {

      await axios.put("studentauth/reset", JSON.stringify({ email: stdMail, pwd: stdPwd }), {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      }
      )
      setResetForm(false)
      const response = await axios.get("student")
      await setStudent(response.data)
      await setList(response.data)
      setStdMail("")
      setStdName("")
      setStdPwd("")

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
  const handleResetForm = (mail, name) => {
    setStdMail(mail)
    setStdName(name)
    setResetForm(true)
  }

  const handleResetCancel = () => {
    setResetForm(false)
    setStdMail("")
    setStdName("")
    setStdPwd("")
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
        await axios.put("/adminauth", JSON.stringify({ email: auth.user, pwd: oldPwd, newPwd: newPwd }), {
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
    <div className='flex font-Concert '>
      <header className=' shadow-lg shadow-[#13213d]'>
        <nav className='bg-[#000] font-Concert min-h-screen w-44 text-[#fff] hidden sm:flex flex-col justify-between p-2 items-center  animate-open-menu pb-6'>
          <section className='flex flex-col gap-6'>
            <figure className='flex flex-col items-center'>
              <MdAdminPanelSettings className=' w-20 h-20' />
              <figcaption>Admin</figcaption>
            </figure>
            <menu className='flex flex-col items-start justify-evenly gap-7'>
              <button className={`hover:text-[#fca311] flex items-center gap-3 ${page === 'overview' && `text-[#fca311]`}`} onClick={() => setPage("overview")}><IoGrid className='w-5 h-5' />Overview</button>
              <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'semester' && `text-[#fca311]`}`} onClick={() => setPage("semester")}><FaRegCalendarAlt className='w-5 h-5' />Semester</button>
              <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'faculty' && `text-[#fca311]`}`} onClick={() => setPage("faculty")}><FaRegBuilding className='w-5 h-5' />Faculty</button>
              <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'subject' && `text-[#fca311]`}`} onClick={() => setPage("subject")}><FaBook className='w-5 h-5' />Subject</button>
              <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'facultyadmin' && `text-[#fca311]`}`} onClick={() => setPage("facultyadmin")}><MdOutlineAdminPanelSettings className='w-5 h-5' />Fac-admin</button>
              <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'student' && `text-[#fca311]`}`} onClick={handleStudent}><MdPeople className='w-5 h-5' />Student</button>
              <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'admin' && `text-[#fca311]`}`} onClick={() => setPage("admin")}><MdAdminPanelSettings className='w-5 h-5' />Admin</button>
              <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'assessment' && `text-[#fca311]`}`} onClick={() => setPage("assessment")}><MdQuestionAnswer className='w-5 h-5' />Assessment</button>
              <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'result' && `text-[#fca311]`}`} onClick={() => setPage("result")}><FaGraduationCap className='w-5 h-5' />Result</button>
              <button className='hover:text-[#fca311] flex items-center gap-3  focus:text-[#fca311]' onClick={() => setAuth({})}><BiLogOut className='w-5 h-5' />Logout</button>
            </menu>
          </section>

        </nav>
        {mobile &&
          <section className='flex flex-row animate-open-menu origin-left z-50'>
            <nav className='bg-[#000] font-Concert min-h-screen w-44 text-[#fff] flex flex-col justify-start p-2 items-center gap-6  fixed left-0 '>
              <figure className='flex flex-col items-center'>
                <MdAdminPanelSettings className=' w-20 h-20' />

                <figcaption>Admin</figcaption>
              </figure>
              <menu className='flex flex-col items-start justify-evenly gap-7' onClick={() => setMobile(false)}>
                <button className={`hover:text-[#fca311] flex items-center gap-3 ${page === 'overview' && `text-[#fca311]`}`} onClick={() => setPage("overview")}><IoGrid className='w-5 h-5' />Overview</button>
                <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'semester' && `text-[#fca311]`}`} onClick={() => setPage("semester")}><FaRegCalendarAlt className='w-5 h-5' />Semester</button>
                <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'faculty' && `text-[#fca311]`}`} onClick={() => setPage("faculty")}><FaRegBuilding className='w-5 h-5' />Faculty</button>
                <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'subject' && `text-[#fca311]`}`} onClick={() => setPage("subject")}><FaBook className='w-5 h-5' />Subject</button>
                <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'facultyadmin' && `text-[#fca311]`}`} onClick={() => setPage("facultyadmin")}><MdOutlineAdminPanelSettings className='w-5 h-5' />Fac-admin</button>
                <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'student' && `text-[#fca311]`}`} onClick={handleStudent}><MdPeople className='w-5 h-5' />Student</button>
                <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'admin' && `text-[#fca311]`}`} onClick={() => setPage("admin")}><MdAdminPanelSettings className='w-5 h-5' />Admin</button>
                <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'assessment' && `text-[#fca311]`}`} onClick={() => setPage("assessment")}><MdQuestionAnswer className='w-5 h-5' />Assessment</button>
                <button className={`hover:text-[#fca311] flex items-center gap-3  ${page === 'result' && `text-[#fca311]`}`} onClick={() => setPage("result")}><FaGraduationCap className='w-5 h-5' />Result</button>
                <button className='hover:text-[#fca311] flex items-center gap-3  focus:text-[#fca311]' onClick={() => setAuth({})}><BiLogOut className='w-5 h-5' />Logout</button>
              </menu>
            </nav>
            <FaTimes className=' text-[#fff] fixed top-0 left-44 w-10 h-10 cursor-pointer p-2 bg-[#000] rounded-r-xl' onClick={() => setMobile(!mobile)} />
          </section>
        }
      </header>
      <main className='w-full'  >
        {page === "overview" && (
          <section className='w-full  h-screen flex flex-col'>
            <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
              <button className="block sm:hidden p-2" onClick={() => setMobile(!mobile)}>
                <GiHamburgerMenu className="w-10 h-10" />
              </button>
              <h2 className='flex justify-between  w-full px-2'>Dashboard
                <button onClick={handlePwd}>
                  <MdSettings className='w-7 h-7' />
                </button>
              </h2>
            </article>
            <section className="flex flex-col items-center justify-start flex-wrap  grow overflow-y-auto">
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full p-6">
                <article className="bg-[#fca311] p-6 rounded-2xl flex flex-col items-center cursor-pointer shadow-xl shadow-[#13213d]" onClick={handleStudent}>
                  <MdPeople className="w-10 h-10 mb-2" />
                  <span className="text-2xl">{student.length}</span>
                  <p className="text-xl">Students</p>
                </article>
                <article className="bg-[#13213d] text-[#e5e5e5] p-6 rounded-2xl flex flex-col items-center cursor-pointer shadow-xl shadow-[#13213d]">
                  <FaChalkboard className="w-10 h-10 mb-2" />
                  <span className="text-2xl">{teacher.length}</span>
                  <p className="text-xl">Teachers</p>
                </article>
                <article className="bg-[#e5e5e5] text-[#000] p-6 rounded-2xl flex flex-col items-center cursor-pointer shadow-xl shadow-[#13213d]" onClick={() => setPage("admin")}>
                  <MdAdminPanelSettings className="w-10 h-10 mb-2" />
                  <span className="text-2xl">{admin.length}</span>
                  <p className="text-xl">Admins</p>
                </article>
                <article className="bg-[#000] text-[#e5e5e5] p-6 rounded-2xl flex flex-col items-center cursor-pointer shadow-xl shadow-[#13213d]" onClick={() => setPage("faculty")}>
                  <FaRegBuilding className="w-10 h-10 mb-2" />
                  <span className="text-2xl">{faculty.length}</span>
                  <p className="text-xl">Faculties</p>
                </article>
                <article className="bg-[#fca311] text-[#000] p-6 rounded-2xl flex flex-col items-center cursor-pointer shadow-xl shadow-[#13213d]" onClick={() => setPage("semester")}>
                  <FaRegCalendarAlt className="w-9 h-9 mb-2" />
                  <span className="text-2xl">{semester.length}</span>
                  <p className="text-xl">Semesters</p>
                </article>
                <article className="bg-[#000] text-[#fca311] p-6 rounded-2xl flex flex-col items-center cursor-pointer shadow-xl shadow-[#13213d]" onClick={() => setPage("facultyadmin")}>
                  <MdOutlineAdminPanelSettings className="w-10 h-10 mb-2" />
                  <span className="text-2xl">{facultyAdmin.length}</span>
                  <p className="text-xl">Faculty Admins</p>
                </article>
              </section>
            </section>
            {pwdForm &&
              <article className='w-screen h-screen bg-transparent fixed left-0 top-0 flex justify-center items-center' >
                <form className='flex flex-col bg-[#000] p-8 w-3/4 lg:w-1/3  text-[#fca311] gap-2 rounded-xl animate-open-menu max-w-96  shadow-lg shadow-[#13213d]' name="change password form">
                  <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold p-2' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
                  <h3 className='text-lg border-b border-[#fca311] pb-3 mb-3'>Change Your Password</h3>
                  <label htmlFor="old">Old Password</label>
                  <span className='flex bg-[#fff] items-center  rounded-md'>
                    <input type={visible ? 'text' : 'password'} id="old" value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required autoComplete='off' />
                    {visible && oldPwd && <FaEye onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                    {!visible && oldPwd && <FaEyeSlash onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                  </span>
                  <label htmlFor="new">New Password</label>
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
                  <span className='flex gap-2'>
                    <button type='submit' className='bg-[#fca311] p-2 px-8 text-[#000] outline-none rounded-md' onClick={updatePassword}>
                      {isLoading && <Spinner />}
                      {!isLoading && <p>Change</p>}
                    </button>
                    <button onClick={() => setPwdForm(false)} className='bg-[#fca311] p-2 px-8  text-[#000] outline-none rounded-md'>Cancel</button>
                  </span>
                </form>
              </article>
            }
          </section>

        )}

        {page === "student" &&
          <section className='w-full  h-screen bg-[#e5e5e5] flex flex-col'>
            <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff]'>
              <button className='block sm:hidden p-2'>
                <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
              </button>
              <h2 >Students</h2>

            </article>
            <section className='flex flex-row shadow-md items-center py-3'>
              <form onSubmit={(e) => e.preventDefault()} className='px-6  p-2 flex justify-start items-center flex-wrap  gap-4' name='search student form'>
                <select value={search} onChange={(e) => setSearch(e.target.value)} className='p-2 lg:p-3  border outline-none focus:border-[#fca311]  rounded-lg font-Concert shadow-md shadow-[#13213d]'>
                  <option value="all">All Student</option>
                  {semester.map((semester) =>
                    <option value={semester.semester} key={semester._id}>{semester.semester}</option>
                  )}
                </select>
                <input type="text" className='p-2 lg:p-3  border focus:border-[#fca311]  rounded-lg font-Concert shadow-md shadow-[#13213d]  outline-none' value={filterStd} onChange={(e) => setFilterStd(e.target.value)} placeholder='ICST-1' />
                <button className='border  bg-[#fca311] p-2 lg:p-3 rounded-lg hover:scale-x-105 px-6 shadow-md shadow-[#13213d] w-24' onClick={handleSearch}>apply</button>
                <button onClick={exportToExcel} className='border  bg-[#fca311] p-2 lg:p-3 rounded-lg hover:scale-x-105 px-6 shadow-md shadow-[#13213d] flex items-center gap-2'>Download <IoMdCodeDownload className='w-6 h-6' /></button>
              </form>

            </section>

            <section className=' grow overflow-y-auto'>

              {list.length === 0 && <p className='text-xl  p-3 px-6'>No Student</p>}
              {list &&
                <ul className='w-full p-6 flex flex-col gap-3'>
                  {list.map((list) =>
                  (<li key={list._id} className='w-full shadow-sm  p-4 font-Concert rounded-xl  flex  flex-col lg:flex-row  justify-between  shadow-[#13213d] items-start  lg:items-center  bg-[#fff] text-[#000] gap-2'>
                    <span className='w-24 flex items-center gap-4'><MdPeople />{list.rollno}</span>
                    <span className='md:w-48 '>{list.username}</span>
                    <span className=' md:w-80'>{list.email}</span>
                    <span className=' md:w-60'>{list.semester}</span>
                    <FaEdit className='cursor-pointer w-8 h-8 p-1 hover:text-[#fca311]' onClick={() => handleUpdateForm(list._id, list.username, list.rollno, list.email, list.semester)} />
                    <IoKey onClick={() => handleResetForm(list.email, list.username)} className=' cursor-pointer text-[#000] hover:text-[#fca311] w-6 h-6' />
                    <FaTrash className='cursor-pointer w-8 h-8 p-1 hover:text-[#fca311]' onClick={() => handleStdDelete(list._id)} />
                  </li>)
                  )}
                </ul>
              }
              <button className='bg-[#fca311] rounded-full p-4 fixed right-0 bottom-0 m-6 shadow-md shadow-[#13213d]' onClick={() => setStdForm(!stdForm)}><FaPlus /></button>
              {stdForm &&
                <article className='w-screen h-screen bg-transparent fixed left-0 top-0 flex justify-center items-center p-2'>

                  <form className='flex flex-col bg-[#000] p-6 w-full lg:w-1/2  text-[#fca311] gap-2 rounded-xl animate-open-menu max-w-96  shadow-lg shadow-[#13213d]' name='student add form'>
                    <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold p-2' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
                    <label htmlFor="Rollno">Rollno</label>
                    <input type="text" id="Rollno" value={stdRoll} onChange={(e) => setStdRoll(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={stdName} onChange={(e) => setStdName(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" value={stdMail} onChange={(e) => setStdMail(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />
                    <label htmlFor="password">Password</label>
                    <span className='flex bg-[#fff] items-center  rounded-md'>
                      <input type={visible ? 'text' : 'password'} id="password" value={stdPwd} onChange={(e) => setStdPwd(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required autoComplete='off' />
                      {visible && stdPwd && <FaEye onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                      {!visible && stdPwd && <FaEyeSlash onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                    </span>
                    <label htmlFor="semester">Semester</label>
                    <select id="semester" className='text-[#14213d] p-2 w-full outline-none rounded-md' value={sem} onChange={(e) => setSem(e.target.value)} >
                      {semester.map((semester) =>
                        <option value={semester.semester}>{semester.semester}</option>
                      )}
                    </select>
                    <span>

                      <button type='submit' className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md' onClick={addStudent}>
                        {isLoading && <Spinner />}
                        {!isLoading && <p>Add</p>}
                      </button>
                      <button onClick={() => setStdForm(false)} className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md'>Cancel</button>
                    </span>
                  </form>
                </article>
              }
              {confirmForm &&
                <article className='fixed left-0 top-0 bg-transparent w-screen h-screen flex justify-center items-center'>

                  <form className='p-6 bg-[#000] text-[#e5e5e5] rounded-xl fixed top-2/4 flex flex-col gap-10 animate-open-menu' onSubmit={(e) => e.preventDefault()} name=' student delete form'>
                    <p className='text-xl'>Do you want to delete the Student?</p>
                    <span>
                      <button type='submit' className='bg-red-600 p-2 px-4 rounded-lg mt-2 mr-4' onClick={handleConfirm} >
                        {isLoading && <Spinner />}

                        {!isLoading && <p>Delete</p>}
                      </button>
                      <button className='bg-[#e5e5e5] p-2 px-4 rounded-lg mt-2 mr-4 text-[#14213d]' onClick={() => setConfirmForm(false)}>Cancel</button>
                    </span>
                  </form>
                </article>
              }
              {updateForm &&
                <article className='fixed left-0 top-0 bg-transparent w-screen h-screen flex justify-center items-center p-2'>
                  <form className='flex flex-col bg-[#000] p-4  w-full lg:w-1/2  text-[#fca311] gap-2 rounded-xl animate-open-menu max-w-96 ' name='update form'>
                    <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold p-2' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
                    <label htmlFor="Rollno">Rollno</label>
                    <input type="text" id="Rollno" value={stdRoll} onChange={(e) => setStdRoll(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={stdName} onChange={(e) => setStdName(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" value={stdMail} onChange={(e) => setStdMail(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />
                    <label htmlFor="semester">Semester</label>
                    <select id="semester" className='text-[#14213d] p-2 w-full outline-none rounded-md' value={sem} onChange={(e) => setSem(e.target.value)} >
                      {semester.map((semester) =>
                        <option value={semester.semester}>{semester.semester}</option>
                      )}
                    </select>
                    <span>
                      <button type='submit' className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md' onClick={updateStudent}>
                        {isLoading && <Spinner />}

                        {!isLoading && <p>Update</p>}
                      </button>
                      <button onClick={handleUpdateCancel} className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md'>Cancel</button>
                    </span>
                  </form>
                </article>
              }
              {
                resetForm &&
                <article className='fixed left-0 top-0 bg-transparent w-screen h-screen flex justify-center items-center'>
                  <form className='flex flex-col bg-[#000] p-6 w-full lg:w-1/2  text-[#fca311] gap-4 rounded-xl animate-open-menu max-w-96 ' name='password reset form'>
                    <p ref={errRef} className={errMsg ? ' text-red-600 font-Concert font-bold p-2' : 'opacity-0'} aria-live='assertive'>{errMsg}</p>
                    <label htmlFor="reset" >Reset Password  for {stdName}</label>
                    <span className='flex bg-[#fff] items-center rounded-lg p-2  focus:outline-[#fca311] text-lg shadow-md shadow-[#13213d]'>
                      <input type={visible ? 'text' : 'password'} id="password" value={stdPwd} onChange={(e) => setStdPwd(e.target.value)} className='text-[#14213d] w-full outline-none rounded-md' required autoComplete='off' placeholder='Password' />
                      {visible && stdPwd && <FaEye onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
                      {!visible && stdPwd && <FaEyeSlash onClick={() => setVisible(!visible)} className='w-4 h-4 bg-white mx-2 cursor-pointer text-[#000]' />}
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
        }
        {page === "facultyadmin" &&
          <section>
            <ManageFacultyAdmin facultyAdmin={facultyAdmin} setFacultyAdmin={setFacultyAdmin} mobile={mobile} setMobile={setMobile} faculty={faculty} visible={visible} setVisible={setVisible} />
          </section>
        }
        {page === "result" &&
          <ManageResult mobile={mobile} setMobile={setMobile} student={student} subject={subject} semester={semester} />
        }
        {
          page === "semester" &&
          <ManageSemester semester={semester} setSemester={setSemester} mobile={mobile} setMobile={setMobile} />
        }
        {
          page === "faculty" &&
          <ManageFaculty faculty={faculty} setFaculty={setFaculty} mobile={mobile} setMobile={setMobile} student={student} subject={subject} />
        }
        {
          page === "subject" &&

          < Subject subject={subject} semester={semester} mobile={mobile} setMobile={setMobile} teacher={teacher} />
        }
        {
          page === "admin" &&
          <ManageAdmin admin={admin} setAdmin={setAdmin} mobile={mobile} setMobile={setMobile} visible={visible} setVisible={setVisible} isLoading={isLoading} setIsLoading={setIsLoading} />
        }
        {
          page === "assessment" &&
          <GuardianAssessment mobile={mobile} setMobile={setMobile} student={student} assessment={assessment} subject={subject} />
        }
      </main>
    </div>
  )
}

export default Admin