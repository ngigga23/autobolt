import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminCars from './pages/AdminCars';
import AddCar from './pages/AddCar';
import EditCar from './pages/EditCar';
import CarDetails from './pages/CarDetails';
import Footer from './components/Footer';
import { getCookie, deleteCookie } from './pages/Login';

function App() {

  const [currentPage, setCurrentPage] = useState('home'); 
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => getCookie('isAdmin') === 'true'); // 🔥 cookie-ból indul
  
  const [selectedCar, setSelectedCar] = useState(null); 
  const [currentEditingCar, setCurrentEditingCar] = useState(null);

  const [cars, setCars] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState("Összes autó");
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchCars = async () => {
    try {
      const res = await fetch("http://192.168.12.102:3000/api/cars");
      const data = await res.json();

      if (Array.isArray(data)) {
        setCars(data);
      } else {
        console.error("Nem tömb jött vissza:", data);
        setCars([]);
      }

    } catch (err) {
      console.error("Hiba:", err);
      setCars([]);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const filteredCars = Array.isArray(cars)
    ? cars.filter(car => {
        if (selectedFilter === "Összes autó") return true;
        return car.status === selectedFilter;
      })
    : [];

  const deleteCar = async (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt az autót?")) {
      try {
        await fetch(`http://192.168.12.102:3000/api/cars/${id}`, {
          method: "DELETE"
        });

        fetchCars();
      } catch (err) {
        console.error("Törlési hiba:", err);
      }
    }
  };

  // 🔥 Kijelentkezés cookie törléssel
  const handleLogout = () => {
    setIsAdmin(false);
    deleteCookie('isAdmin');
    setCurrentPage('home');
  };

  const getNavStyle = (page) => ({
    border: 'none',
    backgroundColor: currentPage === page ? '#1f2937' : 'transparent',
    color: currentPage === page ? 'white' : '#6b7280',
    padding: '10px 20px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold'
  });

  const footerLinkStyle = {
    color: '#6c757d',
    textDecoration: 'none',
    padding: '0 15px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontSize: '15px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F3F4F6', fontFamily: 'sans-serif' }}>
      
      <nav style={{ 
        backgroundColor: 'white',
        padding: '15px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 1000 
      }}>
        <div
          onClick={() => setCurrentPage('home')}
          style={{ backgroundColor: 'black', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}
        >
          AUTOBOLT
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setCurrentPage('home')} style={getNavStyle('home')}>Főoldal</button>

          {isAdmin && (
            <button onClick={() => setCurrentPage('admin')} style={{ ...getNavStyle('admin'), color: '#E31E24' }}>
              Autók kezelése
            </button>
          )}

          <button onClick={() => setCurrentPage('contact')} style={getNavStyle('contact')}>Kapcsolat</button>
          <button onClick={() => setCurrentPage('about')} style={getNavStyle('about')}>Rólunk</button>
          
          {!isAdmin ? (
            <button
              onClick={() => setIsLoginOpen(true)}
              style={{ backgroundColor: '#E31E24', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Bejelentkezés
            </button>
          ) : (
            <button
              onClick={handleLogout} // 🔥 cookie-t is törli
              style={{ backgroundColor: '#111', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Kijelentkezés
            </button>
          )}
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        
        {currentPage === 'home' && (
          <Home 
            filteredCars={filteredCars}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            filterOpen={filterOpen}
            setFilterOpen={setFilterOpen}
            onDetailsClick={(car) => { setSelectedCar(car); setCurrentPage('details'); }}
          />
        )}

        {currentPage === 'details' && (
          <CarDetails car={selectedCar} onBack={() => setCurrentPage('home')} />
        )}

        {currentPage === 'admin' && isAdmin && (
          <AdminCars 
            cars={cars}
            deleteCar={deleteCar}
            onAddClick={() => setCurrentPage('add-car')}
            onEditClick={(car) => { setCurrentEditingCar(car); setCurrentPage('edit-car'); }}
          />
        )}

        {currentPage === 'add-car' && isAdmin && (
          <AddCar 
            onSave={async (newCar) => {
              try {
                await fetch("http://192.168.12.102:3000/api/cars", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(newCar)
                });

                await fetchCars();
                setCurrentPage('admin');

              } catch (err) {
                console.error("Mentési hiba:", err);
              }
            }}
            onCancel={() => setCurrentPage('admin')}
          />
        )}

        {currentPage === 'edit-car' && isAdmin && (
          <EditCar 
            car={currentEditingCar}
            onSave={() => {
              fetchCars();
              setCurrentPage('admin');
            }}
            onCancel={() => setCurrentPage('admin')} 
          />
        )}

        {currentPage === 'contact' && <Contact />}
        {currentPage === 'about' && <About />}
      </main>

      <footer style={{ backgroundColor: '#fff', borderTop: '1px solid #dee2e6', padding: '30px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', gap: '30px', padding: 0, marginBottom: '15px' }}>
            <li><button onClick={() => setCurrentPage('home')} style={footerLinkStyle}>Főoldal</button></li>
            <li><button onClick={() => setCurrentPage('contact')} style={footerLinkStyle}>Kapcsolatfelvétel</button></li>
            <li><button onClick={() => setCurrentPage('about')} style={footerLinkStyle}>Rólunk</button></li>
          </ul>
          <div style={{ borderBottom: '1px solid #eee', width: '60%', margin: '0 auto 15px auto' }}></div>
          <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>
            © 2025 Company, Inc
          </p>
        </div>
      </footer>

      {isLoginOpen && (
        <Login setIsLoginOpen={setIsLoginOpen} setIsAdmin={setIsAdmin} />
      )}
    </div>
  );
}

export default App;