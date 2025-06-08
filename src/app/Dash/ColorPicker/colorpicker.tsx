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
      id="selected-color-wrap"
      className={styles.wrapper}
      style={{
      left: props.x,
      top: props.y,
      position: 'absolute',
      ...props.style,
      }}
      onMouseLeave={() => {
        

        
      }}
        >
      <input
      id="selected-color"
      className={styles.selectedColor}
      data-jscolor="{
        preset: 'dark',
        closeButton: true,
        closeText: 'OK'
      }"
      onClick={() => {
        const hex = (document.getElementById('selected-color') as HTMLInputElement)?.value;
        // Convert hex to RGB array
        let rgb: number[] = [0, 0, 0];
        if (hex && /^#([A-Fa-f0-9]{6})$/.test(hex)) {
          rgb = [
            parseInt(hex.slice(1, 3), 16),
            parseInt(hex.slice(3, 5), 16),
            parseInt(hex.slice(5, 7), 16)
          ];
        }
        const customEvent = new CustomEvent('send-color', { detail: { color: rgb } });
        window.dispatchEvent(customEvent);
        (document.getElementById('selected-color-wrap') as HTMLElement)?.style.setProperty('display', 'none');
      }}
      />
      <script src="/jscolor.min.js"></script>
    </div>

  )
}

export default colorpicker