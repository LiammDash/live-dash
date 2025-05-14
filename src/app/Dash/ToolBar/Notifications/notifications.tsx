import React from 'react'
import styles from './notifications.module.css'

import Card from './Card/card'

const notifications = () => {
    const [isPanelVisible, setIsPanelVisible] = React.useState(false);

    const showNotifications = () => {
        setIsPanelVisible(!isPanelVisible);
    };


    return (
        <>
            <span onClick={showNotifications} id={styles.notificationBell}>🕭</span>
            <div id={styles.notificationPanel} className={isPanelVisible ? styles.visible : ''}>
                <Card title="Overseer Request" type="request" />
                <Card title="MC Server Join" type="notification" />
            </div>
        </>
        
    )
}

export default notifications