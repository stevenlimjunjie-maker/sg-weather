import { useEffect, useState } from 'react'

export function Toast({ message, onDismiss }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 2500)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? '0' : '20px'})`,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s, transform 0.3s',
      background: '#1A1A1A',
      color: '#FFF',
      padding: '10px 20px',
      borderRadius: '24px',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: 1000,
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    }}>
      {message}
    </div>
  )
}
