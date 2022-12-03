import { SpringRef } from "@react-spring/web";
import create from "zustand";
import { io,Socket } from "socket.io-client";
export interface IDragStore {
  drags: Array<{ id: string; x: number; y: number }>;
  updateDrags: (drag: IDragStore["drags"][0]) => void;
}
export const useDragsStore = create<IDragStore>((set, get) => ({
  drags: [{ id: "draggable", x: 0, y: 0 }],
  updateDrags: (drag) => {
    set((prev) => ({
      drags: [
        {
          ...prev.drags[0],
          x: prev.drags[0].x + drag.x,
          y: prev.drags[0].y + drag.y,
        },
      ],
    }));
  },
}));
type Coordinate ={x:number,y:number}
type DragApi = SpringRef<Coordinate>
export class DragsWebSocket {
  private drags=new Map<string,DragApi>()
  readonly socket:Socket;
  constructor(){
    this.socket = io('http://localhost:4000')
  }
  /**
   * 
   * @param id Should be something prefixed with some websocket client id unique to this session
   * @param api 
   */
  addDrag(id:string,api:DragApi){
    this.drags.set(id,api)
  }
  /**
   * Use this to remove, and also ensure calling on cleaning sideEffects
   * @param id Id to remove
   */
  removeDrag(id:string){
    this.drags.delete(id)
  }

  moveDrag(id:string,coordinate:Coordinate){
    const a = this.drags.get(id)
    a && a.start({...coordinate,config:{
      tension:20
    }})
  }
}

