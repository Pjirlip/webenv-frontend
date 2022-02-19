import axios                                from 'axios';
import React, { useCallback, useEffect }    from 'react';
import useStore                             from '../useStore';
import { BiEnvelope }                       from 'react-icons/bi';


const User = () => {

  const [user, setUser] = useStore(store => [store.user, store.setUser])

  useEffect(() => {
    console.log(user)
  }, [user])

  return <section className='wrapper'>

    <h2> Benutzer </h2>
    <div className='container main usercontainer'>
       <img src={process.env.REACT_APP_API_BASE + (user?.avatar?.formats?.medium?.url ?? user?.avatar?.url)} />
       <div className='userinfo'> 
            <h3> {user?.forename} {user?.lastname} ({user?.username}) </h3>
            <div className='line'><BiEnvelope /><p> {user?.email }</p></div>
       </div>
    </div> 

  </section>;
};

export default User;
