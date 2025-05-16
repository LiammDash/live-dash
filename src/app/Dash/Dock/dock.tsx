import React from 'react'
import styles from './dock.module.css'
import App from './App/app'

const dock = () => {
  return (
    <>
        <div className={styles.dockWrap}>
            <App name="True NAS" img="TrueNAS.webp" url="http://192.168.2.150/"></App>
            <App name="Unifi" img="unifi.svg" url="https://192.168.2.254/"></App>
            <App name="Plex" img="plex.png" url="http://192.168.2.150:32400/web/index.html#!/"></App>
            <App name="Home Assistant" img="homeas.png" url="http://192.168.2.150:30103"></App>
            <App name="qBittrrent" img="qbit.png" url="http://192.168.2.150:30024"></App>
            <App name="Overseerr" img="overseerr.svg" url="http://192.168.2.150:30002"></App>
            <App name="Radarr" img="radarr.png" url="http://192.168.2.150:30025"></App>
            <App name="Sonarr" img="sonarr.png" url="http://192.168.2.150:30113"></App>
            <App name="Prowlarr" img="prowlarr.png" url="http://192.168.2.150:30050"></App>
            <App name="Tautulli" img="tautulli.png" url="http://192.168.2.150:30047"></App>
            <App name="Dockge" img="dockge.svg" url="http://192.168.2.150:31014"></App>
            <App name="ESP Home" img="esphome.svg" url="http://192.168.2.157:8123/5c53de3b_esphome/ingress"></App>
            <App name="Flood" img="flood.png" url="http://192.168.2.150:30127"></App>
            <App name="Scrypted" img="scrypted.png" url="http://192.168.2.150:30130"></App>
            <App name="Youtube" img="youtube.avif" url="https://www.youtube.com"></App>
        </div>
    </>
  )
}

export default dock