import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from "react-router-dom";
import { NotificationsProvider } from '@mantine/notifications';

ReactDOM.render(
    <BrowserRouter>
      <MantineProvider theme={{ 
        colorScheme: "dark", 
        fontFamily: 'Roboto',
        colors: {
          highlight:  ["#17B07B", "#17B07B", "#17B07B", "#17B07B", "#17B07B", "#17B07B", "#17B07B", "#17B07B", "#17B07B", "#17B07B"],
          highlight2: ["#7068D7", "#7068D7", "#7068D7", "#7068D7", "#7068D7", "#7068D7", "#7068D7", "#7068D7", "#7068D7", "#7068D7"]
        },
        primaryColor: "highlight"
        }}>
        <NotificationsProvider autoClose={4000} position="top-right">
          <App />
        </NotificationsProvider>
      </MantineProvider>
    </BrowserRouter>,
  document.getElementById('root')
);