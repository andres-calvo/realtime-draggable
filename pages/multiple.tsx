import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React, { ReactNode, useState } from "react";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { animated, useTransition } from "@react-spring/web";
const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,16,17,18,19,20,21];
const MultipleDrags = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const handleSelect = (id: number) => {
    setSelectedIds((selectedIds) => {
      if (selectedIds.includes(id)) {
        return selectedIds.filter((value) => value !== id);
      }

      return selectedIds.concat(id);
    });
  };
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  return (
    <main className="h-screen w-full bg-slate-200 flex justify-center items-center p-8 relative ">
      <div className="w-96 border border-red-500 h-4/5 overflow-y-auto flex flex-col items-center">
        <DndContext
          onDragStart={({ active }) =>{
            setActiveId(active.id as number);
            setSelectedIds((selected) =>
              selected.includes(active.id as number) ? selected : []
            );
          }}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <MultipleDraggableTransition
            data={filterItems(ids)}
            handleSelect={handleSelect}
            selectedIds={selectedIds}
          />

          <DragOverlay>
            {activeId ? (
              <DraggableItem
                id={activeId}
                selected={selectedIds.includes(activeId)}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );

  function handleDragEnd() {
    setActiveId(null);
  }
  function filterItems(items: number[]) {
    if (!activeId) {
      return items;
    }
    return items.filter((id) => !selectedIds.includes(id));
  }
};

export default MultipleDrags;

const MultipleDraggableTransition = ({
  data = [],
  handleSelect,
  selectedIds,
}: {
  data: Array<number>;
  handleSelect: any;
  selectedIds: Array<number>;
}) => {
  const transitions = useTransition(data, {
    config:{
        tension:300
    },
    from: { opacity: 0,scale:0 },
    enter: { opacity: 1,scale:1 },
    leave: { opacity: 0 ,scale:0},
  });

  return transitions((style, id) => (
    <Draggable id={id} key={id} onClick={handleSelect} style={style}>
      <DraggableItem id={id} selected={selectedIds.includes(id)} />
    </Draggable>
  ));
};

function Draggable({
  id = 0,
  children,
  onClick,
  style,
}: {
  id: number;
  children?: ReactNode;
  onClick: any;
  style?: any;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  });

  return (
    <animated.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onClick={() => onClick(id)}
    >
      {children}
    </animated.div>
  );
}
function DraggableItem({
  id = 0,
  selected = false,
}: {
  id: number;
  selected: boolean;
}) {
  return (
    <button
      className={`font-bold shadow-sm border   rounded-md px-6 py-4 ${
        selected ? "bg-blue-400" : "bg-slate-500"
      }`}
    >
      Soy un Drag {id}
    </button>
  );
}
