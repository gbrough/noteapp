import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { MdDelete, MdDragIndicator } from 'react-icons/md';

interface NoteType {
  id: number;
  title: string;
  content: string;
  position: number;
}

interface NoteProps {
  note: NoteType;
  index: number;
  onDelete: (id: number) => void;
  onEdit: (note: NoteType) => void;
  moveNote: (dragIndex: number, hoverIndex: number) => void;
  onDropEnd: () => void;
}

interface DragItem {
  index: number;
  id: number;
  type: 'NOTE';
}

const Note: React.FC<NoteProps> = ({
  note,
  index,
  onDelete,
  onEdit,
  moveNote,
  onDropEnd
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: 'NOTE',
    item: () => {
      return { id: note.id, index, type: 'NOTE' };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_, monitor) => {
      if (monitor.didDrop()) {
        onDropEnd();
      }
    },
  });

  const [, drop] = useDrop({
    accept: 'NOTE',
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveNote(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  // Initialize drag and drop refs
  drag(drop(ref));

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note.id);
    }
  };
  return (
    <div 
      ref={ref}
      className={`bg-white rounded-lg shadow-md p-3 sm:p-4 group relative cursor-move transition-all ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      onClick={() => onEdit(note)}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div className="flex items-start">
        <div className="mr-2 text-gray-300 hover:text-gray-400 cursor-move touch-none" style={{ touchAction: 'none' }}>
          <MdDragIndicator className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          {note.title && (
            <h2 className="text-xl font-bold mb-2">{note.title}</h2>
          )}
          <div className="text-gray-700 whitespace-pre-wrap">
            {note.content.split('\n').map((line, i) => (
              <div key={i}>{line || <br />}</div>
            ))}
          </div>
        </div>
      </div>
      <button 
        onClick={handleDelete}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-gray-100 active:bg-gray-200"
        aria-label="Delete note"
      >
        <MdDelete className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
      </button>
    </div>
  );
};

export default Note;