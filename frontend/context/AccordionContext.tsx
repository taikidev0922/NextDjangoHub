import React, { createContext, useContext, useState } from "react";

interface AccordionContextType {
  toggleAccordion: () => void;
  setResizeGrid: (resizeGrid: () => void) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>({
  toggleAccordion: () => {},
  setResizeGrid: () => {},
});

export const AccordionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [resizeGrid, setResizeGrid] = useState<() => void>();
  const toggleAccordion = () => {
    resizeGrid?.();
  };

  return (
    <AccordionContext.Provider value={{ toggleAccordion, setResizeGrid }}>
      {children}
    </AccordionContext.Provider>
  );
};

export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (context === undefined) {
    throw new Error("useAccordion must be used within an AccordionProvider");
  }
  return context;
};
