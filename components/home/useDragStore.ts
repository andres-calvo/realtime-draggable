import create from "zustand";

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
