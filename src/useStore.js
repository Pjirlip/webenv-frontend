import create                 from 'zustand'
import { persist }            from "zustand/middleware"
import { mountStoreDevtool }  from 'simple-zustand-devtools';

const useStore = create(persist(set => ({
  user    : "",
  token   : null,
  users   : [],

  setUser : (user) => set(state => ({user})),
  setToken: (token) => set(state => ({token})),
  setUsers: (users) => set(state => ({users}))
}), {
  name: "webev",
  getStorage: () => localStorage,
}))

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useStore);
}

export default useStore