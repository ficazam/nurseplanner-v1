import React from 'react'

const AuthLayout = (props: {children: React.ReactNode}) => {
  return (
    <div className='min-h-screen h-full w-full flex justify-center items-center'>{props.children}</div>
  )
}

export default AuthLayout