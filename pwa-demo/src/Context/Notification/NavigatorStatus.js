import React from 'react'

export default function NavigatorStatus({isOnline}) {
  return (
    <div className="navigator-status">
        {isOnline ? (
            <span className="text-green-500 inner-05em">Online</span>
        ) : (
            <span className="text-red-500 inner-05em">Offline</span>
        )}
    </div>
  )
}
