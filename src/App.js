import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserList from './components/UserList';
import './App.css';

function App() {
  return (
    <div className="App">
      <UserList />
      <ToastContainer />
    </div>
  );
}

export default App;