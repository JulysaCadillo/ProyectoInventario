// useAuth.js
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useAuth = (page) => {
    const navigate = useNavigate();

    // USO REDUX PARA OBTENER EL ESTADO DE INICIO DE SESIÓN
    const isLogIn = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        const checkAuthAndNavigate = () => {
            switch (page) {
                default:
                    if (!isLogIn) {
                        navigate("/auth/login", { replace: true });
                    }
                    break;
                case "INVENTORY": {
                    if (!isLogIn) {
                        navigate("/auth/login", { replace: true });
                    }
                    break;
                }
                case "AUTH": {
                    if (isLogIn) {
                        navigate("/", { replace: true });
                    }
                    break;
                }
            }
        };

        checkAuthAndNavigate();

        return;
    }, [isLogIn, page]);
};

export default useAuth;
