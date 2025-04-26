import React from 'react'
import styles from './style.module.css'

const groupToggle = () => {
return (
    <>
            <div
                    className={`${styles.groupToggleContainer} ${styles.active}`} onClick={(e) => {
                            window.dispatchEvent(new CustomEvent('groupToggleClicked'));
                            e.target.classList.toggle(styles.active);
                    }}
            >
                    <div className={styles.groupToggleCircle}></div>
            </div>
    </>
)
}

export default groupToggle