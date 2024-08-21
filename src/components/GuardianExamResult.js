import React from 'react'
import { useState, useEffect } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoMdCodeDownload } from 'react-icons/io';
import * as XLSX from 'xlsx';

const GuardianExamResult = ({ result, student, mobile, setMobile }) => {
  const [list, setList] = useState([])
  useEffect(() => {
    const updatedList = student.map(std => {
      const foundResult = result.find(res => res.rollno === std);
      return foundResult;
    });
    setList(updatedList.filter(item => item !== undefined));
  }, [student, result]);

  const exportToExcel = () => {
    const data = []
    list.map(li => {
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

    // Create a worksheet from the data
    const ws = XLSX.utils.json_to_sheet(data);

    // Create a new Workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Convert workbook to binary string
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the binary string
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a link element
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'result.xlsx'; // Filename for download

    // Append the link to the body (required for Firefox)
    document.body.appendChild(link);

    // Programmatically click the link to trigger download
    link.click();

    // Remove the link from the document
    document.body.removeChild(link);


  };


  return (
    <section className='w-full  h-screen flex flex-col bg-[#e5e5e5]'>
      <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
        <button className="block sm:hidden p-2">
          <GiHamburgerMenu
            className=" w-10 h-10"
            onClick={() => setMobile(!mobile)}
          />
        </button>
        <h2>Students' Result</h2>
      </article>
      {!list.length && <p className='p-4 mx-2 text-lg'>No Result</p>}
      {list.length !== 0 &&
        <article className='p-4'>
          <button onClick={exportToExcel} className='  bg-[#fca311] p-3 rounded-2xl hover:scale-x-105 px-6 shadow-md shadow-[#13213d] flex items-center gap-2'>Download <IoMdCodeDownload className='w-6 h-6' /></button>
          <ul className='py-4 flex flex-col gap-2'>
            {list.map((list) =>
            (<li key={list._id} className='flex  flex-col lg:flex-row gap-4 bg-[#fff] p-3  rounded-md border-2 justify-between shadow-sm shadow-[#13213d] items-start lg:items-center '>
              <span className='w-96'>{list.rollno}</span>
              {list.subjects.map((element, index) => (
                <span key={list.rollno} className='flex flex-col text-[#000] gap-2 items-center'>{element} : {list.grading[index]} ({list.gradeScore[index]})</span>
              ))
              }
            </li>)
            )}
          </ul>
        </article>
      }
    </section>
  )
}

export default GuardianExamResult