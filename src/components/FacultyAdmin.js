import React from "react";
import axios from "../api/axios";
import { useState, useEffect, useRef } from "react";
import { MdQuestionAnswer, MdSchool, MdSettings } from "react-icons/md";
import { FaTimes, FaChalkboard, FaBook, FaEye, FaEyeSlash } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdPeople } from "react-icons/md";
import useAuth from "../hooks/useAuth";
import FacultyStudent from "./FacultyStudent";
import ManageTeacher from "./ManageTeacher";
import ManageSubject from "./ManageSubject";
import GuardianAssessment from "./GuardianAssessment";
import { IoGrid } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import Spinner from "./Spinner";

const FacultyAdmin = () => {
  const { auth, setAuth } = useAuth();
  const [page, setPage] = useState("overview");
  const [mobile, setMobile] = useState(false);
  const [admin, setAdmin] = useState([]);
  const [teacher, setTeacher] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [student, setStudent] = useState([]);
  const [subject, setSubject] = useState([])
  const [result, setResult] = useState([])
  const [semester, setSemester] = useState([])
  const [assessment, setAssessment] = useState([])
  const [pwdForm, setPwdForm] = useState(false)
  const [oldPwd, setOldPwd] = useState("")
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const [visible, setVisible] = useState(false)
  const [visible1, setVisible1] = useState(false)
  const [visible2, setVisible2] = useState(false)



  const errRef = useRef();
  useEffect(() => {
    setErrMsg('')
  }, [oldPwd, newPwd, confirmPwd])

  useEffect(() => {
    const getFacultyAdmin = async () => {
      const response = await axios.get("facultyadmin");
      setAdmin(response.data.find((admin) => admin.email === auth.user));
    };
    const getStudent = async () => {
      const response = await axios.get("student");
      setStudent(response.data);
    };
    const getFaculty = async () => {
      const response = await axios.get("faculty");
      setFaculty(response.data);
    };
    const getTeacher = async () => {
      const response = await axios.get("teacher");
      setTeacher(response.data);
    };
    const getSubject = async () => {
      const response = await axios.get("subject");
      setSubject(response.data);
    };
    const getResult = async () => {
      const response = await axios.get("result")
      setResult(response.data)
    }
    const getAssessment = async () => {
      const response = await axios.get("assessment")
      setAssessment(response.data)
    }
    const getSemester = async () => {
      const response = await axios.get("semester")
      setSemester(response.data)
    }


    getFacultyAdmin();
    getFaculty();
    getTeacher();
    getStudent();
    getSubject();
    getResult();
    getAssessment();
    getSemester();
  }, []);
  const updatePassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (newPwd !== confirmPwd) {
      setErrMsg("New Password and Confirm Password should be match")
      setIsLoading(false)
    }
    else {
      try {
        await axios.put("/facultyadminauth", JSON.stringify({ email: auth.user, pwd: oldPwd, newPwd: newPwd }), {
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
    <div className="flex font-Concert">
      <header>
        <nav className="bg-[#000] font-Concert min-h-screen w-44 text-[#fff] hidden sm:flex flex-col justify-start p-2 items-center gap-6 animate-open-menu">
          <figure className="flex flex-col items-center">
            <MdSchool className=" w-20 h-20" />
            <figcaption>Faculty Admin</figcaption>
          </figure>
          <menu className="flex flex-col items-start justify-evenly gap-7">
            <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'overview' && `text-[#fca311]`}`} onClick={() => setPage("overview")}><IoGrid className="w-5 h-5" />Overview</button>
            <button className={`hover:text-[#fca311] flex items-center gap-4 ${page === 'teacher' && `text-[#fca311]`}`} onClick={() => setPage("teacher")}><FaChalkboard className="w-5 h-5" />Teachers</button>
            <button className={`hover:text-[#fca311]  flex items-center gap-4 ${page === 'student' && `text-[#fca311]`}`} onClick={() => setPage("student")}><MdPeople className="w-5 h-5" />Students</button>
            <button className={`hover:text-[#fca311] flex items-center gap-4 ${page === 'subject' && `text-[#fca311]`}`} onClick={() => setPage("subject")}><FaBook className="w-5 h-5" />Subjects</button>
            <button className={`hover:text-[#fca311] flex items-center gap-4 ${page === 'assessment' && `text-[#fca311]`}`} onClick={() => setPage("assessment")}><MdQuestionAnswer className="w-5 h-5" />Assessments</button>
            <button className="hover:text-[#fca311] flex items-center gap-4" onClick={() => setAuth({})}><BiLogOut className="w-5 h-5" />Logout</button>
          </menu>
        </nav>
        {mobile && (
          <section className="flex flex-row animate-open-menu origin-left">
            <nav className="bg-[#000] font-Concert min-h-screen w-44 text-[#fff] flex flex-col justify-start p-2 items-center gap-6  fixed left-0 ">
              <figure className="flex flex-col items-center">
                <MdSchool className=" w-20 h-20" />
                <figcaption>Admin</figcaption>
              </figure>
              <menu className="flex flex-col items-start justify-evenly gap-7" onClick={() => setMobile(false)}>
                <button className={`hover:text-[#fca311] flex items-center gap-4  ${page === 'overview' && `text-[#fca311]`}`} onClick={() => setPage("overview")}><IoGrid className="w-5 h-5" />Overview</button>
                <button className={`hover:text-[#fca311] flex items-center gap-4 ${page === 'teacher' && `text-[#fca311]`}`} onClick={() => setPage("teacher")}><FaChalkboard className="w-5 h-5" />Teachers</button>
                <button className={`hover:text-[#fca311]  flex items-center gap-4 ${page === 'student' && `text-[#fca311]`}`} onClick={() => setPage("student")}><MdPeople className="w-5 h-5" />Students</button>
                <button className={`hover:text-[#fca311] flex items-center gap-4 ${page === 'subject' && `text-[#fca311]`}`} onClick={() => setPage("subject")}><FaBook className="w-5 h-5" />Subjects</button>
                <button className={`hover:text-[#fca311] flex items-center gap-4 ${page === 'assessment' && `text-[#fca311]`}`} onClick={() => setPage("assessment")}><MdQuestionAnswer className="w-5 h-5" />Assessments</button>
                <button className="hover:text-[#fca311] flex items-center gap-4" onClick={() => setAuth({})}><BiLogOut className="w-5 h-5" />Logout</button>
              </menu>
            </nav>
            <FaTimes className=' text-[#fff] fixed top-0 left-44 w-10 h-10 cursor-pointer p-2 bg-[#000] rounded-r-xl' onClick={() => setMobile(!mobile)} />
          </section>
        )}
      </header>
      <main className="w-full">
        {page === "overview" && (
          <section className='w-full  h-screen flex flex-col'>
            <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
              <button className="block sm:hidden p-2">
                <GiHamburgerMenu
                  className=" w-10 h-10"
                  onClick={() => setMobile(!mobile)}
                />
              </button>
              <h2 className='flex justify-between  w-full'>{admin.faculty}
                <button onClick={() => setPwdForm(true)}>
                  <MdSettings className='w-7 h-7 ' />
                </button>
              </h2>
            </article>
            <section className="flex flex-col items-center justify-start flex-wrap">
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 w-full p-6">
                <article
                  className="bg-[#fca311] p-6 rounded-2xl flex flex-col items-center cursor-pointer shadow-xl shadow-[#13213d]"
                  onClick={() => setPage("teacher")}
                >
                  <FaChalkboard className="w-10 h-10" />
                  <span className="text-2xl font-Concert">
                    {
                      teacher.filter(
                        (teacher) => teacher.faculty === admin.faculty
                      ).length
                    }
                  </span>
                  <p className="text-xl">Teachers</p>
                </article>
                {faculty.length && (
                  <article
                    className="bg-[#000] text-[#e5e5e5] p-6 rounded-2xl flex flex-col items-center cursor-pointer shadow-xl shadow-[#13213d]"
                    onClick={() => setPage("student")}
                  >
                    <MdPeople className="w-10 h-10" />
                    <span className="text-2xl font-Concert">
                      {
                        faculty.find(
                          (fac) => fac.faculty === admin.faculty
                        )?.students?.length
                      }
                    </span>
                    <p className="text-xl">Students</p>
                  </article>
                )}
                {admin && (
                  <article
                    className="bg-[#e5e5e5] p-6 rounded-2xl flex flex-col items-center cursor-pointer shadow-xl shadow-[#13213d]"
                    onClick={() => setPage("student")}
                  >
                    <MdPeople className="w-10 h-10" />
                    <span className="text-2xl font-Concert">
                      {(subject.filter(fac => fac.faculty === admin.faculty)).length}
                    </span>
                    <p className="text-xl">Subjects</p>
                  </article>
                )}
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

        )}
        {page === "teacher" && teacher.length && (
          <ManageTeacher
            mobile={mobile}
            setMobile={setMobile}
            teacher={teacher}
            setTeacher={setTeacher}
            subject={subject.filter(sub => sub.faculty === admin.faculty)}
            faculty={faculty}
            admin={admin}
            visible={visible}
            setVisible={setVisible}
            student={student}
          />
        )}

        {page === "student" && student.length && (
          <FacultyStudent
            faculty={faculty}
            mobile={mobile}
            setMobile={setMobile}
            admin={admin}
            student={student}
          />
        )}
        {page === "subject" && admin && (
          <ManageSubject subject={subject.filter(sub => sub.faculty === admin.faculty)} setSubject={setSubject} mobile={mobile} setMobile={setMobile} semester={semester} facultyName={admin.faculty} faculty={faculty.find(fac => fac.faculty === admin.faculty)} setFaculty={setFaculty} teacher={teacher} setTeacher={setTeacher} />
        )}


        {
          page === "assessment" &&
          <GuardianAssessment assessment={assessment} mobile={mobile} setMobile={setMobile} student={student} subject={subject.filter(sub => sub.faculty === admin.faculty)} />
        }
      </main>
    </div>
  );
};
export default FacultyAdmin;
