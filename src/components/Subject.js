import React, { useEffect } from 'react'
import { useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaBook } from 'react-icons/fa'
const Subject = ({ subject, semester, mobile, setMobile, teacher }) => {
    const [subArray, setSubArray] = useState([])
    const [sem, setSem] = useState("all")
    useEffect(() => {
        setSubArray(subject)
    }, [])

    const handleSemester = (semVal) => {
        setSem(semVal)
        if (semVal === "all") {
            setSubArray(subject)
        }
        else {
            setSubArray(subject.filter((sub => sub.semester === semVal)))
        }
    }
    return (
        <section className='w-full  h-screen bg-[#e5e5e5] flex flex-col'>
            <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
                <button className='block sm:hidden p-2'>
                    <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
                </button>
                <h2 className='px-2'>Subject</h2>
            </article>
            <section className='lg:text-xl p-4 lg:p-6  flex gap-4 flex-wrap'>
                <button className={` text-sm md:text-lg bg-[#fff] hover:text-[#000] p-2 px-10 border-2 hover:scale-x-105 rounded-full outline-none border-[#000] ${sem === 'all' && 'border-[#fca311] text-[#000] shadow-sm shadow-[#fca311]'}`}
                    onClick={() => handleSemester("all")}>All</button>
                {semester.map((semester) =>
                    <button className={`text-sm lg:text-lg bg-[#fff] hover:text-[#000] p-2  lg:px-6 border-2 hover:scale-x-105 rounded-full border-[#000] ${sem === semester.semester && 'border-[#fca311] text-[#14213d] shadow-sm shadow-[#fca311]'}`} onClick={() => handleSemester(semester.semester)} key={semester.semester}>{semester.semester}</button>
                )}

            </section>

            {!subArray.length && <p className='px-4 ml-4  text-lg'>No Subjects in this Semester</p>}
            <ul className='w-full flex flex-col gap-4 items-start p-6 overflow-y-auto  grow'>
                {subArray.map((subj, index) => (
                    <li key={index} className='w-full  lg:w-3/4 shadow-sm  p-4 font-Concert rounded-xl  flex flex-col lg:flex-row justify-start   shadow-[#13213d] items-start   bg-[#fff] text-[#000] gap-4 lg:gap-8'>
                        <span className='w-36 flex items-center gap-4 '><FaBook />{subj.subject}</span>
                        <span className='w-72  flex items-center gap-4'> {subj.name}</span>
                        <span className='cursor-pointer' title={teacher.find(teacher => (teacher.subjectcode).includes(subj.subject))?.faculty}>{teacher.find(teacher => (teacher.subjectcode).includes(subj.subject))?.username}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default Subject