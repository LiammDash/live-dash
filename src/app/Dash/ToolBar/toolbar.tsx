import React from 'react'
import styles from './toolbar.module.css'
import Settings from './Settings/settings'
import Notifications from './Notifications/notifications'

const toolbar = () => {
    const [currentTime, setCurrentTime] = React.useState('');
    const [showSettings, setShowSettings] = React.useState(false);
    const [plexWatchers, setPlexWatchers] = React.useState(0);
    const [minecrafters, setMinecrafters] = React.useState(0);

    React.useEffect(() => {
        const fetchMinecrafters = async () => {
            try {
                const res = await fetch('/api/minecrafters');
                if (!res.ok) return;
                const data = await res.json();
                setMinecrafters(data.value ?? 0);
            } catch (e) {
                setMinecrafters(0);
            }
        };

        fetchMinecrafters();
        const interval = setInterval(fetchMinecrafters, 50); // every minute

        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        const fetchPlexWatchers = async () => {
            try {
                // Replace with your Plex server URL and token
                const plexUrl = 'http://192.168.2.150:32400/status/sessions';
                const plexToken = '';
                const res = await fetch(`${plexUrl}?X-Plex-Token=${plexToken}`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (!res.ok) return;
                const data = await res.json();
                // The JSON response contains a MediaContainer with a list of Video objects
                const videos = data?.MediaContainer?.Metadata || [];
                setPlexWatchers(videos.length);
            } catch (e) {
                setPlexWatchers(0);
            }
        };

        fetchPlexWatchers();
        const interval = setInterval(fetchPlexWatchers, 1000); // every minute

        return () => clearInterval(interval);
    }, []);
    
    
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
            <span id={styles.time}>Plex Watchers: {plexWatchers}</span>
            <span id={styles.time}>Minecraft Players: {minecrafters}</span>
            <span id={styles.time}>{currentTime}</span>
            <Notifications />
        </div>
    );
};

export default toolbar