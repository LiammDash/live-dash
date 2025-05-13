import React from 'react'
import styles from './settings.module.css'
import GroupToggle from './groupToggle/groupToggle'

const settings = () => {
  return (
    <div className={styles.wrapper}>
        <GroupToggle />
    </div>
  )
}

export default settings