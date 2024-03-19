'use client';

import React from 'react';
// import { Input } from "ui/input";
import { Button } from './ui/button'; // fix error

import { useChat } from 'ai/react';

type Props = {};

const ChatComponent = (props: Props) => {
  const { input, handleInputChange, handleSubmit, messages } = useChat();
  return (
    <div className='relative max-h-screen overflow-scroll'>
      <div className='sticky top-0 inset-x-0 p-2 bg-white h-fit'>
        <h3 className='text-xl font-bold'>Chat</h3>
      </div>
    </div>
  );

  <form onSubmit={handleSubmit}>
    {/* <Input
      value={input}
      onChange={handleInputChange}
      placeholder='Ask any question...'
      className='w-full'
    />
    <Button className='bg-blue-600 ml-2'>
      <Send className='h-4 w-4' />
    </Button> */}
  </form>;
};

export default ChatComponent;
