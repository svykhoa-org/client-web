// import React from 'react';
// import ReactQuill from 'react-quill-new';
// import 'react-quill-new/dist/quill.snow.css';
// interface EditorProps {
//   value?: string;
//   onChange?: (value: string) => void;
//   placeholder?: string;
// }
// const Editor: React.FC<EditorProps> = ({ value, onChange, placeholder }) => (
//   <ReactQuill
//     theme="snow"
//     value={value}
//     onChange={onChange}
//     placeholder={placeholder}
//     style={{ height: '100%' }}
//   />
// );
// export default Editor;
import React, { useMemo, useRef } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

// Định nghĩa type cho Quill
interface QuillInstance {
  getSelection(): { index: number; length: number } | null
  insertEmbed(index: number, type: string, value: string): void
}

interface EditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  onImageUpload?: (file: File) => Promise<string> // Callback để upload ảnh
}

const Editor: React.FC<EditorProps> = ({ value, onChange, placeholder, onImageUpload }) => {
  const quillRef = useRef<ReactQuill>(null)

  // Xử lý upload ảnh
  const imageHandler = () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (file && onImageUpload && quillRef.current) {
        try {
          // Upload ảnh và nhận URL
          const imageUrl = await onImageUpload(file)

          // Chèn ảnh vào editor
          const quill = quillRef.current.getEditor() as QuillInstance
          const range = quill.getSelection()
          if (range) {
            quill.insertEmbed(range.index, 'image', imageUrl)
          }
        } catch (error) {
          console.error('Error uploading image:', error)
          alert('Lỗi upload ảnh!')
        }
      }
    }
  }

  // Cấu hình modules
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ script: 'sub' }, { script: 'super' }],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          // ['link', 'image', 'video'],
          ['link'],
          ['clean'],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [onImageUpload],
  )

  // Cấu hình formats
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'align',
    'link',
    'image',
    'video',
  ]

  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      modules={modules}
      formats={formats}
    />
  )
}

export default Editor
