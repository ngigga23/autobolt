import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminCars from './pages/AdminCars';
import AddCar from './pages/AddCar';
import EditCar from './pages/EditCar';
import CarDetails from './pages/CarDetails';
import { getCookie, deleteCookie } from './pages/Login';

function App() {

  const navigate = useNavigate();
  const location = useLocation();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => getCookie('isAdmin') === 'true');

  const [cars, setCars] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Összes autó");
  const [filterOpen, setFilterOpen] = useState(false);

  const fetchCars = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/cars");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCars(data);
      } else {
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
    ? cars.filter(car => selectedFilter === "Összes autó" ? true : car.status === selectedFilter)
    : [];

  const deleteCar = async (id) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt az autót?")) {
      try {
        await fetch(`http://localhost:3000/api/cars/${id}`, { method: "DELETE" });
        fetchCars();
      } catch (err) {
        console.error("Törlési hiba:", err);
      }
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    deleteCookie('isAdmin');
    navigate('/home');
  };

  const currentPage = location.pathname.split('/')[1] || 'home';

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
          onClick={() => navigate('/home')}
          style={{ backgroundColor: 'black', color: 'white', padding: '10px 20px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}
        >
          AUTOBOLT
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/home')} style={getNavStyle('home')}>Főoldal</button>

          {isAdmin && (
            <button onClick={() => navigate('/admin')} style={{ ...getNavStyle('admin'), color: '#E31E24' }}>
              Autók kezelése
            </button>
          )}

          <button onClick={() => navigate('/contact')} style={getNavStyle('contact')}>Kapcsolat</button>
          <button onClick={() => navigate('/about')} style={getNavStyle('about')}>Rólunk</button>

          {!isAdmin ? (
            <button
              onClick={() => setIsLoginOpen(true)}
              style={{ backgroundColor: '#E31E24', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Bejelentkezés
            </button>
          ) : (
            <button
              onClick={handleLogout}
              style={{ backgroundColor: '#111', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Kijelentkezés
            </button>
          )}
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={
            <Home
              filteredCars={filteredCars}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              onDetailsClick={(car) => navigate(`/details/${car.id}`)}
            />
          } />
          <Route path="/home" element={
            <Home
              filteredCars={filteredCars}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              onDetailsClick={(car) => navigate(`/details/${car.id}`)}
            />
          } />

          <Route path="/details/:id" element={<CarDetails onBack={() => navigate('/home')} />} />

          <Route path="/admin" element={
            isAdmin
              ? <AdminCars
                  cars={cars}
                  deleteCar={deleteCar}
                  onAddClick={() => navigate('/add-car')}
                  onEditClick={(car) => navigate(`/edit-car/${car.id}`)}
                />
              : <Home
                  filteredCars={filteredCars}
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                  filterOpen={filterOpen}
                  setFilterOpen={setFilterOpen}
                  onDetailsClick={(car) => navigate(`/details/${car.id}`)}
                />
          } />

          <Route path="/add-car" element={
            isAdmin
              ? <AddCar
                  onSave={async (newCar) => {
                    try {
                      await fetch("http://localhost:3000/api/cars", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newCar)
                      });
                      await fetchCars();
                      navigate('/admin');
                    } catch (err) {
                      console.error("Mentési hiba:", err);
                    }
                  }}
                  onCancel={() => navigate('/admin')}
                />
              : null
          } />

          <Route path="/edit-car/:id" element={
            isAdmin
              ? <EditCar onSave={() => { fetchCars(); navigate('/admin'); }} onCancel={() => navigate('/admin')} />
              : null
          } />

          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer style={{ backgroundColor: '#fff', borderTop: '1px solid #dee2e6', padding: '30px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <ul style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', gap: '30px', padding: 0, marginBottom: '15px' }}>
            <li><button onClick={() => navigate('/home')} style={footerLinkStyle}>Főoldal</button></li>
            <li><button onClick={() => navigate('/contact')} style={footerLinkStyle}>Kapcsolatfelvétel</button></li>
            <li><button onClick={() => navigate('/about')} style={footerLinkStyle}>Rólunk</button></li>
          </ul>
          <div style={{ borderBottom: '1px solid #eee', width: '60%', margin: '0 auto 15px auto' }}></div>
          <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>© 2025 Company, Inc</p>
        </div>
      </footer>

      {isLoginOpen && (
        <Login setIsLoginOpen={setIsLoginOpen} setIsAdmin={setIsAdmin} />
      )}
    </div>
  );
}

export default App;