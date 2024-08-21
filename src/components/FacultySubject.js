import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
const FacultySubject = ({ mobile, setMobile, faculty, admin, subject }) => {
  return (
    <section className='p-2 w-full'>
      <article className='flex font-bold font-Concert text-xl p-2 shadow-md items-center'>
        <button className='block sm:hidden p-2'>
          <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
        </button>
        <h2 >Subjects</h2>
      </article>
      <section className='w-full h-full  p-4  overflow-y-scroll'>
        {((faculty.find(fac => fac.faculty === admin.faculty)).subjects).map((element) => (
          <span key={element} className='p-2 border border-[#fca311]  my-4 rounded-xl block max-w-96'>{element}&nbsp;&nbsp;&nbsp;&nbsp;
            {
              (subject.find(sub => sub.subject === element)).name
            }
          </span>
        ))}
      </section>

    </section>
  )
}

export default FacultySubject