import { ChatAltIcon, LocationMarkerIcon, PencilAltIcon } from '@heroicons/react/outline'
import { PlusIcon, SearchIcon, PlusCircleIcon, XIcon, ExclamationCircleIcon, TrashIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import React, { Fragment, useRef, useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Dialog, Transition } from '@headlessui/react'
import Avatar from 'react-avatar';
import Error from 'next/error'


const teams = () => {
    const router = useRouter()
    const { pid } = router.query
    const [user, setUser] = useState(false)
    const [headerViewd, setHeaderViewd] = useState(false)
    const [userData, setUserData] = useState([])
    const [adminUserData, setAdminUserData] = useState([])
    const [categoryName, setCategoryName] = useState('')
    const [myProfile, setMyProfile] = useState(false)
    const [admin, setAdmin] = useState(false)
    const [teamLeader, setTeamLeader] = useState(false)
    const [technical, setTechnical] = useState(false)
    const [userCategoryName, setUserCategoryName] = useState('')

    // Modal
    const [modal, setModal] = useState(false)
    const [open, setOpen] = useState(true)
    const closeModal = () => {
        setModal(!modal)
    }
    const cancelButtonRef = useRef(null)
    const profile = useEffect(async () => {
        const res = await fetch('http://localhost:8000/api/user/me', {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${localStorage.token}`
            }
        }).then((r) => r.json()).catch((e) => console.log(e))
        const error = res.error
        if (error == 'Not Authorized') {
            localStorage.removeItem('token')
            router.push({
                pathname: '/signin'
            })
        } else {
            setUser(true)
        }
        setAdminUserData(res.data)
        if (res.data?.name == pid) {
            return setMyProfile(true)
        }
        if (res.data?.isAdmin) {
            setAdmin(true)
        }
        if (res.data?.isTeamLeader) {
            setTeamLeader(true)
        }
        if (!res.data?.isAdmin && !res.data?.isTeamLeader) {
            setTechnical(true)
        }

    }, [])
    // get technicals
    const [technicals, setTechnicals] = useState([])
    const getTechnicals = useEffect(async () => {
        const res = await fetch('http://localhost:8000/api/user/technicals', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            }
        }).then((t) => t.json())
        setTechnicals(res.data)
    }, [])

    // Get technical id
    const [userId, setUserId] = useState('')

    const getUserId = useEffect(async () => {
        technicals.map((i) => {
            if (i.name == pid) {
                return setUserId(i._id)
            }

        })
    }, [technicals])

    // Get user Data
    const getUserData = useEffect(() => {
        const userData = async () => {
            const res = await fetch(`http://localhost:8000/api/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${localStorage.token}`
                }

            }).then((t) => t.json())
            setUserData(res.data)
            if (res.data.category) {
                setCategoryName(res.data.category.name)
            }
            if (res.data?.isAdmin) {
                setAdmin(true)
            }
            if (res.data?.isTeamLeader) {
                setTeamLeader(true)
            }
            if (!res.data?.isAdmin && !res.data?.isTeamLeader) {
                setTechnical(true)
            }
        }
        userData()
    }, [userId, technicals, pid, headerViewd])


    // Edit User 
    const [edit, setEdit] = useState(false)
    const [editName, setEditName] = useState(userData.name)
    const [editIsTeamLeader, setEditIsTeamLeader] = useState(userData.isTeamLeader)
    const [editIsTechnical, setEditIsTechnical] = useState(false)
    const [editPhoneNumber, setEditPhoneNumber] = useState(userData.phonenumber)
    const [editAddress, setEditAddress] = useState(userData.address)
    const [prog, setProg] = useState(false)
    const editButtonHandler = () => {
        setEdit(!edit)
    }
    const editUserProfile = async () => {
        const res = await fetch(`http://localhost:8000/api/user/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            },
            body: JSON.stringify({
                name: editName,
                isTeamLeader: editIsTeamLeader,
                phonenumber: editPhoneNumber,
                address: editAddress
            })
        }).then((t) => t.json()).catch((e) => console.log(e))
        const error = res.errors
        if (!error) {
            setProg(!prog)
            setTimeout(() => {
                router.push({
                    pathname: `/technicals`
                })
            }, 2000);
        }
    }

    const deleteUser = async () => {
        const res = await fetch(`http://localhost:8000/api/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.token}`
            },
        }).then((t) => t.json()).catch((e) => console.log(e))
        if (res.message == 'deleted') {
            router.push({
                pathname: '/technicals'
            })
        }
    }
    console.log(myProfile)
    return (
        <div className='relative'>
            <Header
                headerView={!headerViewd}
                islogged={user}
                techProfile={false}
                techTeam={false}
            />
            {myProfile ? (
                <section className='mx-auto px-8 max-w-7xl my-10'>
                    <div className='grid grid-cols-3'>
                        <div className='flex flex-col items-center border-r-2 h-[450px] mt-10'>
                            <div >
                                <Avatar className='rounded-full' name={adminUserData.name} size='100' />
                            </div>
                            <h1 className='text-xl font-semibold text-blue-600 mt-5'>{adminUserData.name}</h1>
                            {
                                admin ? (
                                    <h1 className='text-blue-500'>Admin</h1>
                                ) : null
                            }
                            {
                                teamLeader ? (
                                    <h1 className='text-blue-500'>Team leader</h1>
                                ) : null
                            }
                            {
                                technical ? (
                                    <h1 className='text-blue-500'>Technical</h1>
                                ) : null
                            }
                        </div>
                        <div className='col-span-2 ml-[100px] space-y-5'>
                            <h1 className='text-2xl font-semibold text-gray-600'>Details</h1>
                            <div>
                                <h1 className='text-xl text-gray-500 '>Full name</h1>
                                <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{adminUserData.name}</h1>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-xl text-gray-500 '>LoginId</h1>
                                <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{adminUserData.loginId}</h1>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-xl text-gray-500 '>Phone Number</h1>
                                <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{adminUserData.phonenumber}</h1>
                                </div>
                            </div>
                            <div>
                                <h1 className='text-xl text-gray-500 '>Address</h1>
                                <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{adminUserData.address}</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <section className='mx-auto px-8 max-w-7xl my-10'>
                    {/* Handle if User is technical or not */}
                    {
                        !adminUserData.isAdmin && !adminUserData.isTeamLeader ? (
                            <div className='grid grid-cols-3'>
                                <div className='flex flex-col items-center border-r-2 h-[450px] mt-10'>
                                    <div >
                                        <Avatar className='rounded-full' size='100' />
                                    </div>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-5'></h1>
                                    <h1 className='text-gray-500 mt-2'></h1>
                                    <h1 className='text-blue-500  mt-2'></h1>
                                    <div className='flex space-x-5 mt-20 ml-7'>
                                        <div className='border-r-2 pr-5 space-y-5 items-center flex flex-col'>
                                            <h1 className='text-gray-500'></h1>
                                            <h1 className='text-blue-500'></h1>
                                        </div>
                                        <div className='pr-5 space-y-5 items-center flex flex-col'>
                                            <h1 className='text-gray-500'></h1>
                                            <h1 className='text-blue-500'></h1>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-span-2 ml-[100px] space-y-5'>
                                    <div className='flex justify-between'>
                                        <h1 className='text-2xl font-semibold text-gray-600'>Details</h1>
                                    </div>
                                    <div>
                                        <h1 className='text-xl text-gray-500 '>Full name</h1>
                                        <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                            <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'></h1>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className='text-xl text-gray-500 '>LoginId</h1>
                                        <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                            <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'></h1>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className='text-xl text-gray-500 '>Phone Number</h1>
                                        <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                            <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'></h1>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className='text-xl text-gray-500 '>Team</h1>
                                        <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                            <h1 className='text-lg font-semibold text-gray-600 mt-2 py-2 px-4'></h1>

                                        </div>
                                    </div>
                                    <div>
                                        <h1 className='text-xl text-gray-500 '>Address</h1>
                                        <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                            <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'></h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='grid grid-cols-3'>
                                <div className='flex flex-col items-center border-r-2 h-[450px] mt-10'>
                                    <div >
                                        <Avatar className='rounded-full' name={userData.name} size='100' />
                                    </div>
                                    <h1 className='text-xl font-semibold text-blue-600 mt-5'>{userData.name}</h1>
                                    <h1 className='text-gray-500 mt-2'>{categoryName == '' ? 'Not in a team' : categoryName}</h1>
                                    <h1 className='text-blue-500  mt-2'>{userData.isTeamLeader ? 'Team leader' : 'Technical'}</h1>
                                    <div className='flex space-x-5 mt-20 ml-7'>
                                        <div className='border-r-2 pr-5 space-y-5 items-center flex flex-col'>
                                            <h1 className='text-gray-500'>Tasks</h1>
                                            <h1 className='text-blue-500'>30</h1>
                                        </div>
                                        <div className='pr-5 space-y-5 items-center flex flex-col'>
                                            <h1 className='text-gray-500'>Completed</h1>
                                            <h1 className='text-blue-500'>30</h1>
                                        </div>
                                    </div>
                                    {
                                        adminUserData.isAdmin || adminUserData.isTeamLeader ? (
                                            <div className='mt-10'>
                                                {edit && (
                                                    <div className='space-y-5 text-center'>
                                                        <h1 className='text-xl text-gray-500 '>Change Title</h1>
                                                        <div className='flex space-x-5'>
                                                            <button onClick={() => {
                                                                setEditIsTeamLeader(true)
                                                                setEditIsTechnical(false)
                                                            }} className={editIsTeamLeader ? 'px-5 py-2 border rounded-xl text-white bg-blue-500 button' : 'px-5 py-2 border rounded-xl  button text-blue-700'}>Team leader</button>
                                                            <button onClick={() => {
                                                                setEditIsTeamLeader(false)
                                                                setEditIsTechnical(true)
                                                            }} className={editIsTechnical ? 'px-5 py-2 border rounded-xl text-white bg-blue-500 button' : 'px-5 py-2 border rounded-xl  button text-blue-700'}>Technical</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null
                                    }
                                    {
                                        adminUserData.isTeamLeader && userData.isTeamLeader ? null : (
                                            <div className='my-5 text-right'>
                                                <button className='px-5 py-2 border rounded-md text-sm button text-white bg-red-500' onClick={closeModal}>Delete user</button>
                                            </div>
                                        )
                                    }
                                </div>
                                <div className='col-span-2 ml-[100px] space-y-5'>
                                    <div className='flex justify-between'>
                                        <h1 className='text-2xl font-semibold text-gray-600'>Details</h1>
                                        {
                                            adminUserData.isTeamLeader && userData.isTeamLeader ? null : (
                                                <div className='flex space-x-2 items-center'>
                                                    <PencilAltIcon className='h-5 text-gray-500 font-semibold cursor-pointer' onClick={editButtonHandler} />
                                                    <h1 className='text-xl text-gray-500 cursor-pointer' onClick={editButtonHandler}>Edit user</h1>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div>
                                        <h1 className='text-xl text-gray-500 '>Full name</h1>
                                        <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                            {
                                                // Woriking on edit user Data, change the input style
                                                edit ? (
                                                    <input className='text-xl font-semibold text-blue-600 mt-2 py-1 px-4 outline-none w-full' autoComplete="chrome-off" value={editName} type="text" onChange={(e) => {
                                                        setEditName(e.target.value)
                                                    }} />
                                                ) : (
                                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{userData.name}</h1>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className='text-xl text-gray-500 '>LoginId</h1>
                                        <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                            {
                                                // Woriking on edit user Data, change the input style
                                                edit ? (
                                                    <div className='flex items-center justify-between'>
                                                        <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{userData.loginId}</h1>
                                                        <h1 className='text-xl font-semibold text-red-600 mt-2 py-2 px-4'>Unchangeable</h1>
                                                    </div>
                                                ) : (
                                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{userData.loginId}</h1>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className='text-xl text-gray-500 '>Phone Number</h1>
                                        <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                            {
                                                // Woriking on edit user Data, change the input style
                                                edit ? (
                                                    <input className='text-xl font-semibold text-blue-600 mt-2 py-1 px-4 outline-none w-full' autoComplete="chrome-off" value={editPhoneNumber} type="text" onChange={(e) => {
                                                        setEditPhoneNumber(e.target.value)
                                                    }} />
                                                ) : (
                                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{userData.phonenumber}</h1>
                                                )
                                            }                                </div>
                                    </div>
                                    <div>
                                        <h1 className='text-xl text-gray-500 '>Team</h1>
                                        <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                            {
                                                // Woriking on edit user Data, change the input style
                                                edit ? (
                                                    <div className='flex items-center justify-between'>
                                                        <h1 className={categoryName == '' ? 'text-lg font-semibold text-gray-600 mt-2 py-2 px-4' : 'text-xl font-semibold text-blue-600 mt-2 py-2 px-4'}>{categoryName == '' ? 'Not in a team' : categoryName}</h1>
                                                        <h1 className='text-xl font-semibold text-red-600 mt-2 py-2 px-4'>Change from Team section</h1>
                                                    </div>
                                                ) : (
                                                    <h1 className={categoryName == '' ? 'text-lg font-semibold text-gray-600 mt-2 py-2 px-4' : 'text-xl font-semibold text-blue-600 mt-2 py-2 px-4'}>{categoryName == '' ? 'Not in a team' : categoryName}</h1>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className='text-xl text-gray-500 '>Address</h1>
                                        <div className='bg-gray-50 h-12 rounded-lg shadow-md'>
                                            {
                                                // Woriking on edit user Data, change the input style
                                                edit ? (
                                                    <input className='text-xl font-semibold text-blue-600 mt-2 py-1 px-4 outline-none w-full' autoComplete="chrome-off" value={editAddress} type="text" onChange={(e) => {
                                                        setEditAddress(e.target.value)
                                                    }} />
                                                ) : (
                                                    <h1 className='text-xl font-semibold text-blue-600 mt-2 py-2 px-4'>{userData.address}</h1>
                                                )
                                            }
                                        </div>
                                    </div>

                                    {
                                        edit ? (
                                            <div className='flex justify-end'>
                                                < button className='border shadow-md active:scale-95 transition transform ease-out
                                        text-white py-2 px-5 bg-red-500 rounded-lg cursor-pointer hover:opacity-80 mr-5' onClick={editButtonHandler}>Cancel</button>
                                                {
                                                    prog ? (
                                                        <button
                                                            type="button"
                                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                        >
                                                            <h1 className='animate-spin'></h1>
                                                            Loading...
                                                        </button>
                                                    ) : (
                                                        <button className='border shadow-md active:scale-95 transition transform ease-out 
                                                        text-white py-2 px-5 bg-blue-500 rounded-lg cursor-pointer hover:opacity-80 mr-5' onClick={editUserProfile}>Update</button>
                                                    )
                                                }
                                            </div>
                                        ) : null
                                    }

                                </div>
                            </div>
                        )
                    }
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
                                    <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                            <div className="sm:flex sm:items-start">
                                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    <ExclamationCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                                </div>
                                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                        Delete The user
                                                    </Dialog.Title>
                                                    <div className="mt-2">
                                                        <p className="text-sm text-red-500">
                                                            Are you sure you want to delete this user ?
                                                            This action cannot be undone.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="button"
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                onClick={deleteUser}
                                            >
                                                Delete
                                            </button>
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
                    </Transition.Root> : null}
                </section>
            )
            }

        </div >
    )
}

export default teams
