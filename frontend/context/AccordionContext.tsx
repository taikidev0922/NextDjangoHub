import React, { createContext, useContext, useState } from "react";

type AccordionState = {
  id: string;
  isOpen: boolean;
};

interface AccordionContextType {
  accordions: AccordionState[];
  toggleAccordion: (id: string) => void;
  addAccordion: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined
);

export const AccordionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [accordions, setAccordions] = useState<AccordionState[]>([]);

  const addAccordion = (id: string) => {
    if (accordions.find((item) => item.id === id)) {
      return;
    }
    setAccordions((current) => [...current, { id, isOpen: false }]);
  };

  const toggleAccordion = (id: string) => {
    console.log(id);
    setAccordions((accordions) =>
      accordions.map((accordion) =>
        accordion.id === id
          ? { ...accordion, isOpen: !accordion.isOpen }
          : accordion
      )
    );
  };

  return (
    <AccordionContext.Provider
      value={{ accordions, toggleAccordion, addAccordion }}
    >
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
