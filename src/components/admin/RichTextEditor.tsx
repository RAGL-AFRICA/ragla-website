import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'clean'],
    ],
  };

  const formats = [
    'header', 'size',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background', 'align',
    'link',
  ];

  return (
    <div className={`rich-text-editor ${className}`}>
      <style>{`
        .rich-text-editor .ql-container {
          min-height: 151px;
          font-family: inherit;
          font-size: 14px;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        .rich-text-editor .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background: #f8fafc;
        }
        .rich-text-editor .ql-editor.ql-blank::before {
          color: #94a3b8;
          font-style: normal;
        }
        .dark .rich-text-editor .ql-toolbar {
          background: #1e293b;
          border-color: #334155;
        }
        .dark .rich-text-editor .ql-container {
          border-color: #334155;
          color: #f1f5f9;
        }
        .dark .rich-text-editor .ql-stroke {
          stroke: #94a3b8;
        }
        .dark .rich-text-editor .ql-fill {
          fill: #94a3b8;
        }
        .dark .rich-text-editor .ql-picker {
          color: #94a3b8;
        }
        .dark .rich-text-editor .ql-picker-options {
          background-color: #0f172a;
          border-color: #334155;
        }
      `}</style>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};

export default RichTextEditor;
