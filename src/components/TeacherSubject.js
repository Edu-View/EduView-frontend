import React from 'react'
import { FaBook } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
const TeacherSubject = ({ mobile, setMobile, teacher, subject }) => {
  return (
    <section className='w-full  h-screen bg-[#e5e5e5] flex flex-col'>
      <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
        <button className='block sm:hidden p-2'>
          <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
        </button>
        <h2 >Subjects</h2>
      </article>
      <section className=" max-h-80] overflow-y-auto shadow-lg mt-4 p-2 grow">
        <ul className='w-full  flex flex-col gap-2'>
          {teacher.subjectcode.map((element) => (
            <li key={element} className='w-full lg:w-1/2 shadow-sm  p-4 font-Concert rounded-xl  flex flex-col lg:flex-row justify-start  shadow-[#13213d] items-start lg:items-center gap-4 bg-[#fff] text-[#000]'>
              <span className='w-28 flex gap-4'>
                <FaBook className='w-5 h-5' />
                {element}
              </span>
              <span className='w-72'>
                {
                  (subject.find(sub => sub.subject === element)).name
                }
              </span>
              <span>
                {
                  (subject.find(sub => sub.subject === element)).semester
                }
              </span>

            </li>
          ))}
        </ul>


      </section>
    </section>
  )
}

export default TeacherSubject