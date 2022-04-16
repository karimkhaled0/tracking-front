import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useRouter } from 'next/router'

function NotAuthorized() {
    const router = useRouter()
    const [noTeam, setNoTeam] = useState('')
    const goBackToTeam = async () => {
        // if user not in team throw error (ll)
        const userRes = await fetch('http://localhost:8000/api/user/me', {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${localStorage.token}`
            }
        }).then((r) => r.json()).catch((e) => console.log(e))
        const categRes = await fetch(`http://localhost:8000/api/category/${userRes.data.category}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${localStorage.token}`
            }
        }).then((r) => r.json()).catch((e) => console.log(e))

        if (userRes.data.category) {
            router.push({
                pathname: `/teams/${categRes.category.name}`
            })
        } else {
            setNoTeam('You are not in team, Ask your team leader')
        }
    }

    const signoutHandler = () => {
        localStorage.removeItem('token')
        router.push({
            pathname: '/signin'
        })
    }

    // fetch user data
    const profileHandler = async () => {
        const res = await fetch('http://localhost:8000/api/user/me', {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${localStorage.token}`
            }
        }).then((r) => r.json()).catch((e) => console.log(e))
        router.push({
            pathname: `/profile/${res.data.name.replace('/', '')}`
        })
    }
    return (
        <div>
            <div className="w-screen h-screen flex flex-wrap justify-center content-center items-center absolute z-0">
                <h2 className="uppercase text-xl lg:text-7xl font-black mb-96">Erorr 404</h2>
            </div>
            <div className="h-screen w-screen flex flex-wrap justify-center content-end md:content-center items-end md:items-center relative z-10">
                <div className="p-6 text-center space-x-10">
                    <h2 className="uppercase text-xl lg:text-5xl font-black">We're sorry, but your not authorized to access this page.</h2>
                    <button className='bg-gradient-to-r from-red-400 to-yellow-500 px-7 py-4 border rounded-full button text-xl font-black mt-16' onClick={goBackToTeam}>My team</button>
                    <button className='bg-gradient-to-r from-red-400 to-yellow-500 px-7 py-4 border rounded-full button text-xl font-black mt-16' onClick={profileHandler}>My profile</button>
                    <button className='bg-gradient-to-r from-red-400 to-yellow-500 px-7 py-4 border rounded-full button text-xl font-black mt-16' onClick={signoutHandler}>Log out</button>

                </div>
                <h2 class="uppercase text-xl lg:text-xl font-black text-red-800">{noTeam}</h2>
            </div>
        </div>
    )
}

export default NotAuthorized