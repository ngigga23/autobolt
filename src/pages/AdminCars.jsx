import React from 'react';
const AdminCars = ({ cars, deleteCar, onAddClick, onEditClick }) => {
  console.log(cars);
  
  const tableHeaderStyle = { padding: '15px 20px', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', color: '#374151', textAlign: 'left', borderBottom: '2px solid #f3f4f6' };
  const tableDataStyle = { padding: '15px 20px', fontSize: '14px', borderBottom: '1px solid #f3f4f6' };
  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900' }}>Autók kezelése</h1>
        <button 
          onClick={onAddClick}
          style={{ backgroundColor: 'green', color: 'white', padding: '12px 25px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + Új autó hozzáadása
        </button>
      </div>
      <div style={{ backgroundColor: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={tableHeaderStyle}>ID</th>
              <th style={tableHeaderStyle}>Fotó</th>
              <th style={tableHeaderStyle}>Megnevezés</th>
              <th style={tableHeaderStyle}>Ár</th>
              <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car.id} style={{ transition: '0.2s' }}>
                <td style={tableDataStyle}>#{car.id}</td>
                <td style={tableDataStyle}>
                  <img src={car.img ? car.img.split('|||')[0] : ''} alt={car.make} style={{ width: '50px', height: '35px', borderRadius: '6px', objectFit: 'cover' }} />
                </td>
                <td style={tableDataStyle}>
                  <div style={{ fontWeight: 'bold' }}>{car.make}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>{car.status}</div>
                </td>
                <td style={{ ...tableDataStyle, fontWeight: 'bold' }}>{car.price.toLocaleString()} Ft</td>
                <td style={{ ...tableDataStyle, textAlign: 'right' }}>
                  <button 
                    onClick={() => onEditClick(car)}
                    style={{ backgroundColor: '#1f2937', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', marginRight: '8px', fontWeight: 'bold' }}
                  >
                    Módosítás
                  </button>
                  <button 
                    onClick={() => deleteCar(car.id)}
                    style={{ backgroundColor: '#E31E24', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Törlés
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminCars;