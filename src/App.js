import './App.css';
import React from 'react';
import AppointmentForm from './components/AppointmentForm';

function App() {
  return (
    <div className="App">
      <header className="bg-blue-500 text-white py-4">
        <h1 className="text-center text-3xl font-bold">Gestión de Citas Médicas</h1>
      </header>
      <main className="p-4">
        <AppointmentForm />
      </main>
    </div>
  );
}

export default App;
