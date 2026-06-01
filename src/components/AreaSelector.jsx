export function AreaSelector({ areas, selected, onChange }) {
  return (
    <div style={{ padding: '0 16px 16px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#888', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Select your area
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={selected}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 40px 12px 14px',
            fontSize: '16px',
            fontFamily: 'inherit',
            fontWeight: '500',
            border: '1px solid #E0E0E0',
            borderRadius: '12px',
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
        <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888', fontSize: '12px' }}>
          ▼
        </span>
      </div>
    </div>
  )
}
