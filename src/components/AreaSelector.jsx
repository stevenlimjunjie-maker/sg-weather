export function AreaSelector({ areas, selected, onChange }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <label style={{ display: 'block', fontSize: '10px', fontWeight: '600', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Select your area
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={selected}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 36px 8px 12px',
            fontSize: '14px',
            fontFamily: 'inherit',
            fontWeight: '500',
            border: '1px solid #E0E0E0',
            borderRadius: '10px',
            background: '#FAFAFA',
            color: '#1A1A1A',
            appearance: 'none',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="">Choose an area...</option>
          {areas.map(a => (
            <option key={a.name} value={a.name}>{a.name}</option>
          ))}
        </select>
        <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888', fontSize: '11px' }}>
          ▼
        </span>
      </div>
    </div>
  )
}
