import React, { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import {
    LocationMarkerIcon,
    ChatAltIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/react/solid'
import { useRouter } from 'next/router';
import { format, set } from 'date-fns'

function CreateTask() {
    const router = useRouter()
    // TaskDetails errors handler
    const [descriptionErr, setDescriptionErr] = useState("")
    const [phoneErr, setPhoneErr] = useState("")
    const [customerErr, setCustomerErr] = useState("")
    const [streetErr, setStreetErr] = useState("")
    const [categoryErr, setCategoryErr] = useState("")
    const [startDateErr, setStartDateErr] = useState("")
    const [endDateErr, setEndDateErr] = useState("")
    const [descriptionIconErr, setDescriptionIconErr] = useState(false)
    const [phoneIconErr, setPhoneIconErr] = useState(false)
    const [customerIconErr, setCustomerIconErr] = useState(false)
    const [streetIconErr, setStreetIconErr] = useState(false)
    const [categoryIconErr, setCategoryIconErr] = useState(false)
    const [startDateIconErr, setStartDateIconErr] = useState(false)
    const [endDateIconErr, setEndDateIconErr] = useState(false)
    const [categoryRes, setCategoryRes] = useState([])
    const [assignedRes, setAssignedRes] = useState([])
    const [nameOfCateg, setNameOfCateg] = useState([])

    // Modal handle states
    const [modal, setModal] = useState(true)
    const [next, setNext] = useState(false)
    const [back1, setBack1] = useState(false)
    const [back2, setBack2] = useState(false)
    const [procced, setProcced] = useState(false)
    const [show, setShow] = useState(true)
    // Task details Content handle states
    const [description, setDescription] = useState("")
    const [phone, setPhone] = useState("")
    const [customer, setCustomer] = useState("")
    const [street, setStreet] = useState("")
    const [apartment, setApartment] = useState("")
    const [floor, setFloor] = useState("")
    const [building, setBuilding] = useState("")

    let address = `${street} , ${apartment} / ${floor} / ${building}`

    // Management Content handle states
    const [categName, setCategName] = useState("")
    const [assignName, setAssignName] = useState('')
    const [assigned, setAssigned] = useState('')
    const [categ, setCateg] = useState("6234844d79c325a1d9160002")
    const [assign, setAssign] = useState("")
    const [sClock, setSClock] = useState("")
    const [eClock, setEClock] = useState("")
    // Date handler
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    let duration = '1d'

    // Modal Buttons handler

    const closeModal = () => {
        setModal(!modal)
    }
    // Creating task
    const createTask = async (e) => {
        e.preventDefault()
        setDescriptionErr('')
        setCustomerErr('')
        setPhoneErr('')
        setStreetErr('')
        setCategoryErr('')
        setStartDateErr('')
        setEndDateErr('')
        setEndDateIconErr(false)
        setStartDateIconErr(false)
        setCategoryIconErr(false)
        setStreetIconErr(false)
        setPhoneIconErr(false)
        setCustomerIconErr(false)
        setDescriptionIconErr(false)

        const res = await fetch('http://localhost:8000/api/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            },
            body: JSON.stringify({
                description: description,
                customerPhonenumber: phone,
                customerName: customer,
                location: address,
                startDate: format(startDate, 'yyyy-MM-dd'),
                endDate: format(endDate, 'yyyy-MM-dd'),
                category: categ,
                duration: duration,
                techId: assign
            })

        }).then((r) => r.json())
        const error = res.errors
        console.log(error)
        if (!error) {
            router.push({
                pathname: '/'
            })
            return
        } else {
            if ((error.description || error.customerName || error.phonenumber) && (error.category || error.endDate)) {
                backModal1()
            }
            if ((error.category || error.endDate) && (!error.description || !error.customerName || !error.phonenumber)) {
                backModal2()
            }
            if ((error.description || error.customerName || error.phonenumber) && !(error.category || error.endDate)) {
                backModal1()
            }
            if (error.description) {
                setDescriptionErr(error.description)
                setDescriptionIconErr(true)

            }
            if (error.customerName) {
                setCustomerErr(error.customerName)
                setCustomerIconErr(true)

            }
            if (error.phonenumber) {
                setPhoneErr(error.phonenumber)
                setPhoneIconErr(true)

            }
            if (error.location) {
                setStreetErr(error.location)
                setStreetIconErr(true)

            }
            if (error.category) {
                setCategoryErr(error.category)
                setCategoryIconErr(true)

            }
            if (error.startDate) {
                setStartDateErr(error.startDate)
                setStartDateIconErr(true)

            }
            if (error.endDate) {
                setEndDateErr(error.endDate)
                setEndDateIconErr(true)

            }
        }
    }
    // Categoty id
    // let categoryId = categoryRes.map((item) => item._id)
    // console.log(categoryId)
    // Get category
    useEffect(async () => {
        const res = await fetch('http://localhost:8000/api/category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            },
        }).then((t) => t.json()).catch((e) => console.log(e))
        setCategoryRes(res.categories)
    }, [])

    // Get Technicals
    useEffect(async () => {
        const res = await fetch('http://localhost:8000/api/user/technicals', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            },
        }).then((t) => t.json()).catch((e) => console.log(e))
        setAssignedRes(res.data)
    }, [])

    // Get category and tech by id
    useEffect(() => {
        categoryRes.map((i) => {
            if (categ == i._id) {
                setCategName(i.name)
            }
            return
        })
    }, [])
    useEffect(() => {
        assignedRes.map((i) => {
            if (assign == i._id) {
                setAssigned(i.name)
            }
            return
        })
    })

    const toggleNext = () => {
        setNext(true)
        setShow(false)
    }

    const proccedModal = () => {
        setProcced(!procced)
        setShow(false)
        setNext(false)
    }

    const backModal1 = () => {
        setBack1(!back1)
        setShow(!show)
        setNext(false)
        setProcced(false)
    }

    const backModal2 = () => {
        setBack2(!back2)
        setProcced(!procced)
        setNext(!next)
    }


    useEffect(async () => {
        const res = await fetch(`http://localhost:8000/api/category/users/${categ}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            },
        }).then((t) => t.json()).catch((e) => console.log(e))
        setAssignName(res.technicals)
    }, [categ])


    return (
        <div>
            <button className='button px-5 py-2 border rounded-lg bg-blue-500 text-white' onClick={closeModal}>Create Task</button>
            <div className={modal ? "fixed z-10 overflow-y-auto top-0 w-full left-0 hidden" : "fixed z-10 overflow-y-auto top-0 w-full left-0"}>
                <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity">
                        <div className="absolute inset-0 bg-gray-900 opacity-75" />
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                    <div className="inline-block align-center bg-gray-50 rounded-lg text-left shadow-xl transform 
                     transition-all w-full h-screen sm:align-middle mt-16 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <h1 className='h1 text-3xl my-2 mt-5 mx-5'>Create a new task</h1>
                        <div className='grid grid-cols-2'>
                            {/* Form */}

                            {/* Task Details */}
                            {show ? (
                                <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className='flex space-x-3 items-center mb-5'>
                                        <div className='flex space-x-3'>
                                            <h1 className=' border rounded-full border-blue-900 px-2'>1</h1>
                                            <h1 className='text-xl text-blue-500'>Task details</h1>
                                        </div>
                                        <div className='border-b w-28 pt-2 border-gray-700' />
                                        <div className='flex space-x-3'>
                                            <h1 className='border rounded-full border-blue-900 px-2'>2</h1>
                                            <h1 className='text-xl text-gray-500'>Mangement</h1>
                                        </div>
                                        <div className='border-b w-28 pt-2 border-gray-700' />
                                        <div className='flex space-x-3'>
                                            <h1 className='border rounded-full border-blue-900 px-2'>3</h1>
                                            <h1 className='text-xl text-gray-500'>Review</h1>
                                        </div>
                                    </div>
                                    <form action="">
                                        <div className='flex space-x-5'>
                                            <label className='h1'>Desctiption</label>
                                            <div className='flex space-x-2 items-center'>
                                                <ExclamationCircleIcon className={descriptionIconErr ? 'h-4 text-red-500' : 'hidden'} />
                                                <h1 className='text-s font-extralight text-red-500'>{descriptionErr}</h1>
                                            </div>
                                        </div>
                                        <textarea type="text" value={description} onChange={(e) => { setDescription(e.target.value) }} title="Scroll down" className="w-full shadow-md bg-white p-2 scrollbar-hide mt-2 mb-3 text-lg rounded-lg pl-3" rows="3" cols="50"></textarea>

                                        <div className="flex">
                                            <div className='flex flex-col flex-grow align-middle'>
                                                <label className='h1 text-xl pb-3'>Phone number</label>
                                                <input className='pb-4 text-lg bg-white rounded-lg pl-3 shadow-md' value={phone} type="text" onChange={(e) => { setPhone(e.target.value) }} />
                                                <div className='flex space-x-2 items-center'>
                                                    <ExclamationCircleIcon className={phoneIconErr ? 'h-4 text-red-500' : 'hidden'} />
                                                    <h1 className='text-s font-extralight text-red-500'>{phoneErr}</h1>
                                                </div>
                                            </div>
                                            <div className='flex flex-col flex-grow ml-10 '>
                                                <label className='h1 text-xl pb-3'>Customer</label>
                                                <input className='pb-4 text-lg bg-white rounded-lg pl-3 shadow-md' type="text" value={customer} onChange={(e) => { setCustomer(e.target.value) }} />
                                                <div className='flex space-x-2 items-center'>
                                                    <ExclamationCircleIcon className={customerIconErr ? 'h-4 text-red-500' : 'hidden'} />
                                                    <h1 className='text-s font-extralight text-red-500'>{customerErr}</h1>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex flex-col mt-5'>
                                            <div className='flex space-x-4 items-center'>

                                                <label className='h1 text-xl pb-2'>Street no. / name</label>
                                                <div className='flex space-x-2 items-center'>
                                                    <ExclamationCircleIcon className={streetIconErr ? 'h-4 text-red-500' : 'hidden'} />
                                                    <h1 className='text-s font-extralight text-red-500'>{streetErr}</h1>
                                                </div>
                                            </div>
                                            <input className='pb-4 text-lg bg-white rounded-lg pl-3 shadow-md' type="text" value={street} onChange={(e) => { setStreet(e.target.value) }} />
                                        </div>
                                        <div className='flex space-x-5 mt-5'>
                                            <div>
                                                <label className='h1 text-xl pb-3'>Apartment</label>
                                                <input className='pb-4 text-lg bg-white rounded-lg pl-3 mt-3 shadow-md' type="text" value={apartment} onChange={(e) => { setApartment(e.target.value) }} />
                                            </div>
                                            <div>
                                                <label className='h1 text-xl pb-3'>Floor</label>
                                                <input className='pb-4 text-lg bg-white rounded-lg pl-3 mt-3 shadow-md' type="text" value={floor} onChange={(e) => { setFloor(e.target.value) }} />
                                            </div>
                                            <div>
                                                <label className='h1 text-xl pb-3'>Buildind no.</label>
                                                <input className='pb-4 text-lg bg-white rounded-lg pl-3 mt-3 shadow-md' type="text" value={building} onChange={(e) => { setBuilding(e.target.value) }} />
                                            </div>
                                        </div>
                                    </form>
                                    <div className="py-3 text-right flex space-x-5">
                                        <button className="py-2 px-4 bg-red-500 text-white 
                                    rounded hover:bg-gray-700 mr-2" onClick={closeModal}> Cancel</button>
                                        <button className="py-2 px-4 bg-blue-500 text-white 
                                    rounded hover:bg-blue-700 mr-2" onClick={toggleNext}> Next</button>
                                    </div>

                                </div>) : null}

                            {/* Management */}
                            {next ? (
                                <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className='flex space-x-3 items-center mb-5'>
                                        <div className='flex space-x-3'>
                                            <CheckCircleIcon className='h-7 text-blue-600' />
                                            <h1 className='text-xl text-blue-700 cursor-pointer' onClick={backModal1}>Task details</h1>
                                        </div>
                                        <div className='border-b w-28 pt-2 border-gray-700' />
                                        <div className='flex space-x-3'>
                                            <h1 className=' border rounded-full border-blue-900 px-2'>2</h1>
                                            <h1 className='text-xl text-blue-500'>Mangement</h1>
                                        </div>
                                        <div className='border-b w-28 pt-2 border-gray-700' />
                                        <div className='flex space-x-3'>
                                            <h1 className=' border rounded-full border-blue-900 px-2'>3</h1>
                                            <h1 className='text-xl text-gray-500'>Review</h1>
                                        </div>
                                    </div>
                                    <form action="">
                                        <div className='flex flex-col'>
                                            <div className='flex space-x-2 items-center'>
                                                <label className='h1 pb-3'>Categories</label>
                                                <ExclamationCircleIcon className={categoryIconErr ? 'h-4 text-red-500' : 'hidden'} />
                                                <h1 className='text-s font-extralight text-red-500'>{categoryErr}</h1>
                                            </div>
                                            <select name="" id="" className='pb-5 rounded-lg text-lg mb-5 shadow-md' onChange={(e) => setCateg(e.target.value)} value={categ}>
                                                <option value="" selected disabled hidden>Choose here</option>
                                                {
                                                    categoryRes.map((item) => {
                                                        return <option value={item._id}>{item.name}</option>
                                                    })
                                                }


                                            </select>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className='h1 pb-3'>Assigned to</label>
                                            <select name="" id="" className='pb-5 rounded-lg text-lg mb-5 shadow-md' onChange={(e) => { setAssign(e.target.value) }} value={assign}>
                                                <option value="" selected disabled hidden>Choose here</option>
                                                {

                                                    assignName.map((i) => {
                                                        return <option value={i._id}>{i.name}</option>
                                                    })

                                                }
                                            </select>
                                        </div>
                                        <div className="flex">
                                            <div className='flex flex-col flex-grow'>
                                                <label className='h1 text-xl pb-3'>Start Date</label>
                                                <DatePicker dateFormat='yyyy-MM-dd' className="pb-3 text-lg bg-white rounded-lg pl-3 shadow-md" value={startDate} selected={startDate}
                                                    onChange={(date = Date) => setStartDate(date)} />
                                                <div className='flex space-x-2 items-center'>
                                                    <ExclamationCircleIcon className={startDateIconErr ? 'h-4 text-red-500' : 'hidden'} />
                                                    <h1 className='text-s font-extralight text-red-500'>{startDateErr}</h1>
                                                </div>
                                            </div>
                                            <div className='flex flex-col flex-grow'>
                                                <label className='h1 text-xl pb-3'>End Date</label>
                                                <DatePicker dateFormat='yyyy-MM-dd' className="pb-3 text-lg bg-white rounded-lg pl-3 shadow-md" value={endDate} selected={endDate}
                                                    onChange={(date = Date) => setEndDate(date)} />
                                                <div className='flex space-x-2 items-center'>
                                                    <ExclamationCircleIcon className={endDateIconErr ? 'h-4 text-red-500' : 'hidden'} />
                                                    <h1 className='text-s font-extralight text-red-500'>{endDateErr}</h1>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='hidden my-5 mt-5 space-x-44 mb-10'>
                                            <div className='flex flex-col'>
                                                <label className='h1 text-xl pb-3'>From</label>
                                                <input type="time" min="09:00" max="18:00" required className='shadow-md pb-2 text-xl bg-white rounded-lg px-8 mt-3 text-center' onChange={(e) => { setSClock(e.target.value) }} value={sClock} />
                                            </div>
                                            <div className='flex flex-col'>
                                                <label className='h1 text-xl pb-3'>To</label>
                                                <input type="time" min="09:00" max="18:00" required className='shadow-md pb-2 text-xl bg-white rounded-lg px-8 mt-3 text-center' onChange={(e) => { setEClock(e.target.value) }} value={eClock} />
                                            </div>
                                        </div>
                                    </form>
                                    <div className="py-3 text-right flex space-x-5 mt-40">
                                        <button className="py-2 px-4 bg-red-500 text-white 
                                    rounded hover:bg-gray-700 mr-2" onClick={backModal1}> Back</button>
                                        <button className="py-2 px-4 bg-blue-500 text-white 
                                    rounded hover:bg-blue-700 mr-2" onClick={proccedModal}> Procced</button>
                                    </div>

                                </div>) : null}

                            {/* Review and push the task */}
                            {procced ? (
                                <form method='POST'>
                                    <div className="bg-gray-50 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <div className='flex space-x-3 items-center mb-5'>
                                            <div className='flex space-x-3'>
                                                <CheckCircleIcon className='h-7 text-blue-600' />
                                                <h1 className='text-xl text-blue-700 cursor-pointer' onClick={backModal1}>Task details</h1>
                                            </div>
                                            <div className='border-b w-28 pt-2 border-gray-700' />
                                            <div className='flex space-x-3'>
                                                <CheckCircleIcon className='h-7 text-blue-600' />
                                                <h1 className='text-xl text-blue-500 cursor-pointer' onClick={backModal2}>Mangement</h1>
                                            </div>
                                            <div className='border-b w-28 pt-2 border-gray-700' />
                                            <div className='flex space-x-3'>
                                                <h1 className=' border rounded-full border-blue-900 px-2'>3</h1>
                                                <h1 className='text-xl text-blue-500'>Review</h1>
                                            </div>
                                        </div>
                                        <form action="">
                                            <div className='flex items-center space-x-2'>
                                                <h1 className='h1'>Step 1</h1>
                                                <h3 className='h3 text-gray-500' onClick={backModal1}>(Edit)</h3>
                                            </div>
                                            <div className='flex'>
                                                <div className='flex flex-col flex-grow'>
                                                    <h1 className='text-gray-700 text-lg mt-5'>Phone Number</h1>
                                                    <h2 className='font-semibold mt-2'>{phone}</h2>
                                                </div>
                                                <div className='flex flex-col flex-grow'>
                                                    <h1 className='text-gray-700 text-lg mt-5'>Customer name</h1>
                                                    <h2 className='font-semibold mt-2'>{customer}</h2>
                                                </div>
                                            </div>
                                            <h1 className='text-gray-700 text-lg mt-5'>Description</h1>
                                            <div className='flex mt-2 overflow-y-auto w-full h-28 scrollbar-hide' title="Scroll down">
                                                {description}
                                            </div>
                                            <div className='flex items-center space-x-2'>
                                                <h1 className='h1'>Step 2</h1>
                                                <h3 className='h3 text-gray-500' onClick={backModal2}>(Edit)</h3>
                                            </div>
                                            <div className='flex'>
                                                <div className='flex flex-col flex-grow'>
                                                    <h1 className='text-gray-700 text-lg mt-5'>Deadline</h1>
                                                    <h2 className='font-semibold mt-2'>{endDate.toString().slice(4, 15)}</h2>
                                                </div>
                                                <div className='flex flex-col flex-grow'>
                                                    <h1 className='text-gray-700 text-lg mt-5'>category</h1>
                                                    <h2 className='font-semibold mt-2'>{categName}</h2>
                                                </div>
                                            </div>
                                            <div className='flex flex-col flex-grow mb-2'>
                                                <h1 className='text-gray-700 text-lg mt-5'>Assigned to</h1>
                                                <h2 className='font-semibold mt-2'>{assigned}</h2>
                                            </div>
                                        </form>
                                        <div className="py-3 text-right flex space-x-5">
                                            <button className="py-2 px-4 bg-red-500 text-white 
                                rounded hover:bg-gray-700 mr-2 " onClick={backModal2}> Back</button>
                                            <button className="py-2 px-4 bg-blue-500 text-white 
                                rounded hover:bg-blue-700 mr-2" onClick={createTask}> Create</button>
                                        </div>

                                    </div>
                                </form>
                            ) : null}

                            {back1 ? (!show) : null}

                            {back2 ? (!next) : null}



                            {/* col-2 map */}
                            <div>
                                <img src="/GoogleMapTA.jpg" alt="" className='w-5/6' />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default CreateTask