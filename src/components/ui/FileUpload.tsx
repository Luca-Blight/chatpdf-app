'use client';
import React from 'react';
import { Inbox, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type Props = {};

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false); // fix error below
  const { mutate, status } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post('/api/create-chat', {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        toast.error('File too large');
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        console.log('uploading to s3', data);
        if (!data?.file_key || !data.file_name) {
          toast.error('Something went wrong');
          return;
        }
        mutate(data, {
          onSuccess: ({chat_id}) => {
            console.log(data);
            toast.success("Chat created!");
            router.push(`/chat/${chat_id}`) // how does push work?
          },
          onError: (err) => {
            toast.error('Error creating chat');
            console.error(err);
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });

  const isLoading = status === 'pending';

  return (
    <div className='p-2 bg-white rounded-xl'>
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col',
        })}>
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            <Loader2 className='h-10 w-10 text-blue-500 animate-spin' />
            <span className='mt-2 text-sm text-slate-400'>
              Spilling Tea to GPT...
            </span>
          </>
        ) : (
          <>
            <Inbox className='w-10 h-10 text-blue-500' />
            <span className='mt-2 text-sm text-slate-400'>Drop PDF Here</span>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;