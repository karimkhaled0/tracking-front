import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useRouter } from 'next/router'

function Messages() {
    const router = useRouter()

    const checkAdmin = useEffect(async () => {
        if (!localStorage.token) {
            return
        } else {
            const res = await fetch('http://localhost:8000/api/user/me', {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${localStorage.token}`
                }
            }).then((r) => r.json()).catch((e) => console.log(e))
            if (!res.data.isAdmin) {
                router.push({
                    pathname: '/notAuthorized'
                })
            }
        }
    }, [])

    const [user, setUser] = useState(false)
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
    return (
        <div>
            <Header islogged={user} />
        </div>
    )
}

export default Messages