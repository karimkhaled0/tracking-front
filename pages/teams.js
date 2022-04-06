import React, { Fragment, useRef, useEffect, useState } from 'react'
import Header from '../components/Header'
import { useRouter } from 'next/router'
import { DotsHorizontalIcon, ExclamationCircleIcon, XIcon } from '@heroicons/react/solid'
import { PlusIcon, ExclamationIcon, PlusCircleIcon } from '@heroicons/react/outline'
import { Dialog, Transition } from '@headlessui/react'


function Teams() {
    const [modal, setModal] = useState(false)
    const [open, setOpen] = useState(true)
    const [technicals, setTechnicals] = useState([])
    const [technicalsId, setTechnicalsId] = useState([])
    const [technicalsName, setTechnicalsName] = useState([])
    const [teamLeaderName, setTeamLeaderName] = useState([])
    const [teamLeaderId, setTeamLeaderId] = useState('')
    const [searchTech, setSearchTech] = useState('')
    const [searchTeamLeader, setSearchTeamLeader] = useState('')
    const [headerViewd, setHeaderViewd] = useState(true)
    const [categName, setCategName] = useState('')
    const [hi, setHi] = useState(false)
    const [prog, setProg] = useState(false)
    const [nameErrIcon, setNameErrIcon] = useState(false)
    const [nameErr, setNameErr] = useState('')


    const closeModal = () => {
        setModal(!modal)
    }
    const cancelButtonRef = useRef(null)
    const [categoryRes, setCategoryRes] = useState([])
    const [user, setUser] = useState(false)
    const router = useRouter()

    const loggedHandler = useEffect(async () => {
        const res = await fetch('http://localhost:8000/api/user/me', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            }
        }).then((r) => r.json())
        const error = res.error
        if (error == 'Not Authorized') {
            localStorage.removeItem('token')
            router.push({
                pathname: '/signin'
            })
        } else {
            setUser(true)

        }

    }, [])

    const getCategory = useEffect(async () => {
        const res = await fetch('http://localhost:8000/api/category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            },
        }).then((t) => t.json()).catch((e) => console.log(e))
        setCategoryRes(res.categories)
    }, [hi])    // hi is props for let category run again to fetch and add technicals

    const getTechnicals = useEffect(async () => {
        const res = await fetch('http://localhost:8000/api/user/technicals', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            }
        }).then((t) => t.json()).catch((e) => {
            router.push({
                pathname: '/signin'
            })
            localStorage.removeItem('token')
        })
        setTechnicals(res.data)
    }, [])

    // clear duplicate items in array
    // Technicals array
    var newArray = technicalsId.filter(function (elem, pos) {
        return technicalsId.indexOf(elem) == pos;
    });

    // Team Leader array
    var newArray2 = technicalsName.filter(function (elem, pos) {
        return technicalsName.indexOf(elem) == pos;
    });


    // Create Category with technicals and team leader
    var categId
    const createCategory = async () => {
        const res = await fetch(`http://localhost:8000/api/category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            },
            body: JSON.stringify({
                name: categName
            })

        }).then((t) => t.json())
        const error = res.errors
        if (error) {
            setNameErrIcon(true)
            setNameErr(error.name)
        } else {
            setHi(true) // props
            setProg(!prog)
            setTimeout(() => {
                window.location.reload()
            }, 2000);
        }
    }
    // Add technicals to the category created
    useEffect(() => {
        categoryRes.map((i) => {
            if (i.name == categName) {
                return categId = i._id
            }
        })
        newArray.map(async (i) => {
            const res = await fetch(`http://localhost:8000/api/user/${i}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.token}`
                },
                body: JSON.stringify({
                    category: categId
                })

            }).then((t) => t.json())
        })
    })


    return (
        <div>
            <Header islogged={user} />
            <main className='grid grid-cols-4 mx-[64px] my-[80px] gap-[80px] '>
                {/* Create Category */}
                <button onClick={closeModal} className='border rounded-md bg-white shadow-md p-5 space-y-8 cursor-pointer transform transition ease-out active:scale-90 duration-200'>
                    <div className='flex flex-col items-center space-y-8'>
                        <div className='border border-blue-500 rounded-full'>
                            <PlusIcon className='h-16 p-2 m-3 text-gray-500 text-center' />
                        </div>
                        <h1 className='text-xl text-gray-500'>Create team</h1>
                    </div>
                </button>
                {/* Fetch Categories */}
                {categoryRes.map((i) => {
                    return <div onClick={() => {
                        router.push({
                            pathname: `/teams/${i.name.replace('/', '')}`
                        })
                    }} className='border rounded-md bg-white shadow-lg p-5 space-y-8 cursor-pointer transform transition ease-out active:scale-90 duration-200'>
                        {/* Category name */}
                        <div className='flex justify-between items-center'>
                            <h1 className='text-2xl font-semibold text-blue-500'>{i.name.charAt(0).toUpperCase() + i.name.slice(1)}</h1>
                        </div>
                        {/* Details */}
                        <div className='space-y-3'>
                            <div className='flex justify-between items-center'>
                                <h1 className='text-lg font-normal'>Total Technicals</h1>
                                <h1 className='text-lg font-normal'>{i.technicals.length}</h1>
                            </div>
                            <div className='flex justify-between'>
                                <h1 className='text-lg font-normal'>Available now</h1>
                                <h1 className='text-lg font-normal'>5</h1>
                            </div>
                        </div>
                        {/* Tech's names */}
                        <div className='text-gray-500'>
                            {console.log(i.technicals.length)}
                            <h1 className='text-xl'>{
                                i.technicals.length > 3 ? (
                                    `${i.technicals[0].name.charAt(0).toUpperCase() + i.technicals[0].name.slice(1)}, 
                                    ${i.technicals[1].name.charAt(0).toUpperCase() + i.technicals[1].name.slice(1)}, 
                                    ${i.technicals[2].name.charAt(0).toUpperCase() + i.technicals[2].name.slice(1)}, 
                                    +${i.technicals.length - 3}`

                                ) : (
                                    i.technicals.map((ii) => {
                                        return `${ii.name.charAt(0).toUpperCase() + ii.name.slice(1)}, `
                                    })
                                )
                            }</h1>
                        </div>
                    </div>
                })}
            </main>
            {modal ? <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="fixed z-30 inset-0 overflow-y-auto" initialFocus={cancelButtonRef} onClose={setModal}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            {/* change width */}
                            <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                                {/* Change hieght */}
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-5">
                                    <div className="flex items-center">
                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                            <PlusCircleIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-gray-900">
                                                Create Team
                                            </Dialog.Title>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-3'>
                                        <div className="mt-5 space-y-3">
                                            <p className='text-lg font-semibold'>
                                                Name
                                            </p>

                                            <div className='rounded-md py-1 border-2 shadow-sm  w-[200px]'>
                                                <input
                                                    value={categName}
                                                    onChange={(e) => setCategName(e.target.value)}
                                                    className="bg-transparent mx-2 text-sm text-gray-600 placeholder-gray-400 outline-none"
                                                    type="text"
                                                    placeholder={"Type the name of team"}
                                                />
                                            </div>
                                            <div className='flex space-x-2 items-center'>
                                                <ExclamationCircleIcon className={nameErrIcon ? 'h-4 text-red-500' : 'hidden'} />
                                                <h1 className='text-s font-extralight text-red-500'>{nameErr}</h1>
                                            </div>
                                        </div>
                                        <div className="mt-5 space-y-3">
                                            <p className='text-lg font-semibold'>
                                                Technical
                                            </p>
                                            <div className='rounded-md py-1 border-2 shadow-sm  w-[200px] '>
                                                <input
                                                    className="bg-transparent  mx-2 text-sm text-gray-600 placeholder-gray-400 outline-none"
                                                    type="text"
                                                    placeholder={"Add technicals to team"}
                                                    onChange={(e) => setSearchTech(e.target.value)}
                                                />
                                                <div className='overflow-y-scroll flex flex-col space-y-1 h-40 scrollbar-hide'>
                                                    {technicals.filter((val) => {
                                                        if (val.name.toLowerCase().includes(searchTech.toLowerCase())) {
                                                            return val
                                                        }
                                                    }).map((i) => {

                                                        return <button className='mb-1 px-5 py-2 rounded-md button hover:scale-90 
                                                        text-blue-700' onClick={(e) => {
                                                                setTechnicalsId(oldArray => [...oldArray, i._id])
                                                                setTechnicalsName(oldArray => [...oldArray, i.name])
                                                            }}>{i.name}</button>
                                                    })
                                                    }
                                                </div>

                                            </div>
                                        </div>
                                        <div className="mt-5 space-y-3">
                                            <p className='text-lg font-semibold'>
                                                Team Leader
                                            </p>
                                            <div className='rounded-md py-1 border-2 shadow-sm  w-[200px] '>
                                                <input
                                                    className="bg-transparent  mx-2 text-sm text-gray-600 placeholder-gray-400 outline-none"
                                                    type="text"
                                                    placeholder={"Add Team leader to team"}
                                                    onChange={(e) => setSearchTeamLeader(e.target.value)}
                                                />
                                                <div className='overflow-y-scroll flex flex-col space-y-1 h-40 scrollbar-hide'>
                                                    {newArray2.filter((val) => {
                                                        if (val.toLowerCase().includes(searchTeamLeader.toLowerCase())) {
                                                            return val
                                                        }
                                                    }).map((i) => {
                                                        return <button className='mb-1 px-5 py-2 rounded-md button hover:scale-90 
                                                        text-blue-700' onClick={(e) => {
                                                                setTeamLeaderName(oldArray => [...oldArray, i])
                                                                technicals.map((ii) => {
                                                                    if (ii.name == i) {
                                                                        setTeamLeaderId(ii._id)
                                                                    }
                                                                })
                                                            }}>{i}</button>
                                                    })
                                                    }
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-5'>
                                        <h1 className='h1'>Technicals of the Team </h1>
                                        <div title='scroll down' className='border px-5 py-1 flex justify-between h-32 
                                        border-blue-200 overflow-y-scroll scrollbar-hide'>
                                            <div className=''>
                                                {technicals.map((i) => {
                                                    let names
                                                    newArray.map((ii) => {
                                                        if (i._id == ii) {
                                                            names = i.name
                                                        }
                                                    })
                                                    return <h1 className='text-gray-500'>{names}</h1>
                                                })}
                                            </div>
                                            <div>
                                                {newArray.map((i) => {
                                                    return <XIcon onClick={() => {
                                                        setTechnicalsId(newArray.filter(item => item !== i))
                                                    }} className='h-6 text-red-400 cursor-pointer' />
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-5'>
                                        <h1 className='h1'>Team Leader of the team</h1>
                                        <div className='border px-5 py-1 flex justify-between 
                                        border-blue-200 overflow-y-scroll scrollbar-hide'>
                                            <div className=''>
                                                <h1 className='text-gray-500'>{teamLeaderName}</h1>
                                            </div>
                                            <div>
                                                <XIcon onClick={() => {
                                                    setTeamLeaderName([])
                                                }} className='h-6 text-red-400 cursor-pointer' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    {
                                        prog ? (<button
                                            type="button"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            <h1 className='animate-spin'></h1>
                                            Loading...
                                        </button>) : (
                                            <button
                                                type="button"
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                onClick={createCategory}
                                            >
                                                Create
                                            </button>
                                        )
                                    }
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={closeModal}
                                        ref={cancelButtonRef}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root > : null
            }
        </div >
    )
}

export default Teams

// if (i.technicals.length > 3) {

    // 

