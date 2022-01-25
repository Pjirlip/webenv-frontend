import React                        from 'react';
import { useNotifications }         from '@mantine/notifications';
import { BiError, BiInfoCircle }    from 'react-icons/bi';

const useAlerts = () => {

    const notification = useNotifications()

    const info = (title="", message) => {
        notification.showNotification({
            title: `${title ? title : "Info"}`,
            message: `${message ? message : "<Keine Nachricht>"}`,
            color: "green",
            icon: <BiInfoCircle />
        }) 
    }

    const error = (title="", message) => {
        notification.showNotification({
            title: `${title ? title : "Fehler"}`,
            message: `${message ? message : "Es ist ein unbekannter Fehler aufgetreten."}`,
            color: "red",
            icon: <BiError />
        }) 
    }

    return {info, error}
};

export default useAlerts;
