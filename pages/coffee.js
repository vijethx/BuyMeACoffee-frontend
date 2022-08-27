import React from "react";

const coffee = () => {
  return (
    <div
      className='h-screen flex items-center justify-center bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400
    '>
      <div className='border-2 border-indigo-800 flex-col items-center justify-center py-12 px-8 rounded-xl'>
        {" "}
        <h1 className='font-bold text-3xl text-center'>Buy Vijeth a coffee</h1>
        <form className='flex-col items-center justify-center'>
          <div className='my-10'>
            <label htmlFor='name'>Name</label>
            <input name='name' type='text' className='border h-10 w-full' />
          </div>
          <div className='my-10'>
            {" "}
            <label htmlFor='message'>Message</label>
            <textarea
              className='border h-30 w-full resize-none'
              name='message'
              id=''
              rows='3'></textarea>
          </div>
          <div className='flex items-center justify-center'>
            <ul className='grid grid-cols-3 gap-x-5 m-10 max-w-md mx-auto'>
              <li className='relative'>
                <input
                  className='sr-only peer'
                  type='radio'
                  value='yes'
                  name='answer'
                  id='answer_yes'
                />
                <label
                  className='flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-indigo-500 peer-checked:ring-2 peer-checked:border-transparent'
                  htmlFor='answer_yes'>
                  0.1 ETH
                </label>

                {/* <div className='absolute hidden w-5 h-5 peer-checked:block top-5 right-3'>
                👍
              </div> */}
              </li>
              <li className='relative'>
                <input
                  className='sr-only peer'
                  type='radio'
                  value='no'
                  name='answer'
                  id='answer_no'
                />
                <label
                  className='flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-indigo-500 peer-checked:ring-2 peer-checked:border-transparent'
                  htmlFor='answer_no'>
                  0.2 ETH
                </label>
              </li>

              <li className='relative'>
                <input
                  className='sr-only peer'
                  type='radio'
                  value='maybe'
                  name='answer'
                  id='answer_maybe'
                />
                <label
                  className='flex p-5 bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none hover:bg-gray-50 peer-checked:ring-indigo-500 peer-checked:ring-2 peer-checked:border-transparent'
                  htmlFor='answer_maybe'>
                  0.25 ETH
                </label>
              </li>
            </ul>
          </div>
          <div className='flex items-center justify-center'>
            {" "}
            <button
              className='bg-indigo-400 p-4 rounded-full w-[100px]'
              type='submit'>
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default coffee;
