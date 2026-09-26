import { createContext, useState } from "react";

export const SomitiContext = createContext();

export function SomitiProvider({ children }) {
  const [somiti, setSomiti] = useState(null);

  const storeSomiti = (somitiData) => {
    localStorage.setItem("somiti", JSON.stringify(somitiData));
    setSomiti({...somitiData});
  };

  return (
    <SomitiContext.Provider value={{ somiti,storeSomiti }}>
      {children}
    </SomitiContext.Provider>
  );
}