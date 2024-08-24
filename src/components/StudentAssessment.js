import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx';
import { MdOutlineQuestionAnswer } from 'react-icons/md';

const StudentAssessment = ({ assessment, student, mobile, setMobile, students }) => {
    const [list, setList] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [roll, setRoll] = useState("")
    useEffect(() => {
        let updatedList = [];
        student.forEach(std => {
            let filteredAssessments = assessment.filter(res => res.rollno === students.find(stud => stud._id === std).rollno);
            if (filteredAssessments.length > 0) {
                updatedList.push(filteredAssessments);
            }

        });
        setList(updatedList);
        setFilteredList(updatedList)
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault()
        setFilteredList(list.map(li => li.filter(l => l.rollno === roll)))

    }

    const exportToExcel = () => {
        const data = []
        filteredList.map((list) => list.map((li) => {
            data.push({ rollno: li.rollno, subject: li.subjects, Total: li.marks[0], Received: li.marks[1] })
        }))

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
        link.download = 'Assessment.xlsx'; // Filename for download

        // Append the link to the body (required for Firefox)
        document.body.appendChild(link);

        // Programmatically click the link to trigger download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);


    };
    return (
        <section className='w-full  h-screen bg-[#e5e5e5] flex flex-col'>
            <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
                <button className="block sm:hidden p-2">
                    <GiHamburgerMenu
                        className=" w-10 h-10"
                        onClick={() => setMobile(!mobile)}
                    />
                </button>
                <h2>Students' Assessment</h2>
            </article>
            <form className='p-4 flex gap-4 flex-wrap items-center' onSubmit={(e) => e.preventDefault()}>
                <select value={roll} onChange={(e) => setRoll(e.target.value)} className='p-3  border focus:border-[#fca311] rounded-lg font-Concert shadow-md shadow-[#13213d] outline-none'>
                    {
                        student.map((std) =>
                            <option value={students.find(stud => stud._id === std).rollno}>
                                {students.find(stud => stud._id === std).rollno}
                            </option>
                        )
                    }
                </select>
                <button onClick={handleSubmit} className=' border  bg-[#fca311] p-2 rounded-lg hover:scale-x-105 px-6 shadow-md shadow-[#13213d]'>Apply</button>
                <button onClick={exportToExcel} className=' border  bg-[#fca311] p-2 rounded-lg hover:scale-x-105 px-6 shadow-md shadow-[#13213d]'>Download Excel File</button>
            </form>

            {!filteredList[0]?.length && <p className='p-4 mx-2 text-lg'>No Assessment</p>}
            {filteredList.length !== 0 &&
                <article className='p-4 overflow-y-auto flex flex-col gap-4 grow '>

                    {filteredList.map((listArr) => (
                        listArr.map(li => (
                            <li key={li._id} className='w-full  shadow-sm  p-4 font-Concert rounded-xl  flex  flex-col lg:flex-row justify-between  shadow-[#13213d] items-start  lg:items-center  bg-[#fff] text-[#000]'>
                                <span className='w-28 flex gap-2 items-center'><MdOutlineQuestionAnswer className='w-5 h-5' />{li.rollno}</span>
                                <span className='w-24'>{li.subjects}</span>
                                <span className='w-32'>{li.type}</span>
                                <span className='w-10' title='Total'>{li.marks[0]}</span>
                                <span className='w-10' title='Received'>{li.marks[1]}</span>
                            </li>
                        ))
                    ))}
                </article>
            }
        </section>
    )
}

export default StudentAssessment