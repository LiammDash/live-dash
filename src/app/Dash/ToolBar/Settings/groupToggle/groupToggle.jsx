import React from 'react'
import styles from './style.module.css'

const groupToggle = () => {
return (
    <div className={styles.wrapper}>
        <span>Light Groups</span>
        <div
                className={`${styles.groupToggleContainer} ${styles.active}`} onClick={(e) => {
                        window.dispatchEvent(new CustomEvent('groupToggleClicked'));
                        console.log("group mode toggled")
                        e.target.classList.toggle(styles.active);
                }}
        >
                <div className={styles.groupToggleCircle}></div>
        </div>
    </div>
)
}

export default groupToggle