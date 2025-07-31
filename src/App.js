// import logo from './logo.svg';
import './App.css';
import'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomeComponents from './components/HomeComponent';
import RegisterComponent from './components/shipper/RegistrationComponent';
import LoginComponent from './components/LoginComponent';
import AdminDashboard from './components/AdminDashboard';
import BidComponent from './components/driver/BidComponent';
import ChatComponent from './components/ChatComponent';
import DeliveryComponent from './components/DeliveryComponent';
import DriverDashboard from './components/driver/DriverDashboard';
import PaymentComponent from './components/PaymentComponent';
import RatingComponent from './components/rating/RatingComponent';
import ShipperDashboard from './components/shipper/ShipperDashboard';
import TransactionComponent from './components/TransactionComponent';
import RegisterAdminComponent from './components/admin/RegisterAdmin';
import RegisterDriver from './components/driver/RegisterDriver';
import { UpdateDriver } from './components/driver/UpdateDriver';
import UpdateShipper from './components/shipper/UpdateShipper';
import DeleteShipper from './components/shipper/DeleteShipper';
import DeleteDriver from './components/admin/DeleteDriver';
import GetDriver from './components/admin/GetDriver';
import GetShipper from './components/admin/GetShipper';

// import NotAuthorized from './components/NotAuthorized';
// import NotFound from './components/NotFoundController';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeComponents/>} />
        <Route path='/register' element={<RegisterComponent/>}/>
        <Route path='/register-admin' element={<RegisterAdminComponent/>}/>
        <Route path='/register-driver' element={<RegisterDriver/>}/>
        <Route path='/login' element={<LoginComponent/>}/>
        <Route path='/updateDriver' element={<UpdateDriver/>}/>
        <Route path='/updateShipper' element={<UpdateShipper/>}/>

        <Route path='/deleteshipper' element={<DeleteShipper/>}/>
        <Route path='/deletedriver' element={<DeleteDriver/>}/>
        <Route path='/getdriver' element={<GetDriver/>}/>
        <Route path='/getshipper' element={<GetShipper/>}/>
        <Route path='/login' element={<LoginComponent/>}/>
        <Route path='/login' element={<LoginComponent/>}/>
        <Route path='/login' element={<LoginComponent/>}/>
        <Route path='/login' element={<LoginComponent/>}/>

        <Route path='/shipper-dashboard' element={<ShipperDashboard/>}/>
        <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
        <Route path='/driver-dashboard' element={<DriverDashboard/>}/>
        <Route path='/bid' element={<BidComponent/>}/>
        <Route path='/chat' element={<ChatComponent/>}/>
        <Route path='/delivery' element={<DeliveryComponent/>}/>
        <Route path='/payment' element={<PaymentComponent/>}/>
        <Route path='/rating' element={<RatingComponent/>}/>
        <Route path='/transaction' element={<TransactionComponent/>}/>
        {/* default routes */}
        {/* <Route path='/not-authorized' element={<NotAuthorized/>}/> */}
        {/* <Route path='*' element={<NotFound/>} /> */}

        </Routes>
    </Router>
  );
}

export default App;