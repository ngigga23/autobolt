import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SEP = '|||';

const EditCar = ({ onSave, onCancel }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeField, setActiveField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedField, setSavedField] = useState(null);
  const [images, setImages] = useState([]);
  const [imgSaving, setImgSaving] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/cars/${id}`);
        const data = await res.json();
        setFormData(data);
        setImages(data.img ? data.img.split(SEP).filter(Boolean) : []);
      } catch (err) {
        console.error("Hiba:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const saveImages = async (newImages) => {
    setImgSaving(true);
    const imgString = newImages.join(SEP);
    const updatedCar = { ...formData, img: imgString };
    setFormData(updatedCar);
    try {
      await fetch(`http://localhost:3000/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCar)
      });
    } catch (err) {
      alert('Hiba történt a képek mentésekor!');
    } finally {
      setImgSaving(false);
    }
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => {
          const updated = [...prev, reader.result];
          saveImages(updated);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleDeleteImage = (index) => {
    if (!window.confirm("Biztosan törlöd ezt a képet?")) return;
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    saveImages(updated);
  };

  const saveField = async (name) => {
    const finalValue = (name === 'price' || name === 'year') ? Number(tempValue) : tempValue;
    const updatedCar = { ...formData, [name]: finalValue };
    setFormData(updatedCar);
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:3000/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCar)
      });
      if (!res.ok) throw new Error();
      setSavedField(name);
      setTimeout(() => setSavedField(null), 2000);
    } catch {
      alert('Hiba történt a mentés során!');
    } finally {
      setSaving(false);
    }
    setActiveField(null);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px', fontSize: '18px', color: '#9ca3af' }}>Betöltés...</div>;
  if (!formData) return <div style={{ textAlign: 'center', padding: '80px', fontSize: '18px', color: '#9ca3af' }}>Az autó nem található.</div>;

  const rowStyle = { display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 0', borderBottom: '1px solid #f0f0f0' };
  const labelStyle = { fontSize: '11px', fontWeight: '900', color: '#9ca3af', textTransform: 'uppercase', width: '130px' };
  const valueStyle = { fontSize: '16px', fontWeight: 'bold', color: '#111827', flex: 1 };
  const inputStyle = { padding: '10px 15px', borderRadius: '10px', border: '2px solid #E31E24', outline: 'none', flex: 1, fontSize: '15px' };
  const editBtnStyle = { backgroundColor: '#f3f4f6', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', color: '#4b5563' };
  const saveBtnStyle = { backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };
  const cancelBtnStyle = { backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

  const EditableRow = ({ label, name, type = "text", isSelect = false, options = [], multiline = false }) => {
    const isEditing = activeField === name;
    const justSaved = savedField === name;
    return (
      <div style={{ ...rowStyle, alignItems: (multiline && isEditing) ? 'flex-start' : 'center', backgroundColor: justSaved ? '#f0fdf4' : 'transparent', transition: 'background-color 0.3s', borderRadius: '8px' }}>
        <div style={{ ...labelStyle, paddingTop: (multiline && isEditing) ? '12px' : '0' }}>{label}</div>
        {isEditing ? (
          <>
            {isSelect ? (
              <select value={tempValue} onChange={(e) => setTempValue(e.target.value)} style={inputStyle}>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : multiline ? (
              <textarea value={tempValue} onChange={(e) => setTempValue(e.target.value)} style={{ ...inputStyle, resize: 'vertical', minHeight: '150px', lineHeight: '1.6', fontFamily: 'sans-serif' }} autoFocus />
            ) : (
              <input type={type} value={tempValue} onChange={(e) => setTempValue(e.target.value)} style={inputStyle} autoFocus />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: multiline ? '12px' : '0' }}>
              <button onClick={() => saveField(name)} style={saveBtnStyle} disabled={saving}>{saving ? '...' : 'Mentés'}</button>
              <button onClick={() => setActiveField(null)} style={cancelBtnStyle}>Mégse</button>
            </div>
          </>
        ) : (
          <>
            <div style={{ ...valueStyle, whiteSpace: multiline ? 'pre-wrap' : 'normal' }}>
              {justSaved && <span style={{ color: '#10b981', fontSize: '12px', marginRight: '8px' }}>✓ Mentve</span>}
              {name === 'price' ? `${Number(formData[name]).toLocaleString()} Ft` : formData[name]}
            </div>
            <button onClick={() => { setActiveField(name); setTempValue(formData[name]); }} style={editBtnStyle}>Módosítás</button>
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

        {/* KÉPEK */}
        <div style={{ ...rowStyle, alignItems: 'flex-start' }}>
          <div style={{ ...labelStyle, paddingTop: '8px' }}>Képek</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={img} alt="" style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: '10px', border: i === 0 ? '3px solid #E31E24' : '2px solid #eee' }} />
                  {i === 0 && <div style={{ position: 'absolute', top: '4px', left: '4px', backgroundColor: '#E31E24', color: 'white', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>FŐ</div>}
                  <button onClick={() => handleDeleteImage(i)} style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>
              ))}
              <label style={{ width: '100px', height: '70px', borderRadius: '10px', border: '2px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9ca3af', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '24px' }}>+</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold' }}>Hozzáadás</span>
                <input type="file" multiple accept="image/*" onChange={handleAddImages} style={{ display: 'none' }} />
              </label>
            </div>
            {imgSaving && <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>⏳ Mentés...</div>}
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>Az első kép lesz a borítókép. Egyszerre több is feltölthető.</div>
          </div>
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
        <EditableRow label="Leírás" name="description" multiline />

        <div style={{ marginTop: '40px', borderTop: '2px solid #f3f4f6', paddingTop: '30px' }}>
          <button onClick={onSave} style={{ width: '100%', backgroundColor: '#111', color: 'white', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            Vissza az autók kezeléséhez (Kész vagyok)
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCar;