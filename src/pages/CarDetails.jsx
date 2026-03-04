import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Gauge, Fuel, Settings2, Zap, Navigation, Package, Weight } from 'lucide-react';

const SEP = '|||';

const CarDetails = ({ onBack }) => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [imgFullscreen, setImgFullscreen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/cars/${id}`);
        const data = await res.json();
        setCar(data);
      } catch (err) {
        console.error("Hiba az autó betöltésekor:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setImgFullscreen(false);
      if (e.key === 'ArrowRight') setActiveImg(i => Math.min(i + 1, images.length - 1));
      if (e.key === 'ArrowLeft') setActiveImg(i => Math.max(i - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', fontSize: '18px', color: '#9ca3af' }}>Betöltés...</div>;
  if (!car) return <div style={{ textAlign: 'center', padding: '80px', fontSize: '18px', color: '#9ca3af' }}>Az autó nem található.</div>;

  const images = car.img ? car.img.split(SEP).filter(Boolean) : [];
  const descriptionText = car.description || "Ehhez az autóhoz még nem tartozik részletes leírás.";

  const StatBox = ({ icon: Icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
      <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color="#E31E24" />
      </div>
      <div>
        <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#111827' }}>{value}</div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>

      {/* TELJESKÉPERNYŐS MODAL */}
      {imgFullscreen && (
        <div onClick={() => setImgFullscreen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
          <button onClick={() => setImgFullscreen(false)} style={{ position: 'absolute', top: '20px', right: '28px', background: 'none', border: 'none', color: 'white', fontSize: '36px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
          {activeImg > 0 && (
            <button onClick={(e) => { e.stopPropagation(); setActiveImg(i => i - 1); }} style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', fontSize: '32px', cursor: 'pointer', borderRadius: '50%', width: '52px', height: '52px' }}>‹</button>
          )}
          {activeImg < images.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); setActiveImg(i => i + 1); }} style={{ position: 'absolute', right: '20px', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', fontSize: '32px', cursor: 'pointer', borderRadius: '50%', width: '52px', height: '52px' }}>›</button>
          )}
          <img src={images[activeImg]} alt={car.make} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 0 60px rgba(0,0,0,0.5)' }} />
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', color: 'white', fontSize: '14px', fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.4)', padding: '6px 14px', borderRadius: '20px' }}>
            {activeImg + 1} / {images.length}
          </div>
        </div>
      )}

      {/* VISSZA */}
      <button onClick={onBack} style={{ marginBottom: '20px', cursor: 'pointer', border: 'none', background: 'none', fontWeight: 'bold' }}>
        ← Vissza a kínálathoz
      </button>

      {/* FŐ KÁRTYA */}
      <div style={{ display: 'flex', gap: '40px', backgroundColor: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', marginBottom: '30px' }}>

        {/* BAL - GALÉRIA */}
        <div style={{ flex: 1.5, display: 'flex', gap: '12px' }}>
          {images.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '80px', flexShrink: 0 }}>
              {images.map((img, i) => (
                <img key={i} src={img} alt="" onClick={() => setActiveImg(i)}
                  style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer', border: activeImg === i ? '3px solid #E31E24' : '2px solid transparent', opacity: activeImg === i ? 1 : 0.6, transition: 'all 0.2s' }}
                />
              ))}
            </div>
          )}
          <div style={{ flex: 1, position: 'relative' }}>
            <img
              src={images[activeImg] || ''}
              alt={car.make}
              onClick={() => setImgFullscreen(true)}
              style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '20px', cursor: 'zoom-in', transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.target.style.opacity = '0.9'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            />
            <div style={{ position: 'absolute', bottom: '45px', right: '15px', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', pointerEvents: 'none' }}>
              🔍 Kattints a nagyításhoz
            </div>
            {activeImg > 0 && (
              <button onClick={() => setActiveImg(i => i - 1)} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', borderRadius: '50%', width: '40px', height: '40px' }}>‹</button>
            )}
            {activeImg < images.length - 1 && (
              <button onClick={() => setActiveImg(i => i + 1)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.4)', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer', borderRadius: '50%', width: '40px', height: '40px' }}>›</button>
            )}
          </div>
        </div>

        {/* JOBB - ADATOK */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ backgroundColor: '#f3f4f6', display: 'inline-block', padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}>{car.status}</div>
            <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '5px', marginTop: '-15px' }}>{car.make}</h1>
            {car.subtitle && <div style={{ color: 'grey', fontSize: '15px', marginBottom: '15px' }}>{car.subtitle}</div>}
            <div style={{ fontSize: '28px', color: '#E31E24', fontWeight: '900', marginBottom: '25px' }}>{Number(car.price).toLocaleString()} Ft</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <StatBox icon={Calendar}   label="Évjárat"      value={car.year} />
              <StatBox icon={Gauge}      label="Kilométer"    value={car.km} />
              <StatBox icon={Fuel}       label="Üzemanyag"    value={car.fuel} />
              <StatBox icon={Settings2}  label="Váltó"        value={car.gearbox} />
              <StatBox icon={Zap}        label="Teljesítmény" value={`${car.teljesitmeny} LE`} />
              <StatBox icon={Navigation} label="Hajtás"       value={car.hajtas} />
              <StatBox icon={Package}    label="Csomagtér"    value={`${car.csomagter} L`} />
              <StatBox icon={Weight}     label="Tömeg"        value={`${car.tomeg} kg`} />
            </div>
          </div>

          <button style={{ width: '100%', backgroundColor: '#000', color: 'white', padding: '20px', borderRadius: '15px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '20px' }}>
            Érdeklődöm az autó iránt
          </button>
        </div>
      </div>

      {/* LEÍRÁS */}
      <div style={{ backgroundColor: 'white', padding: '30px 35px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '15px' }}>Leírás</h3>
        <div style={{ lineHeight: '1.7', color: '#374151', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
          {expanded || descriptionText.length <= 150 ? descriptionText : descriptionText.slice(0, 150) + '...'}
        </div>
        {descriptionText.length > 150 && (
          <button onClick={() => setExpanded(!expanded)} style={{ marginTop: '15px', border: 'none', background: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}>
            {expanded ? 'Kevesebb megjelenítése ▲' : 'Bővebben ▼'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CarDetails;