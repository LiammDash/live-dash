import React from 'react';
import styles from './card.module.css';

interface CardProps {
  requestId: string;
  title: string;
  reqType: string;
  requester: string;
  cardType: string;
  backdrop: string;
}

const Card: React.FC<CardProps> = ({ requestId, title, reqType, requester, cardType, backdrop }) => {
  return (
    <div
      className={styles.card}
      style={{
      backgroundImage: `
        linear-gradient(to right, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.25) 100%),
        url(https://image.tmdb.org/t/p/w600_and_h900_bestv2${backdrop})
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      }}
    >
      <h1 className={styles.title}>Overseer Request</h1>
      {cardType === 'request' ? (
      <>
        <p><span className={styles.requester} >{requester}</span> has requested the {reqType}, {title}</p>
        <div className={styles.actions}>
        <p
          className={styles.approve}
          onClick={async () => {
          const res = await fetch('/api/overseerr/accept', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId, title, reqType, requester }),
          });
          if (res.ok) {
            window.dispatchEvent(new Event('notificationsUpdated'));
          }
          }}
        >
          Approve
        </p>
        <p
          className={styles.deny}
          onClick={async () => {
          const res = await fetch('/api/overseerr/deny', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId, title, reqType, requester }),
          });
          if (res.ok) {
            window.dispatchEvent(new Event('notificationsUpdated'));
          }
          }}
        >
          Deny
        </p>
        </div>
      </>
      ) : (
      <p>You have a new notification</p>
      )}
    </div>
  );
};

export default Card;