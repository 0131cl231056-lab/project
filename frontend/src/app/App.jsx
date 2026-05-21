import { RouterProvider } from 'react-router'
import { useEffect } from "react";
import { useAuth} from '../features/auth/hook/useAuth';
import { routes } from './app.routes'
import "./App.css"

function App() {
  const { handleGetMe } = useAuth();

    useEffect(() => {
        handleGetMe();
    }, []);

  return (
      <RouterProvider router={routes} />
  )
}

export default App
