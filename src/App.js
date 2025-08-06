// import logo from './logo.svg';
import './App.css';
import'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoutes from './context/ProtectedRoutes';
import RegisterComponent from './components/RegisterComponent';
import LoginComponent from './components/LoginComponent';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components//admin/AdminDashboard';
import NotAuthorized from './components/NotAuthorized';
import NotFound from './components/NotFoundController';
import HomeComponent from './components/HomeComponent';
import ShipperLayout from './components/shipper/ShipperLayout';
import ShipperDashboard from './components/shipper/ShipperDashboard';
import DriverDasboard from './components/driver/DriverDasboard';
import DriverLayout from './components/driver/DriverLayout';
// Admin pages
import Bid from './components/admin/Bid';
import Deliveries from './components/admin/Deliveries';
import Driver from './components/admin/Driver';
import Shipper from './components/admin/Shipper';
import Transactions from './components/admin/Transactions';
import Wallet from './components/admin/Wallet';
import Featured from './components/admin/Featured';
import AddDriver from './components/admin/forms/DriverAdd';
import EditDriver from './components/admin/forms/DriverEdit';
import EditShipper from './components/admin/forms/shipperEdit';
// import AddShipper from './components/admin/forms/shipperAdd';
import ShipperAdd from './components/admin/forms/ShipperAdd';

// import NotAuthorized from './components/NotAuthorized';
// import NotFound from './components/NotFoundController';



function App() {
  return (
    <Router>
      {/* we wrap all routes inside the AuthProvider */}
      <AuthProvider>

      <Routes>
        <Route path="/" element={<HomeComponent/>} />

        {/* Admin protected routes */}
        <Route path='admin-dashboard' element={<ProtectedRoutes allowedRoles={['admin']}>
          <AdminLayout/>
        </ProtectedRoutes>}>

        <Route path='' element={<AdminDashboard/>} />
        <Route path='bids' element={<Bid/>} />
        <Route path='deliveries' element={<Deliveries/>} />

        
          <Route path='drivers' element={<Driver/>} />
         <Route path='drivers/add' element={<AddDriver/>} />
          <Route path='drivers/edit' element={<EditDriver/>} />

        <Route path='featured' element={<Featured/>} />

        
        <Route path='shippers' element={<Shipper/>} />
        <Route path='shippers/add' element={<ShipperAdd/>} />
        <Route path='shippers/edit' element={<EditShipper/>} />

        <Route path='transactions' element={<Transactions/>} />
        <Route path='wallet' element={<Wallet/>} />
        </Route>

        {/* shipper and admin protected routes */}
        <Route path='shipper-dashboard' element={<ProtectedRoutes allowedRoles={['admin','shipper']}>
          <ShipperLayout/>
        </ProtectedRoutes>}>

        <Route path='' element={<ShipperDashboard/>} />
        </Route>


        {/* driver and admin protected routes */}
        <Route path='driver-dashboard' element={<ProtectedRoutes allowedRoles={['admin','driver']}>
          <DriverLayout/>
        </ProtectedRoutes>}>

        <Route path='' element={<DriverDasboard/>} />
        </Route>


        <Route path='/register' element={<RegisterComponent/>}/>
        <Route path='/login' element={<LoginComponent/>}/>
        {/* default routes */}
        <Route path='/not-authorized' element={<NotAuthorized/>}/>
        <Route path='*' element={<NotFound/>} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;