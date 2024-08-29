import React, { useEffect } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useState } from 'react'
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'
import { FaGraduationCap } from 'react-icons/fa'
import axios from '../api/axios'
import { IoMdCodeDownload } from 'react-icons/io'
import * as XLSX from 'xlsx';


const ManageResult = ({ mobile, setMobile, student, subject, semester }) => {

  const [sem, setSem] = useState("")
  const [list, setList] = useState([])
  const [rollno, setRollno] = useState("")
  const [form, setForm] = useState(false)
  const [subArr, setSubArr] = useState([])
  const [grade, setGrade] = useState("")
  const [count, setCount] = useState(0)
  const [gradeArr, setGradeArr] = useState([])
  const [gradeScoreArr, setGradeScoreArr] = useState([])
  const [result, setResult] = useState(false)
  const [apply, setApply] = useState(false)
  const [subForm, setSubForm] = useState(false)
  const [updateForm, setUpdateForm] = useState(false)
  const [datetime, setDatetime] = useState()
  const [isRotate, setIsRotate] = useState(false)
  const [confirmForm, setConfirmForm] = useState(false)
  const [confirmQuestion, setConfirmQuestion] = useState("")


  const sorting = (student) => {
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
      const prefixA = getPrefix(a?.rollno);
      const prefixB = getPrefix(b?.rollno);
      const prefixComparison = rollOrder[prefixA] - rollOrder[prefixB];
      if (prefixComparison !== 0) {
        return prefixComparison;
      }
      return getNumber(a?.rollno) - getNumber(b?.rollno);
    });

    setList(sortedStudents)
  }
  useEffect(() => {
    setSem(semester[0]?.semester)
    const getResult = async () => {
      const response = await axios.get("result")
      if (response.data.length) {
        sorting(response.data)
        localStorage.setItem("result", JSON.stringify([]))
        console.log("length")
      }
      else {
        sorting(JSON.parse(localStorage.getItem("result")) || [])
        console.log("no length")
      }

    }
    getResult()

  }, [])


  const exportToExcel = () => {
    const data = []
    list.filter(res => res.semester === sem).map(li => {
      li.subjects.forEach((subject, index) => {
        data.push({
          rollno: li.rollno,

          subject: subject,
          grade: li.grading[index],
          gradeScore: li.gradeScore[index],
          semester: li.semester

        });
      });
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleList = (e) => {
    setResult(false)
    setApply(true)
    e.preventDefault()
    setRollno(student.filter(student => student.semester === sem)[0].rollno)

  }

  const handleType = (e) => {
    e.preventDefault()
    setResult(false)
    setSubArr([])
    if (rollno.includes("CS")) {
      ((subject.filter(subject => subject.semester === sem)).filter(subject => subject.type === "CS" || subject.type === "CST")).map(sub => setSubArr(prev => [...prev, sub.subject]))
      setSubForm(true)
    }
    else {
      ((subject.filter(subject => subject.semester === sem)).filter(subject => subject.type === "CT" || subject.type === "CST")).map(sub => setSubArr(prev => [...prev, sub.subject]))
      setSubForm(true)
    }
  }

  const handleGrade = (e) => {
    e.preventDefault()
    const grading = grade >= 90 ? "A+" : grade >= 80 ? "A" : grade >= 75 ? "A-" : grade >= 70 ? "B+" : grade >= 65 ? "B" : grade >= 60 ? "B-" : grade >= 55 ? "C+" : grade >= 50 ? "C" : grade >= 40 ? "D" : "F";
    const scores = grade >= 90 ? "4" : grade >= 80 ? "4" : grade >= 75 ? "3.67" : grade >= 70 ? "3.33" : grade >= 65 ? "3" : grade >= 60 ? "2.67" : grade >= 55 ? "2.33" : grade >= 50 ? "2.0" : grade >= 40 ? "1.0" : "0";
    setGradeArr(prev => [...prev, grading])
    setGradeScoreArr(prev => [...prev, scores])
    if (count === subArr.length - 1) {
      setSubForm(false)
      setResult(true)
    }
    setCount(prev => prev + 1)
    setGrade("")
  }

  const handlePost = async (e) => {
    e.preventDefault();
    setIsRotate(false);

    try {
      const desiredTime = new Date(datetime);
      const newResult = {
        rollno,
        semester: sem,
        subjects: subArr,
        grading: gradeArr,
        gradeScore: gradeScoreArr,
        scheduledTime: desiredTime.toISOString(),
      };

      setList((prev) => [...prev, newResult]);
      localStorage.setItem("result", JSON.stringify([...list, newResult]));

      // Reset the form
      setSubForm(false);
      setForm(false);
      setRollno("");
      setSubArr([]);
      setGradeArr([]);
      setGradeScoreArr([]);
      setResult(false);
      setCount(0);

      // Post immediately to the server
      await axios.post(
        "/result",
        JSON.stringify(newResult),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Error handling post:", err);
    }
  };


  const handleEdit = (roll, sub) => {
    setUpdateForm(true)
    setCount(0)
    setSubForm(true)
    setSubArr(sub)
    setRollno(roll)
  }
  const handleCancel = () => {
    if (!form) {
      setForm(true)
      setIsRotate(true)
    }
    else {
      setIsRotate(false)
      setForm(false)
      setSubForm(false)
      setCount(0)
      setSubArr([])
      setResult(false)
      setRollno(student.filter(student => student.semester === sem)[0].rollno)
    }
  }

  const handleUpdateCancel = () => {
    setUpdateForm(false)
    setCount(0)
    setSubForm(false)
    setSubArr([])
    setRollno("")
  }


  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const desiredTime = new Date(datetime);
      const updatedResult = {
        rollno,
        semester: sem,
        subjects: subArr,
        grading: gradeArr,
        gradeScore: gradeScoreArr,
        scheduledTime: desiredTime.toISOString(),
      };

      // Update the local list with the new data
      const newList = list.map((item) =>
        item.rollno === rollno ? updatedResult : item
      );
      setList(newList);
      await localStorage.setItem("result", JSON.stringify(newList));

      // Reset the form
      setSubForm(false);
      setRollno("");
      setSubArr([]);
      setGradeArr([]);
      setGradeScoreArr([]);
      setResult(false);
      setCount(0);
      setUpdateForm(false);

      // Post the update to the server immediately
      await axios.put(
        "/result",
        JSON.stringify(updatedResult),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      localStorage.setItem("result", JSON.stringify([]));
    } catch (err) {
      console.error("Error handling update:", err);
    }
  };


  const handleDelete = async (roll) => {
    try {
      // Update local state and localStorage
      const newList = list.filter(list => list.rollno !== roll);
      setList(newList);
      await localStorage.setItem("result", JSON.stringify(newList));

      // Calculate the scheduled time
      const desiredTime = new Date(datetime);
      const deleteData = { rollno: roll, scheduledTime: desiredTime.toISOString() };

      // Send the delete request to the backend with the scheduled time
      await axios.delete("/result", {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
        data: JSON.stringify(deleteData)
      });

    } catch (err) {
      console.log(err);
    }
  };


  const handleDeleteAll = async () => {
    setConfirmForm(false)
    setConfirmQuestion("")
    try {
      await axios.delete("/result/all", {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      setList([])
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <section className='w-full  h-screen bg-[#e5e5e5] flex flex-col'>
      <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
        <button className='block sm:hidden p-2'>
          <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
        </button>
        <h2>Result</h2>
      </article>
      <article className='p-4'>
        <article className='flex justify-start gap-4 flex-col lg:flex-row'>
          <form onSubmit={(e) => e.preventDefault()} className='flex flex-row gap-4 items-center flex-wrap' name='result filter form'>

            <select id="semester" className='border-[#fca311] border p-3 outline-none rounded-md  shadow-md shadow-[#13213d]' value={sem} onChange={(e) => setSem(e.target.value)} required>
              {semester.map((semester) =>
                <option value={semester.semester} key={semester._id}>{semester.semester}</option>
              )}
            </select>
            <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className='border border-[#fca311] rounded-xl p-3  shadow-md shadow-[#13213d]' required />


            <button type="submit" onClick={handleList} className='p-3 px-6 bg-[#fca311] rounded-2xl hover:scale-105 max-w-36 shadow-md shadow-[#13213d]'>Apply</button>
            <button onClick={exportToExcel} className='    bg-[#fca311] p-3 rounded-2xl hover:scale-x-105 px-6 shadow-md shadow-[#13213d] flex items-center gap-2'>Download <IoMdCodeDownload className='w-6 h-6' /></button>

          </form>
          <button onClick={() => setConfirmForm(true)} className='    bg-[#000] text-[#e5e5e5] p-3 rounded-2xl hover:scale-x-105 px-6 shadow-md shadow-[#13213d] flex items-center gap-2'>Delete all Result<FaTrash /></button>
        </article>
      </article>
      <article>
        {form &&
          <article className='fixed w-screen h-screen left-0 top-0 flex justify-center items-center bg-transparent'>
            <form className='p-6 bg-[#000] min-h-80 fixed top-1/4  flex flex-col rounded-xl justify-start gap-2' name='student result adding form'>
              <span className='flex justify-between mb-2'>
                <select value={rollno} onChange={(e) => setRollno(e.target.value)} className='border-[#fca311] border p-3 outline-none rounded-md'>
                  {student.filter(student => student.semester === sem).map((std) =>
                    <option value={std.rollno} key={std._id}>{std.rollno}</option>
                  )}
                </select>
                <button className='p-2 px-6 border bg-[#fca311] mx-6 rounded-2xl hover:scale-105' onClick={handleType}>SET</button>
              </span>
              {subForm &&
                <section className='p-2 flex flex-col gap-6 items-start text-[#e5e5e5]'>
                  <label className='text-[#e5e5e5] mx-2'>{subArr[count]}</label>
                  <span className='flex'>
                    <input type="text" className='bg-transparent border border-[#fca311] rounded-xl p-2  w-20 text-[#e5e5e5]' value={grade} onChange={(e) => setGrade(e.target.value)} />
                    <button onClick={handleGrade} className='p-2 px-6 border bg-[#fca311] mx-6 rounded-xl text-[#000] hover:scale-105'>Add</button>
                  </span>
                </section>
              }
              {
                result &&
                <section className='flex flex-col items-start min-w-40'>
                  {subArr.map((element, index) => (
                    <span key={index} className='flex flex-col text-[#e5e5e5] gap-2 items-center my-4'>{element} : {gradeArr[index]}  ({gradeScoreArr[index]})</span>
                  ))
                  }
                  <span className='flex gap-4 justify-between'>
                    <button type="submit" className='p-2 px-6 bg-[#fca311] rounded-xl text-[#000] hover:scale-105' onClick={handlePost}>Post</button>
                    <button className='p-2 px-6 bg-[#fca311] rounded-xl text-[#000] hover:scale-105 max-w-40' onClick={handleCancel}>Cancel</button>
                  </span>
                </section>
              }

            </form>
          </article>
        }
      </article>
      {!(list.filter(list => list.semester === sem)).length && <p className='p-4 mx-2 text-lg'>No Result</p>}
      {list.length !== 0 &&
        <article className='p-3 overflow-y-scroll flex flex-col gap-4'>
          {(list.filter(list => list.semester === sem)).map((list) =>
          (<li key={list._id} className='w-full shadow-sm  p-4 font-Concert rounded-xl  flex flex-col md:flex-row justify-between  shadow-[#13213d] items-start md:items-center  bg-[#fff] text-[#000] gap-2'>
            <span className='w-96 flex items-center gap-4'><FaGraduationCap className='w-5 h-5' />{list.rollno}</span>
            {list.subjects.map((element, index) => (
              <span key={index} className='flex flex-col text-[#000] gap-2 items-center '>{element} : {list.grading[index]} ({list.gradeScore[index]})</span>
            ))
            }
            <button>
              {sem && datetime && apply && <FaEdit className='w-6 h-6  hover:text-[#fca311]' onClick={() => handleEdit(list.rollno, list.subjects)} />}
            </button>
            <button>
              {sem && datetime && apply && <FaTrash className='w-6 h-6  hover:text-[#fca311]' onClick={() => handleDelete(list.rollno)} />}
            </button>
          </li>)
          )}
        </article>
      }
      {
        updateForm &&
        <article className='fixed w-screen h-screen left-0 top-0 flex justify-center items-center bg-transparent grow overflow-y-auto'>
          <form className='p-6 bg-[#000] min-h-80 fixed top-1/4  flex flex-col rounded-xl min-w-52' name='result update form'>
            <span className='flex justify-between'>
              <label className='flex justify-between mb-2 text-[#e5e5e5]'>
                {rollno}
              </label>
              <FaTimes className='w-5 h-5 text-white hover:text-[#fca311]' onClick={() => setUpdateForm(false)} />
            </span>
            {subForm &&
              <section className='p-2 flex flex-col gap-6 items-start'>
                <label className='text-[#e5e5e5] mx-2'>{subArr[count]}</label>
                <span className='flex'>
                  <input type="text" className='bg-transparent border border-[#fca311] rounded-xl p-2  w-20 text-[#e5e5e5]' value={grade} onChange={(e) => setGrade(e.target.value)} />
                  <button onClick={handleGrade} className='p-2 px-6 border border-[#fca311] mx-6 rounded-xl bg-white'>Add</button>
                </span>
              </section>
            }

            {
              result &&
              <section className='flex flex-col items-start'>
                {subArr.map((element, index) => (
                  <span key={index} className='flex flex-col text-[#e5e5e5] gap-2 items-center my-4'>{element} : {gradeArr[index]}  ({gradeScoreArr[index]})</span>

                ))
                }
                <span className='flex gap-4'>
                  <button type="submit" className='p-2 px-6 border border-[#fca311] rounded-xl bg-white' onClick={handleUpdate}>Update</button>
                  <button className='p-2 px-6 bg-[#fca311] rounded-xl text-[#000] hover:scale-105 max-w-40' onClick={handleUpdateCancel}>Cancel</button>
                </span>
              </section>

            }
          </form>
        </article>
      }
      {sem && datetime && apply && <button className={`bg-[#fca311] rounded-full p-4 fixed right-0 bottom-0 m-6 ${isRotate ? 'rotate-45' : ''} shadow-md shadow-[#13213d]`} onClick={handleCancel}><FaPlus /></button>}
      {confirmForm &&
        <article className='fixed left-0 top-0 bg-transparent w-screen h-screen flex justify-center items-center'>

          <form className='p-6 bg-[#000] text-[#e5e5e5] rounded-xl fixed top-2/4 flex flex-col gap-6 animate-open-menu' onSubmit={(e) => e.preventDefault()} name='all result deleting form'>
            <p className='text-xl'>Type "Delete all result" below to delete all result</p>
            <span>
              <input type="text" name='confirm' className='p-2   border focus:border-[#fca311]  rounded-lg font-Concert shadow-md shadow-[#13213d]  outline-none w-full text-[#000]' autoComplete='off' value={confirmQuestion} onChange={(e) => setConfirmQuestion(e.target.value)} />
            </span>
            <span>
              <button type='submit' className='bg-[#f00] p-2 px-4 rounded-lg mt-2 mr-4 disabled:opacity-55 disabled:cursor-not-allowed' onClick={handleDeleteAll} disabled={confirmQuestion === "Delete all result" ? false : true}>
                Delete
              </button>
              <button className='bg-[#e5e5e5] p-2 px-4 rounded-lg mt-2 mr-4 text-[#14213d]' onClick={() => setConfirmForm(false)}>Cancel</button>
            </span>
          </form>
        </article>
      }
    </section>


  )
}

export default ManageResult