import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useState, useEffect } from 'react'
import { IoMdCodeDownload } from 'react-icons/io';
import { MdQuestionAnswer } from 'react-icons/md';
import * as XLSX from 'xlsx';
const GuardianAssessment = ({ assessment, student, mobile, setMobile, subject }) => {
    const [list, setList] = useState([])
    const [sub, setSub] = useState(subject[0]?.subject)
    const [typeArray, setTypeArray] = useState("")
    const [type, setType] = useState("")

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

            const prefixA = getPrefix(a[0]?.rollno);
            const prefixB = getPrefix(b[0]?.rollno);
            const prefixComparison = rollOrder[prefixA] - rollOrder[prefixB];
            if (prefixComparison !== 0) {
                return prefixComparison;
            }
            return getNumber(a[0]?.rollno) - getNumber(b[0]?.rollno);
        });

        setList(sortedStudents)
    }

    useEffect(() => {
        let updatedList = [];
        student.forEach(std => {
            let filteredAssessments = assessment.filter(res => res.rollno === std.rollno);
            if (filteredAssessments.length > 0) {
                updatedList.push(filteredAssessments);
            }
        });
        sorting(updatedList);
    }, []);

    useEffect(() => {
        const subList = assessment.filter(a => a.subjects === sub)
        const types = [...new Set(subList.map(sub => sub.type))];
        setType(types[0])
        setTypeArray(types)
        setType(types[0])
    }, [sub])


    const exportToExcel = () => {
        const data = []
        const newList = (list.map(li => li.filter(l => l.subjects === sub && l.type === type)))
        newList.map((list) => list.map((li) => {
            data.push({ rollno: li.rollno, subject: li.subjects, Total: li.marks[0], Received: li.marks[1] })
        }))
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Assessment.xlsx';
        document.body.appendChild(link);
        link.click();
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

            <form className='p-4 flex items-center  gap-4  flex-wrap' onSubmit={(e) => e.preventDefault()} name='assessment filter form'>
                <select value={sub} onChange={(e) => setSub(e.target.value)} className='p-3  border focus:border-[#fca311] outline-none rounded-lg font-Concert shadow-md shadow-[#13213d]'>
                    {
                        subject.map((sub) =>

                            <option value={sub.subject} key={sub.subject}>
                                {sub.subject}
                            </option>
                        )
                    }
                </select>
                {typeArray.length !== 0 && (
                    <select value={type} onChange={(e) => setType(e.target.value)} className='p-3  border focus:border-[#fca311] outline-none rounded-lg font-Concert shadow-md shadow-[#13213d]'>
                        {
                            typeArray.map((type) =>
                                <option value={type}>
                                    {type}
                                </option>
                            )
                        }
                    </select>
                )
                }
                <button onClick={exportToExcel} className=' border  bg-[#fca311] p-3 rounded-lg hover:scale-x-105 px-6 shadow-md shadow-[#13213d] flex items-center gap-2'>Download <IoMdCodeDownload className='w-6 h-6' /></button>
            </form>

            <article className='p-4 overflow-y-auto flex flex-col gap-4 grow '>
                {!typeArray.length && <p className='px-2 text-lg'>No Assessment</p>}
                {(list.map(li => li.filter(l => l.subjects === sub && l.type === type))).map((listArr) => (
                    listArr.map(li => (
                        <li key={li._id} className='w-full  shadow-sm  p-4 font-Concert rounded-xl  flex flex-col lg:flex-row justify-between  shadow-[#13213d] items-start lg:items-center  bg-[#fff] text-[#000]'>
                            <span className='w-24 flex items-center gap-4'><MdQuestionAnswer className='w-5 h-5' />{li.rollno}</span>
                            <span className='w-24'>{li.subjects}</span>
                            <span className='w-32'>{li.type}</span>
                            <span className='w-10' title='Total'>{li.marks[0]}</span>
                            <span className='w-10' title='Received'>{li.marks[1]}</span>
                        </li>
                    ))
                ))}

            </article>

        </section>
    )
}

export default GuardianAssessment