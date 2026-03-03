import React, { useState } from 'react';

const CarDetails = ({ car, onBack }) => {
  if (!car) return null;

  const [expanded, setExpanded] = useState(false);

  const labelStyle = {
    color: '#6b7280',
    fontSize: '13px',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  };

  const valueStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#000'
  };

  const descriptionText =
    car.description || "Ehhez az autóhoz még nem tartozik részletes leírás.";

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>

      {/* VISSZA */}
      <button
        onClick={onBack}
        style={{
          marginBottom: '20px',
          cursor: 'pointer',
          border: 'none',
          background: 'none',
          fontWeight: 'bold'
        }}
      >
        ← Vissza a kínálathoz
      </button>

      {/* FELSŐ FŐ KÁRTYA */}
      <div
        style={{
          display: 'flex',
          gap: '40px',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '30px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          marginBottom: '30px'
        }}
      >
        {/* BAL OLDAL */}
        <div style={{ flex: 1.5 }}>
          <img
            src={car.img}
            alt={car.make}
            style={{
              width: '100%',
              height: '500px',
              objectFit: 'cover',
              borderRadius: '20px'
            }}
          />
        </div>

        {/* JOBB OLDAL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                backgroundColor: '#f3f4f6',
                display: 'inline-block',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}
            >
              {car.status}
            </div>

            <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '5px', marginTop: '-15px' }}>
              {car.make}
            </h1>

            {car.subtitle && (
              <div style={{
                color: 'grey',
                fontStyle: 'bold',
                fontSize: '15px',
                marginBottom: '15px'
              }}>
                {car.subtitle}
              </div>
            )}

            <div style={{ fontSize: '28px', color: '#E31E24', fontWeight: '900', marginBottom: '30px' }}>
              {Number(car.price).toLocaleString()} Ft
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div style={labelStyle}>Évjárat</div>
                <div style={valueStyle}>{car.year}</div>
              </div>
              <div>
                <div style={labelStyle}>Kilométer</div>
                <div style={valueStyle}>{car.km}</div>
              </div>
              <div>
                <div style={labelStyle}>Üzemanyag</div>
                <div style={valueStyle}>{car.fuel}</div>
              </div>
              <div>
                <div style={labelStyle}>Váltó</div>
                <div style={valueStyle}>{car.gearbox}</div>
              </div>
              <div>
                <div style={labelStyle}>Teljesítmény</div>
                <div style={valueStyle}>{car.teljesitmeny} LE</div>
              </div>

              <div>
                <div style={labelStyle}>Hajtás</div>
                <div style={valueStyle}>{car.hajtas}</div>
              </div>

              <div>
                <div style={labelStyle}>Csomagtér</div>
                <div style={valueStyle}>{car.csomagter} L</div>
              </div>

              <div>
                <div style={labelStyle}>Tömeg</div>
                <div style={valueStyle}>{car.tomeg} kg</div>
              </div>
              
            </div>
          </div>

          <button
            style={{
              width: '100%',
              backgroundColor: '#000',
              color: 'white',
              padding: '20px',
              borderRadius: '15px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '30px'
            }}
          >
            Érdeklődöm az autó iránt
          </button>
        </div>
      </div>

      {/* ÚJ LEÍRÁS KÁRTYA */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px 35px',
          borderRadius: '15px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
        }}
      >
        <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '15px' }}>
          Leírás
        </h3>

        <div
          style={{
            lineHeight: '1.7',
            color: '#374151',
            fontSize: '15px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: expanded ? 'unset' : 5,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {descriptionText}
        </div>

        {descriptionText.length > 20 && (
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              marginTop: '15px',
              border: 'none',
              background: 'none',
              color: '#2563eb',
              fontWeight: 'bold',
              cursor: 'pointer',
              padding: 0
            }}
          >
            {expanded ? 'Kevesebb megjelenítése ▲' : 'Bővebben ▼'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CarDetails;