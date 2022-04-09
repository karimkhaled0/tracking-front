import React, { useEffect } from 'react'
import Header from '../components/Header'
import { useRouter } from 'next/router'

function NotAuthorized() {
    const router = useRouter()

    const goBackToTeam = async () => {
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

        router.push({
            pathname: `/teams/${categRes.category.name}`
        })
    }

    const signoutHandler = () => {
        localStorage.removeItem('token')
        router.push({
            pathname: '/signin'
        })
    }

    return (
        <div>
            <div class="w-screen h-screen flex flex-wrap justify-center content-center items-center absolute z-0 bg-gradient-to-r from-red-400 to-yellow-500">
                <h2 class="uppercase text-xl lg:text-7xl font-black mb-96">Erorr 404</h2>
            </div>
            <div class="h-screen w-screen flex flex-wrap justify-center content-end md:content-center items-end md:items-center relative z-10">
                <div class="p-6 text-center space-x-10">
                    <h2 class="uppercase text-xl lg:text-5xl font-black">We're sorry, but your not authorized to access this page.</h2>
                    <button className='button  text-3xl px-5 py-2 text-center border rounded-xl mt-16' onClick={goBackToTeam}>My team</button>
                    <button className='button  text-3xl px-5 py-2 text-center border rounded-xl mt-16' onClick={signoutHandler}>Log out</button>
                </div>
            </div>
        </div>
    )
}

export default NotAuthorized