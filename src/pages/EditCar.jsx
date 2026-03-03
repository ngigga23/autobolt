import React, { useState, useEffect } from 'react';

const EditCar = ({ car, onSave, onCancel }) => {
  const [formData, setFormData] = useState(car);
  const [activeField, setActiveField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [previewImg, setPreviewImg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedField, setSavedField] = useState(null); // visszajelzéshez

  useEffect(() => {
    setFormData(car);
  }, [car]);

  const saveField = async (name, valueOverride = null) => {
    const finalValue = valueOverride !== null
      ? valueOverride
      : (name === 'price' || name === 'year') ? Number(tempValue) : tempValue;

    const updatedCar = { ...formData, [name]: finalValue };
    setFormData(updatedCar);

    setSaving(true);
    try {
      const res = await fetch(`http://192.168.12.102:3000/api/cars/${car.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCar)
      });

      if (!res.ok) throw new Error('Hiba a mentéskor');

      setSavedField(name); // zöld visszajelzés
      setTimeout(() => setSavedField(null), 2000);
    } catch (err) {
      console.error('Mentési hiba:', err);
      alert('Hiba történt a mentés során!');
    } finally {
      setSaving(false);
    }

    if (name === 'img') setPreviewImg(null);
    setActiveField(null);
  };

  const handleFilePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const rowStyle = { display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 0', borderBottom: '1px solid #f0f0f0' };
  const labelStyle = { fontSize: '11px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', width: '130px' };
  const valueStyle = { fontSize: '16px', fontWeight: 'bold', color: '#111827', flex: 1 };
  const inputStyle = { padding: '10px 15px', borderRadius: '10px', border: '2px solid #E31E24', outline: 'none', flex: 1, fontSize: '15px' };
  const editBtnStyle = { backgroundColor: '#f3f4f6', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#4b5563' };
  const saveBtnStyle = { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
  const cancelBtnStyle = { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

  const EditableRow = ({ label, name, type = "text", isSelect = false, options = [] }) => {
    const isEditing = activeField === name;
    const justSaved = savedField === name;

    return (
      <div style={{ ...rowStyle, backgroundColor: justSaved ? '#f0fdf4' : 'transparent', transition: 'background-color 0.3s', borderRadius: '8px' }}>
        <div style={labelStyle}>{label}</div>
        {isEditing ? (
          <>
            {isSelect ? (
              <select value={tempValue} onChange={(e) => setTempValue(e.target.value)} style={inputStyle}>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input type={type} value={tempValue} onChange={(e) => setTempValue(e.target.value)} style={inputStyle} autoFocus />
            )}
            <button onClick={() => saveField(name)} style={saveBtnStyle} disabled={saving}>
              {saving ? '...' : 'Mentés'}
            </button>
            <button onClick={() => setActiveField(null)} style={cancelBtnStyle}>Mégse</button>
          </>
        ) : (
          <>
            <div style={valueStyle}>
              {justSaved && <span style={{ color: '#10b981', fontSize: '12px', marginRight: '8px' }}>✓ Mentve</span>}
              {name === 'price' ? `${Number(formData[name]).toLocaleString()} Ft` : formData[name]}
            </div>
            <button onClick={() => { setActiveField(name); setTempValue(formData[name]); }} style={editBtnStyle}>
              Módosítás
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '35px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '10px' }}>Autó szerkesztése</h2>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '30px' }}>A mentés után ezen az oldalon maradsz.</p>

        {/* KÉP SZERKESZTÉS */}
        <div style={rowStyle}>
          <div style={labelStyle}>Borítókép</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img
              src={previewImg || formData.img}
              alt="Car"
              style={{ width: '120px', height: '80px', borderRadius: '12px', objectFit: 'cover', border: previewImg ? '3px solid #10b981' : '1px solid #eee' }}
            />
            {previewImg && (
              <div style={{ display: 'flex', gap: '5px' }}>
                <button onClick={() => saveField('img', previewImg)} style={saveBtnStyle} disabled={saving}>
                  {saving ? '...' : 'Kép Mentése'}
                </button>
                <button onClick={() => setPreviewImg(null)} style={cancelBtnStyle}>Mégse</button>
              </div>
            )}
          </div>
          {!previewImg && (
            <label style={{ ...editBtnStyle, cursor: 'pointer', backgroundColor: '#111', color: 'white' }}>
              Új kép választása
              <input type="file" onChange={handleFilePreview} style={{ display: 'none' }} />
            </label>
          )}
        </div>

        <EditableRow label="Megnevezés" name="make" />
        <EditableRow label="Alcím" name="subtitle" />
        <EditableRow label="Vételár" name="price" type="number" />
        <EditableRow label="Évjárat" name="year" type="number" />
        <EditableRow label="Kilométer" name="km" />
        <EditableRow label="Üzemanyag" name="fuel" isSelect options={["Benzin", "Dízel", "Hibrid", "Elektromos"]} />
        <EditableRow label="Váltó" name="gearbox" isSelect options={["Manuális", "Automata"]} />
        <EditableRow label="Csomagtér (L)" name="csomagter" />
        <EditableRow label="Tömeg (kg)" name="tomeg" />
        <EditableRow label="Hajtás" name="hajtas" isSelect options={["Elsőkerék", "Hátsókerék", "Összkerék"]} />
        <EditableRow label="Teljesítmény (LE)" name="teljesitmeny" />

        <div style={{ marginTop: '40px', borderTop: '2px solid #f3f4f6', paddingTop: '30px' }}>
          <button
            onClick={onSave} // fetchCars() + visszanavigálás az App.jsx-ben
            style={{ width: '100%', backgroundColor: '#111', color: 'white', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Vissza az autók kezeléséhez (Kész vagyok)
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCar;