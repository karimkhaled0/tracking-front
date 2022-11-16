import React from 'react'
import Avatar from 'react-avatar'

function ChatUsers({ name, lastMessage = 'dsaldlask', time, counter }) {
  return (
    <div className="m-2 flex cursor-pointer items-center justify-between p-5 hover:bg-gray-100">
      {/* Photo */}
      <Avatar className="mr-7 rounded-full" name={name[0]} size="60" />
      {/* Name & message */}
      <div className="grow">
        <h1 className="text-2xl">{name}</h1>
        <h1 className="text-sm text-gray-500 ">{lastMessage}</h1>
      </div>
      {/* Time & and new message*/}
      <div className="grid grid-rows-2">
        <h1 className="text-gray-500">{time}</h1>
      </div>
    </div>
  )
}

export default ChatUsers
