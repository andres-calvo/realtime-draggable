import { DndContext } from "@dnd-kit/core";
import Head from "next/head";
import { useDraggable } from "@dnd-kit/core";
import { DragsWebSocket, useDragsStore } from "../components/home/useDragStore";
import { animated,  useSpring} from "@react-spring/web";
import { useEffect, useState } from "react";

export default function Home() {
  const updateDrags = useDragsStore((state) => state.updateDrags);
  const [dragApi] = useState(()=>new DragsWebSocket())
  useEffect(()=>{
    dragApi.moveDrag("drag1",{x:100,y:400})
    dragApi.moveDrag("drag2",{x:200,y:100})
    dragApi.moveDrag("drag3",{x:300,y:100})

  },[])
  return (
    <main className="min-h-screen w-full bg-slate-200 flex justify-center items-center p-8 relative">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DndContext
        onDragEnd={({ delta }) =>
          updateDrags({ id: "draggable", x: delta.x, y: delta.y })
        }
      >
        <DraggableDiv dragApi={dragApi} id="drag1" />
        <DraggableDiv dragApi={dragApi} id="drag2" />
        <DraggableDiv dragApi={dragApi} id="drag3" />


      </DndContext>
    </main>
  );
}

const DraggableDiv = ({dragApi,id}:{dragApi:DragsWebSocket,id:string}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });
  const drag = useDragsStore((state) => state.drags[0]);
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

    const [props,api] = useSpring(()=>({
      from: { x:0 ,y:0},
      to: { x:0,y:0},
      reset:false
    }))
 
  useEffect(()=>{
    dragApi.addDrag(id,api)
    return ()=>{
      dragApi.removeDrag(id)
    }
  },[api])
  return (
    <animated.button
      className="font-bold shadow-sm border bg-slate-500 rounded-md px-6 py-4 absolute"
      ref={setNodeRef}
      style={{ ...style, top: drag.y, left: drag.x ,...props}}
      {...listeners}
      {...attributes}
    >
      Hola
    </animated.button>
  );
};

// const Page = () => {
//   const { isOver, setNodeRef } = useDroppable({
//     id: "droppable",
//   });
//   return (
//     <section
//       className="w-[8.5in] h-[11in] border border-gray-300"
//       ref={setNodeRef}
//     >
//       Soy una pagina
//     </section>
//   );
// };
function fireUpdate(callback:()=>void){
  setTimeout(()=>callback(),300)
}