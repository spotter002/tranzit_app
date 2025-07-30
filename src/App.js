// import logo from './logo.svg';
import './App.css';
import'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomeComponents from './components/HomeComponent';
import RegisterComponent from './components/RegistrationComponent';
import LoginComponent from './components/LoginComponent';
// import NotAuthorized from './components/NotAuthorized';
// import NotFound from './components/NotFoundController';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeComponents/>} />
        <Route path='/register' element={<RegisterComponent/>}/>
        <Route path='/login' element={<LoginComponent/>}/>
        {/* default routes */}
        {/* <Route path='/not-authorized' element={<NotAuthorized/>}/> */}
        {/* <Route path='*' element={<NotFound/>} /> */}

        </Routes>
    </Router>
  );
}

export default App;