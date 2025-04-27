import React, { useEffect, useState } from 'react';

import styles from './app.module.css';

interface AppProps {
    name: string;
    img: string;
    url: string;
}

const App: React.FC<AppProps> = ({ name, img, url }) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        const checkStatus = () => {
            fetch('/api/serviceStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            })
                .then(res => res.json())
                .then(data => {
                    setActive(data.success === true);
                })
                .catch(() => {
                    setActive(false);
                });
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000);

        return () => clearInterval(interval);
    }, [url]);

    return (
        <div
            onClick={() => window.open(url, '_blank')}
            className={`${styles.app} ${active ? styles.active : ''}`}
        >
            <span className={styles.appLabel}>{name}</span>
            <img className={styles.appIcon} src={`/appIcons/${img}`} alt={name} />
        </div>
    );
};

export default App;