import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import { useRouter } from 'next/router'
import { DotsHorizontalIcon, DotsVerticalIcon, SearchIcon } from '@heroicons/react/solid'
import { LocationMarkerIcon, ChatAltIcon, DotsCircleHorizontalIcon } from '@heroicons/react/outline'
import Avatar from 'react-avatar';



function Technicals() {
  const [searchTech, setSearchTech] = useState('')
  // user checked
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

  const [technicals, setTechnicals] = useState([])
  // get technicals
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
  return (
    <div className='relative'>
      <Header
        headerView={true}
        islogged={user}
      />
      <section className='mx-auto max-w-10xl px-8'>
        {/* Search and button  */}
        <div className="flex justify-between my-10 items-center">
          <div className='flex items-center rounded-full py-1 border-2 shadow-md'>
            <input
              className="bg-transparent pl-2 mx-5 text-sm text-gray-600 placeholder-gray-400 outline-none"
              type="text"
              placeholder={"Start your search"}
              onChange={(e) => setSearchTech(e.target.value)}
            />
            <SearchIcon
              className="h-8 cursor-pointer rounded-full bg-blue-400 p-2 text-white flex mx-3"
            />
          </div>
        </div>
        <div className='grid grid-cols-5 gap-5'>
          {technicals.filter((val) => {
            if (val.name.toLowerCase().includes(searchTech.toLowerCase())) {
              return val
            }
          }).map((i) => {
            return <div>
              <div className='border rounded-lg bg-white shadow-lg p-5 space-y-8 relative'>
                <div className='flex lex flex-col items-center space-y-5 cursor-pointer transform transition ease-out active:scale-90 duration-200'
                  onClick={() => {
                    router.push({
                      pathname: `/profile/${i.name.replace('/', '')}`
                    })
                  }}
                >
                  {/* Avatar */}
                  <div className=''>
                    <Avatar className='rounded-full' name={i.name} size='60' />
                  </div>
                  {/* Technical name */}
                  <div className=''>
                    <h1 className='text-2xl font-semibold text-blue-500'>{i.name.charAt(0).toUpperCase() + i.name.slice(1)}</h1>
                  </div>
                </div>

                <div className='flex justify-between items-center'>
                  <div className='flex items-center space-x-2'>
                    <input type="radio" disabled checked />
                    <h1 className='text-gray-600'>Available</h1>
                  </div>
                  <div className='flex space-x-2'>
                    <LocationMarkerIcon className='h-5 text-gray-500 cursor-pointer' />
                    <ChatAltIcon className='h-5 text-gray-500 cursor-pointer' />
                  </div>
                </div>
              </div>
            </div>
          })}
        </div>
      </section >
    </div >
  )
}

export default Technicals