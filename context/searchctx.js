import { createContext, useContext, useState } from "react";

const searchuictx = createContext({
  searchUisVisible: false,
  showsearchUi: () => {},
  hidesearchUi: () => {},
});

export const SearchUiProvider = ({ children }) => {
  const [searchUisVisible, setsearchUisVisible] = useState(false);

  const showsearchUi = () => {
    setsearchUisVisible(true);
  };

  const hidesearchUi = () => {
    setsearchUisVisible(false);
  };

  return (
    <searchuictx.Provider
      value={{ searchUisVisible, showsearchUi, hidesearchUi }}
    >
      {children}
    </searchuictx.Provider>
  );
};

export const usesearchui = () => useContext(searchuictx);
