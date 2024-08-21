import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdPeople } from "react-icons/md";
const GuardianStudent = ({ mobile, setMobile, teacher, student }) => {
  return (
    <section className='w-full  h-screen bg-[#e5e5e5] flex flex-col'>
      <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
        <button className="block sm:hidden p-2">
          <GiHamburgerMenu
            className=" w-10 h-10"
            onClick={() => setMobile(!mobile)}
          />
        </button>
        <h2>Guardian Students</h2>
      </article>
      <section className=" max-h-80] overflow-y-auto shadow-lg mt-4 p-2 grow">
        <ul className='w-full  flex flex-col gap-2'>
          {teacher.students.map((element) => {
            const foundStudent = student.find((std) => std._id === element);
            return (
              <li key={element} className='w-full shadow-sm  p-4 font-Concert rounded-xl  flex  flex-col lg:flex-row justify-between  shadow-[#13213d] items-start lg:items-center gap-2 bg-[#fff] text-[#000]'>
                <span className="w-28 flex items-center gap-4">
                  <MdPeople className="w-5 h-5" />{foundStudent.rollno}</span>
                <span className="w-40 ">{foundStudent.username}</span>
                <span className="w-52">{foundStudent.email}</span>
                <span className="w-52">{foundStudent.semester}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
};

export default GuardianStudent;
