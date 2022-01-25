import React from 'react';
import useStore from '../useStore';
import { Button } from '@mantine/core';
import Item from '../components/Item';


const Main = () => {

  return <section className='wrapper mainview'>
      <h2> Gegenstand hinzufügen </h2>
      <Item />
  </section>;
};

export default Main;
