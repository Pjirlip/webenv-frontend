import React, { useCallback, useEffect }                from 'react';
import { Routes, Route, useLocation, Navigate, Outlet } from "react-router-dom";
import axios                                            from "axios";
import Navigation                                       from './components/Navigation';
import Main                                             from "./routes/Main.js"
import ItemList                                         from './routes/ItemList.js';
import useStore                                         from './useStore';

import Login  from './routes/Login';
import User   from './routes/User';

import "./styles/webev.scss"
import SingleItem from './routes/SingleItem';

const App = (props) => {
  axios.defaults.baseURL = process.env.REACT_APP_API_URL;
	axios.defaults.timeout = 10000;
  axios.defaults.headers.post["Content-Type"] = "application/json"

  const token = useStore(store => store.token)
  const location = useLocation()

  const RequireAuth = useCallback(() => {
    return token ? <Outlet /> : <Navigate to="/login" state={{from: location}} />
  }, [token, location])

  useEffect(() => {
		axios.defaults.headers["Authorization"] = !!token ? `Bearer ${token}` : "";
	}, [token])

  axios.defaults.headers["Authorization"] = !!token ? `Bearer ${token}` : ""; //Prevent Reload Issue

  return  <>
              {!!token ? <Navigation /> : null} 
              <Routes>
                <Route path="/" element={<RequireAuth />}>
                    <Route path="/" element={<Main />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/list" element={<ItemList />} />
                    <Route path="/list/:itemID" element={<SingleItem />} />
                </Route>
                <Route path="/login" element={<Login />} />
              </Routes>
          </>
}

export default App;

