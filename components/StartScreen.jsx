import React from 'react'

function StartScreen() {
    return (
        <div className='flex flex-col h-screen justify-center items-center'>
            <img src='/assest/bgImage.png' className='w-80'/>
            <h1 className='pt-6 text-[28px]'>CHAT APPLICATION</h1>
            <p className='pt-2 text-[18px] mb-20'>Send and Receive Message using Chat Application</p>
        </div>
    )
}

export default StartScreen