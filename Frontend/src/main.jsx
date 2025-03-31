import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routers/router.jsx';
import  'sweetalert2/dist/sweetalert2.js';
import { AuthProvider } from './context/Auth.context.jsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.js';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </Provider>,
)