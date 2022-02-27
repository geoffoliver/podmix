import { createContext } from 'react';

const AppContext = createContext<{ search: any, setSearch: Function }>({
  search: null,
  setSearch: (p: string) => {},
});

export default AppContext;
