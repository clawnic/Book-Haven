import {createBrowserRouter} from 'react-router-dom';
import App from '../App'
import Home from "../pages/home/Home"
import Login from ".././components/Login"
import Signup from ".././components/Signup"
import Cart from '../pages/Books/Cart'
import Checkout from '../pages/Books/Checkout'
import SingleBook from '../pages/Books/SingleBook'
import PrivateRoute from './PrivateRoute';
import Orders from '../pages/Books/Orders';
import AdminRoute from "./admin.route";
import AdminLogin from "../components/AdminLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import AddBook from "../pages/dashboard/addBook/AddBook";
import UpdateBook from "../pages/dashboard/EditBook/UpdateBook";
import UserDashboard from "../pages/dashboard/users/UserDashboard";


const router = createBrowserRouter([
    {
        path:"/",
        element:<App/>,
        children:[
            {
                path:"/",
                element: <Home/>
            },{
                path:"/about",
                element: <h1>About</h1>
            },{
                path:"/login",
                element: <Login/>
            },{
                path:"/signup",
                element: <Signup/>
            },{
                path:"/cart",
                element: <Cart/>
            },{
                path:"/checkout",
                element:<PrivateRoute><Checkout/></PrivateRoute> 
            },{
                path:"/books/:id",
                element: <SingleBook/>
            },{
                path:"/orders",
                element: <PrivateRoute><Orders/></PrivateRoute> 
            }
        ]
    },{
        path:"/dashboard",
        element:<AdminRoute><DashboardLayout/></AdminRoute>,
        children:[
            {
                path:"",
                element:<AdminRoute><Dashboard/></AdminRoute>
            },{
                path:"add-new-book",
                element:<AdminRoute><AddBook/></AdminRoute>
            },{
                path:"edit-book/:id",
                element:<AdminRoute><UpdateBook/></AdminRoute>
            },{
                path:"manage-books",
                element: <AdminRoute><ManageBooks/></AdminRoute>
            }
        ]

    },{
        path:"/admin",
        element: <AdminLogin/>
    },{
        path:"/user-dashboard",
        element: <UserDashboard/>
    }
])

export default router;