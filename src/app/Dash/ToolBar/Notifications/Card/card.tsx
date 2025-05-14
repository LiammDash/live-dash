import React from 'react';
import styles from './card.module.css';

interface CardProps {
  title: string;
  type: 'request' | 'notification';
}

const Card: React.FC<CardProps> = ({ title, type }) => {
  return (
    <div className={styles.card}>
      <h1>{title}</h1>
      {type === 'request' ? (
        <>
          <p>Accept</p>
          <p>Decline</p>
        </>
      ) : (
        <p>You have a new notification</p>
      )}
    </div>
  );
};

export default Card;