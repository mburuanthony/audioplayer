import { createContext, useContext, useState } from "react";

const searchuictx = createContext({
  searchUisVisible: false,
  hidesearchUi: () => {},
});

export const SearchUiProvider = ({ children }) => {
  const [searchUisVisible, setsearchUisVisible] = useState(false);

  const hidesearchUi = () => {
    setsearchUisVisible(false);
  };

  return (
    <searchuictx.Provider value={{ searchUisVisible, hidesearchUi }}>
      {children}
    </searchuictx.Provider>
  );
};

export const usesearchui = () => useContext(searchuictx);
