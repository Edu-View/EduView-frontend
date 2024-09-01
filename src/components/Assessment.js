import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaTrash, FaPlus, FaEdit } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import axios from '../api/axios'
import { MdOutlineQuestionAnswer } from 'react-icons/md'

const Assessment = ({ mobile, setMobile, teacher }) => {
    const [sub, setSub] = useState(teacher.subjectcode[0])
    const [type, setType] = useState("")
    const [apply, setApply] = useState(false)
    const [form, setForm] = useState(false)
    const [updateForm, setUpdateForm] = useState(false)
    const [stdRoll, setStdRoll] = useState("")
    const [list, setList] = useState([])
    const [filterList, setFilteredList] = useState([])
    const [total, setTotal] = useState("")
    const [receive, setReceive] = useState("")
    const [updateId, setUpdateId] = useState("")

    useEffect(() => {
        const getAssessment = async () => {
            const response = await axios.get("assessment")
            setList(response.data)
            setFilteredList(response.data)
        }
        getAssessment()
    }, [])
    const handleSubmit = (e) => {
        e.preventDefault()
        setApply(true)
        if (type) {
            setFilteredList(list.filter(li => li.type === type && li.subjects === sub))
        }
        else {
            setFilteredList(list.filter(li => li.subjects === sub))
        }
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        if (!sub || !type) {
            alert("Please fill out required fields")
        }
        else {
            try {
                await axios.post("/assessment", JSON.stringify({ rollno: stdRoll, subjects: sub, marks: [total, receive], type: type }), {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true
                }
                )
                const response = await axios.get("assessment")
                await setList(response.data)
                await setFilteredList(response.data.filter(li => li.type === type && li.subjects === sub))
                setForm(false)
                setStdRoll("")
                setReceive("")
            }
            catch (err) {
                console.log(err)
            }
        }
    }
    const handleUpdateForm = (id, roll, tt, rc, ty) => {
        setUpdateId(id)
        setUpdateForm(true)
        setStdRoll(roll)
        setTotal(tt)
        setReceive(rc)
        setType(ty)

    }
    const handleUpdateCancel = () => {
        setUpdateId("id")
        setUpdateForm(false)
        setStdRoll("")
        setTotal("")
        setReceive("")
    }




    const handleDelete = async (id) => {
        try {
            await axios.delete("/assessment", {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
                data: JSON.stringify({ id })
            });

            const response = await axios.get("assessment")
            await setList(response.data)
        } catch (err) {
            console.log(err);
        }
    }

    const handleUpdate = async () => {
        try {

            await axios.put("/assessment", JSON.stringify({ id: updateId, rollno: stdRoll, marks: [total, receive] }), {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            }
            )
            setStdRoll("")
            setTotal("")
            setReceive("")
            setUpdateId("")
            setUpdateForm(false)
            const response = await axios.get("assessment")
            await setList(response.data)
            await setFilteredList(response.data)
        }
        catch (err) {
            console.log(err)
        }
    }

    return (

        <section className='w-full  h-screen bg-[#e5e5e5] flex flex-col'>
            <article className='flex font-bold font-Concert text-xl p-4 shadow-md items-center shadow-[#13213d] py-6  bg-[#fff] '>
                <button className='block sm:hidden p-2'>
                    <GiHamburgerMenu className=' w-10 h-10' onClick={() => setMobile(!mobile)} />
                </button>
                <h2 >Assessment</h2>
            </article>

            <form className='flex gap-6 flex-wrap p-4 items-center' onSubmit={handleSubmit}>
                <select value={sub} onChange={(e) => setSub(e.target.value)} className='p-3  border focus:border-[#fca311] m-2 rounded-lg font-Concert shadow-md shadow-[#13213d] outline-none'>
                    {teacher.subjectcode.map((element) => (
                        <option value={element} key={element} className='flex flex-col lg:flex-row gap-1 lg:gap-6 p-2 border-[#fca311] m-2 rounded-md border-2 justify-start w-48'>
                            <span>{element}</span>
                        </option>
                    ))}
                </select>
                <input type="text" name="type" id="type" placeholder='Type' className='p-3  border focus:border-[#fca311] m-2 rounded-lg font-Concert shadow-md shadow-[#13213d] outline-none' value={type} onChange={(e) => setType(e.target.value)} />
                <button type="submit" className=' mx-4 border  bg-[#fca311] p-2 rounded-lg hover:scale-x-105 px-6 shadow-md shadow-[#13213d]'>Apply</button>
            </form>

            {apply && <button className='bg-[#fca311] rounded-full p-4 fixed right-0 bottom-0 m-6 shadow-md shadow-[#13213d]' onClick={() => setForm(!form)}><FaPlus /></button>}
            {
                form &&
                <article className='w-screen h-screen bg-transparent fixed left-0 top-0 flex justify-center items-center'>
                    <form className='flex flex-col bg-[#000] p-4 w-full lg:w-1/2  text-[#fca311] gap-2 rounded-xl animate-open-menu max-w-96  shadow-lg shadow-[#13213d]'>
                        <label htmlFor="Rollno">Rollno</label>
                        <input type="text" id="Rollno" value={stdRoll} onChange={(e) => setStdRoll(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />
                        <label htmlFor="total">Total Mark</label>
                        <input type="text" id="total" value={total} onChange={(e) => setTotal(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />
                        <label htmlFor="receive">Reveived Mark</label>
                        <input type="text" id="receive" value={receive} onChange={(e) => setReceive(e.target.value)} className='text-[#14213d] p-2 w-full outline-none rounded-md' required />
                        <span>

                            <button type='submit' className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md' onClick={handleAdd}>Submit</button>
                            <button onClick={() => setForm(false)} className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md'>Cancel</button>
                        </span>
                    </form>
                </article>
            }{
                updateForm &&
                <article className='w-screen h-screen bg-transparent fixed left-0 top-0 flex justify-center items-center'>
                    <form className='flex flex-col bg-[#000] p-4 w-full lg:w-1/2  text-[#fca311] gap-2 rounded-xl animate-open-menu max-w-96  shadow-lg shadow-[#13213d]' onSubmit={(e) => e.preventDefault()}>
                        <label htmlFor="Rollno">Rollno</label>
                        <input type="text" id="Rollno" value={stdRoll} onChange={(e) => setStdRoll(e.target.value)} className='text-[#14213d] p-1 w-full outline-none rounded-md' required />
                        <label htmlFor="total">Total Mark</label>
                        <input type="text" id="total" value={total} onChange={(e) => setTotal(e.target.value)} className='text-[#14213d] p-1 w-full outline-none rounded-md' required />
                        <label htmlFor="receive">Reveived Mark</label>
                        <input type="text" id="receive" value={receive} onChange={(e) => setReceive(e.target.value)} className='text-[#14213d] p-1 w-full outline-none rounded-md' required />
                        <span>

                            <button type='submit' className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md' onClick={handleUpdate} >Update</button>
                            <button onClick={handleUpdateCancel} className='bg-[#fca311] p-2 px-8 my-4 mr-10 text-[#14213d] outline-none rounded-md'>Cancel</button>
                        </span>
                    </form>
                </article>
            }
            {list &&
                <ul className='p-4 overflow-y-auto flex flex-col gap-4 grow '>
                    {(filterList.filter(list => list.subjects === sub)).map((list) =>
                    (<li key={list._id} className='w-full  shadow-sm  p-4 font-Concert rounded-xl  flex flex-col lg:flex-row justify-between  shadow-[#13213d] items-start lg:items-center  bg-[#fff] text-[#000] gap-2'>
                        <span className='w-28 items-center flex gap-2'><MdOutlineQuestionAnswer className='w-5 h-5' />{list.rollno}</span>
                        <span className='w-24'>{list.subjects}</span>
                        <span className='w-32'>{list.type}</span>
                        <span className='w-10' title='Total'>{list.marks[0]}</span>
                        <span className='w-10' title='Received'>{list.marks[1]}</span>
                        <button><FaEdit onClick={() => handleUpdateForm(list._id, list.rollno, list.marks[0], list.marks[1], list.type)} /></button>
                        <button onClick={() => handleDelete(list._id)} className='hover:text-[#fca311]'><FaTrash /></button>
                    </li>)
                    )}
                </ul>
            }
        </section>
    )
}

export default Assessment