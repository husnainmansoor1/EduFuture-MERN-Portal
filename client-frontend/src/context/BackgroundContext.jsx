import React, { createContext, useContext, useState } from "react";

const BackgroundContext = createContext();

const localBackgrounds = Array.from({ length: 15 }, (_, i) => `/background/bg${i + 1}.jpg`);

export function BackgroundProvider({ children }) {
  const [backgrounds, setBackgrounds] = useState(() => {
    const stored = localStorage.getItem("bgImages");
    return stored ? JSON.parse(stored) : {};
  });

  const getBackground = (id) => {
    if (backgrounds[id]) return backgrounds[id];

    // pick random background from 15
    const randomIndex = Math.floor(Math.random() * localBackgrounds.length);
    const newBg = localBackgrounds[randomIndex];

    const updated = { ...backgrounds, [id]: newBg };
    setBackgrounds(updated);
    localStorage.setItem("bgImages", JSON.stringify(updated));

    return newBg;
  };

  return (
    <BackgroundContext.Provider value={{ getBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackgrounds() {
  return useContext(BackgroundContext);
}
