import { useState, useEffect } from 'react';

interface Note {
  id: number;
  title: string;
  content: string;
}

interface EditNoteModalProps {
  note: Note;
  onClose: () => void;
  onSave: (id: number, title: string, content: string) => void;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ note, onClose, onSave }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note]);

  const handleSave = () => {
    onSave(note.id, title, content);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border-b focus:outline-none text-lg font-bold"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 h-48 focus:outline-none mt-4 whitespace-pre-wrap"
          style={{ minHeight: '12rem' }}
        />
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="text-gray-600 mr-4">Cancel</button>
          <button onClick={handleSave} className="bg-yellow-500 text-white px-4 py-2 rounded-md">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditNoteModal;
