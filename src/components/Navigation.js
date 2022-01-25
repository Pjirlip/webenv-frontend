import React, { useCallback }                                from 'react';
import { BiListUl, BiPlus, BiFile, BiUser, BiExit}  from 'react-icons/bi';
import { NavLink }                             from 'react-router-dom';
import useStore from '../useStore';

const Navigation = () => {

  const setUser   = useStore(store => store.setUser)
  const setToken  = useStore(store => store.setToken)

  const logout = useCallback((e) => {
      setUser("")
      setToken(null)
  }, [setUser, setToken])

  return <header>
      <nav>
          <ol>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : 'inactive')}><BiPlus /></NavLink>
            <NavLink to="/list" className={({ isActive }) => (isActive ? 'active' : 'inactive')}><BiListUl /></NavLink>
            <NavLink to="/documents" className={({ isActive }) => (isActive ? 'active' : 'inactive')}> <BiFile /> </NavLink>
            <NavLink to="/user" className={({ isActive }) => (isActive ? 'active' : 'inactive')}><BiUser /></NavLink>
            <a href='/' onClick={(e) => {e.preventDefault(); logout()}}><BiExit /></a>
          </ol>
      </nav>
  </header>;
};

export default Navigation;
