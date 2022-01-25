import React, { useCallback, useEffect, useState }  from 'react';
import { TextInput, Button, Space, PasswordInput }  from '@mantine/core';
import { useHotkeys }                               from '@mantine/hooks';
import { BiEnvelope, BiKey, BiSmile }      from "react-icons/bi";
import useStore                                     from '../useStore';
import axios                                        from 'axios';
import { useNavigate }                              from 'react-router-dom';
import useAlerts from '../useAlerts';

const Login = () => {

  const [user, setUser]         = useStore(store => [store.user, store.setUser])
  const setUsers                = useStore(store => store.setUsers)
  const [token, setToken]       = useStore(store => [store.token, store.setToken])
  const [password, setPassword] = useState("")
  const navigate                = useNavigate()

  const notification = useAlerts()

  const login = useCallback(async () => {

    try {
        const response = (await axios.post("/auth/local", {
            identifier: user,
            password
        }))?.data

        const fullUser = (await axios.get("/users/me?populate=*", {
            headers: {
                "Authorization": `Bearer ${response?.jwt}`
            }
        }))?.data

        const allUsers = (await axios.get("/users", {
            headers: {
                 "Authorization": `Bearer ${response?.jwt}`
            }
        }))?.data


        if(response?.jwt && fullUser && allUsers) {
            notification.info("Erfolgreich angemeldet", `Herzlich Willkommen ${fullUser?.forename} ${fullUser?.lastname}`)
            setUser(fullUser)
            setToken(response?.jwt)
            setUsers(allUsers)

            return
        }


    } catch (error) {
        console.log(error)
        notification.error("Fehler bei der Anmeldung", `Es gab einen Fehler bei der Anmeldung. 
        Gehen Sie bitte sicher, dass der Benutzername und das Passwort korrekt sind.`)
    }
  }, [user, password, setToken, setUser])

  useEffect(() => {
      if(!!token) navigate("/")
  }, [token, navigate])

  return <section className='login'>
            <div className='background' />
            <div className='overlay'>
                <h2> Login </h2>
                <form>
                    <TextInput icon={<BiEnvelope />} onChange={e => setUser(e.target.value)} value={user} variant="default" placeholder="Benutzername / E-Mail" label="Benutzername / E-Mail"  required />
                    <Space h="md" />
                    <PasswordInput icon={<BiKey />} onChange={e => setPassword(e.target.value)} value={password} variant="default" placeholder="Passwort" label="Passwort" required />
                    <Space h="md" />
                    <Button type="submit" onClick={e => {e.preventDefault(); login()}}> Anmelden </Button>
                </form>
            </div>
        </section>;
};

export default Login;
