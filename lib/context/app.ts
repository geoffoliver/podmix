import { createContext } from 'react';

const AppContext = createContext<{ search: any, setSearch: Function }>({
  search: null,
  setSearch: (_p: string) => {},
});

export default AppContext;
