import React from 'react'
import styles from './styles.module.css'

type ColorPickerProps = {
  x?: number;
  y?: number;
  style?: React.CSSProperties;
};

const colorpicker: React.FC<ColorPickerProps> = (props) => {
  return (
    <div
      className={styles.wrapper}
      style={{
      left: props.x,
      top: props.y,
      position: 'absolute',
      ...props.style,
      }}
    >
      <input
        data-jscolor="{
        preset: 'dark',
        closeButton: true,
        closeText: 'OK'
        }"
      />
    </div>

  )
}

export default colorpicker