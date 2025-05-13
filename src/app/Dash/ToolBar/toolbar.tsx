import React from 'react'
import styles from './toolbar.module.css'
import Settings from './Settings/settings'

const toolbar = () => {
    const [currentTime, setCurrentTime] = React.useState('');
    const [showSettings, setShowSettings] = React.useState(false);
    
    React.useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
        };
        
        updateTime(); // Set time immediately
        const timerId = setInterval(updateTime, 1000);
        
        return () => clearInterval(timerId); // Cleanup
    }, []);

    return (
        <div className={styles.wrapper}>
            <span id={styles.settings} onClick={() => setShowSettings(!showSettings)}>Settings</span>
            <div style={{ 
                display: showSettings ? 'block' : 'none',
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 100
            }}>
                <Settings />
            </div>
            <div className={styles.spacer}></div>
            <span id={styles.time}>{currentTime}</span>
        </div>
    );
};

export default toolbar