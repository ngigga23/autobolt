import React, { useState } from 'react';

const AddCar = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    make: '',
    subtitle: '',
    price: '',
    year: '',
    km: '',
    fuel: 'Benzin',
    gearbox: 'Manuális',
    csomagter: '',
    tomeg: '',
    hajtas: 'Elsőkerék',
    teljesitmeny: '',
    status: 'Új autók',
    img: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'price' || name === 'year') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, img: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '15px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    marginBottom: '15px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: '8px',
    color: '#6b7280'
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '30px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
    }}>
      <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '30px' }}>
        Új autó hozzáadása
      </h2>

      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>

        <label style={labelStyle}>Autó megnevezése</label>
        <input
          name="make"
          value={formData.make}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Pl: Opel Corsa C"
          required
        />

        <label style={labelStyle}>Alcím (rövid jellemzés)</label>
        <input
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          style={inputStyle}
          placeholder="Pl: Exclusive belső, újszerű állapot..."
        />

        {/* Ár + Évjárat */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
          <div>
            <label style={labelStyle}>Ár (Ft)</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Évjárat</label>
            <input
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* KM + Üzemanyag */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
          <div>
            <label style={labelStyle}>Kilométer</label>
            <input
              name="km"
              type="text"
              value={formData.km}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Pl: 120000"
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Üzemanyag</label>
            <select
              name="fuel"
              value={formData.fuel}
              onChange={handleChange}
              style={inputStyle}
            >
              <option>Benzin</option>
              <option>Dízel</option>
              <option>Hibrid</option>
              <option>Elektromos</option>
            </select>
          </div>
        </div>

        {/* Váltó + Státusz */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
          <div>
            <label style={labelStyle}>Váltó</label>
            <select
              name="gearbox"
              value={formData.gearbox}
              onChange={handleChange}
              style={inputStyle}
            >
              <option>Manuális</option>
              <option>Automata</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Státusz</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={inputStyle}
            >
              <option>Új autók</option>
              <option>Használt autók</option>
            </select>
          </div>
        </div>

        {/* Csomagtér + Tömeg */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
          <div>
            <label style={labelStyle}>Csomagtér (L)</label>
            <input
              type="number"
              name="csomagter"
              value={formData.csomagter}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Tömeg (kg)</label>
            <input
              type="number"
              name="tomeg"
              value={formData.tomeg}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
        </div>

        {/* Hajtás + Teljesítmény */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px' }}>
          <div>
            <label style={labelStyle}>Hajtás</label>
            <select
              name="hajtas"
              value={formData.hajtas}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option>Elsőkerék</option>
              <option>Hátsókerék</option>
              <option>Összkerék</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Teljesítmény (LE)</label>
            <input
              type="number"
              name="teljesitmeny"
              value={formData.teljesitmeny}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </div>
        </div>

        <label style={labelStyle}>Kép feltöltése</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: '20px' }}
          required
        />

        <label style={labelStyle}>Leírás</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          style={{ ...inputStyle, height: '120px' }}
          placeholder="Felszereltség, állapot..."
          required
        />

        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
          <button
            type="submit"
            style={{
              flex: 2,
              backgroundColor: '#E31E24',
              color: 'white',
              padding: '15px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Mentés
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              backgroundColor: '#f3f4f6',
              padding: '15px',
              borderRadius: '12px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Mégse
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddCar;