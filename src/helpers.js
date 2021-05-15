import { useCallback, useState } from "react";

export const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
  const [translate, setTranslate] = useState(defaultTranslate);
  const containerRef = useCallback((containerElem) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height / 2 });
    }
  }, []);
  return [translate, containerRef];
};

export const initialGraph = {
  nodes: [
    { id: 1, label: "Node 1" },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" },
    { id: 6, label: "Node 6" }
  ],
  edges: [
    {id: 11, from: 1, to: 2 },
    {id: 12, from: 1, to: 3 },
    {id: 13, from: 2, to: 4 },
    {id: 14, from: 2, to: 5 },
    {id: 15, from: 4, to: 1 },
    {id: 16, from: 4, to: 1 }
  ]
};