export default function CoinIcon({ code, png, color, size = 34 }) {
  const bg = color || '#333'
  const src = png || null

  return (
    <div
      className="coin-icon"
      style={{
        background: bg,
        color: '#fff',
        padding: 0,
        overflow: 'hidden',
        borderRadius: '50%',
        width: size,
        height: size,
        flexShrink: 0,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={code || ''}
          style={{ width: '100%', height: '100%', borderRadius: '50%', display: 'block', objectFit: 'cover' }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size > 30 ? 14 : 12,
            fontWeight: 'bold',
          }}
        >
          {code ? code.charAt(0) : '?'}
        </div>
      )}
    </div>
  )
}
