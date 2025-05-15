import React from 'react'
import styles from './notifications.module.css'

import Card from './Card/card'

const notifications = () => {
    const [isPanelVisible, setIsPanelVisible] = React.useState(false);

    const showNotifications = () => {
        setIsPanelVisible(!isPanelVisible);
    };

    const [requests, setRequests] = React.useState<any[]>([]);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/overseerr/requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data)
                setRequests(Array.isArray(data) ? data : data.results || []);
            }
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        }
    };

    React.useEffect(() => {
        fetchRequests(); // Fetch on mount
        const interval = setInterval(fetchRequests, 10000); // Poll every 10 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    React.useEffect(() => {
        if (isPanelVisible) {
            fetchRequests();
        }
    }, [isPanelVisible]);

    React.useEffect(() => {
        const handleNotificationsUpdated = () => {
            if (isPanelVisible) {
                fetchRequests();
            }
        };
        window.addEventListener('notificationsUpdated', handleNotificationsUpdated);
        return () => {
            window.removeEventListener('notificationsUpdated', handleNotificationsUpdated);
        };
    }, [isPanelVisible]);

    return (
        <>
            <span
                onClick={showNotifications}
                id={styles.notificationBell}
                style={{ color: requests.length > 0 ? 'orange' : undefined }}
            >
                🕭
            </span>
            <div id={styles.notificationPanel} className={isPanelVisible ? styles.visible : ''}>
                {requests.length === 0 ? (
                    <div>No notifications</div>
                ) : (
                    requests.map((request, idx) => (
                        <Card
                            key={request.id || idx}
                            requestId={request.id || idx}
                            title={request.name}
                            reqType={request.type}
                            requester={request.requester}
                            cardType='request'
                            backdrop={request.backdrop}
                            {...request}
                        />
                        
                    ))
                )}
            </div>
        </>
        
    )
}

export default notifications