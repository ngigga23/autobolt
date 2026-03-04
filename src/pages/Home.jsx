import React from 'react';
import { Fuel, Gauge, Settings2, Calendar } from 'lucide-react';

const Home = ({ filteredCars, selectedFilter, setSelectedFilter, filterOpen, setFilterOpen, onDetailsClick }) => {
  return (
    <div style={{ padding: '40px', backgroundColor: '#F3F4F6', minHeight: '100vh' }}>
      
      {/* HEADER SZÖVEGEK */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          Találj eladó és bérelhető autókat a közeledben
        </p>
        <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#111827', margin: '10px 0' }}>
          Találd meg álmaid autóját
        </h1>
      </div>

      {/* SZŰRŐDOBOZ */}
      <div style={{ 
        maxWidth: '850px', margin: '0 auto 50px auto', backgroundColor: 'white', 
        padding: '25px', borderRadius: '25px', boxShadow: '0 4px 25px rgba(0,0,0,0.03)' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', fontSize: '11px', fontWeight: '900', color: '#111827' }}>
          <span style={{ backgroundColor: '#000', color: '#fff', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</span>
          SZŰRÉS KATEGÓRIA SZERINT
        </div>
        <div 
          onClick={() => setFilterOpen(!filterOpen)}
          style={{ border: '1px solid #f0f0f0', padding: '18px', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {selectedFilter.toUpperCase()} <span>▼</span>
        </div>
        {filterOpen && (
          <div style={{ position: 'absolute', width: '800px', backgroundColor: 'white', marginTop: '5px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 100 }}>
            {["Összes autó", "Új autók", "Használt autók"].map(f => (
              <div key={f} onClick={() => { setSelectedFilter(f); setFilterOpen(false); }} style={{ padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #f9f9f9' }}>{f}</div>
            ))}
          </div>
        )}
      </div>

      {/* AUTÓK RÁCSA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        {filteredCars.map(car => (
          <div key={car.id} style={{ backgroundColor: 'white', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', position: 'relative' }}>
            
            {/* BADGE */}
            <div style={{
              position: 'absolute', top: '25px', left: '25px',
              backgroundColor: car.status === 'Új autók' ? '#E31E24' : '#1f2937',
              color: 'white', padding: '6px 14px', borderRadius: '10px',
              fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', zIndex: 2
            }}>
              {car.status === 'Új autók' ? 'ÚJ' : 'HASZNÁLT'}
            </div>

            <div style={{ height: '280px', cursor: 'pointer' }} onClick={() => onDetailsClick(car)}>
              <img src={car.img ? car.img.split('|||')[0] : ''} alt={car.make} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ padding: '35px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '28px', fontWeight: '900', color: '#111827' }}>
                {car.make} - {car.year}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 35px 0' }}>
                Prémium minőségű választás az Ön igényeire szabva.
              </p>

              {/* TECHNIKAI ADATOK IKONOKKAL */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px', borderTop: '1px solid #f3f4f6', paddingTop: '30px' }}>
                
                <div style={iconBoxStyle}>
                  <div style={iconCircleStyle}><Gauge size={16} color="#E31E24" /></div>
                  <div style={iconContentStyle}>
                    <span style={iconLabelStyle}>Kilométer</span>
                    <span style={iconTextStyle}>{car.km}</span>
                  </div>
                </div>

                <div style={iconBoxStyle}>
                  <div style={iconCircleStyle}><Fuel size={16} color="#E31E24" /></div>
                  <div style={iconContentStyle}>
                    <span style={iconLabelStyle}>Üzemanyag</span>
                    <span style={iconTextStyle}>{car.fuel}</span>
                  </div>
                </div>

                <div style={iconBoxStyle}>
                  <div style={iconCircleStyle}><Settings2 size={16} color="#E31E24" /></div>
                  <div style={iconContentStyle}>
                    <span style={iconLabelStyle}>Váltó</span>
                    <span style={iconTextStyle}>{car.gearbox}</span>
                  </div>
                </div>

                <div style={iconBoxStyle}>
                  <div style={iconCircleStyle}><Calendar size={16} color="#E31E24" /></div>
                  <div style={iconContentStyle}>
                    <span style={iconLabelStyle}>Évjárat</span>
                    <span style={iconTextStyle}>{car.year}</span>
                  </div>
                </div>

              </div>

              {/* ÁR ÉS GOMB */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '26px', fontWeight: '900', color: '#111827' }}>
                  {car.price.toLocaleString()} Ft
                </div>
                <button 
                  onClick={() => onDetailsClick(car)}
                  style={{ 
                    backgroundColor: '#f3f4f6', border: 'none', padding: '14px 30px', 
                    borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer',
                    color: '#6b7280', fontSize: '14px'
                  }}
                >
                  Részletek
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const iconBoxStyle = { display: 'flex', alignItems: 'center', gap: '12px' };
const iconCircleStyle = { width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const iconContentStyle = { display: 'flex', flexDirection: 'column' };
const iconLabelStyle = { fontSize: '10px', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase' };
const iconTextStyle = { fontSize: '13px', fontWeight: '800', color: '#111827' };

export default Home;