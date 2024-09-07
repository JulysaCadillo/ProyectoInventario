import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "../../Components/Form/Form";
import "./Login.css";
import Logo from "../../Components/Logo/Logo";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../State";
import useAuth from "../../Hooks/useAuth";

const LOGIN_URL = "/api/login";

function Login() {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const { loginSuccess } = bindActionCreators(actionCreators, dispatch);

    // ESTADOS
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [inputError, setInputError] = useState(false);
    const [forgot, setForgot] = useState(false);

    // MANEJAR LA AUTENTICACIÓN Y LA NAVEGACIÓN
    useAuth("AUTH");

    const forgotAction = (e) => {
        e.preventDefault();
        alert("Enviaste una solicitud para restablecer la contraseña.")
    }
    // HANDLERS
    const handleLogin = (e) => {
        e.preventDefault();

        if (email === "") {
            setInputError(true);
            setEmailError("La entrada de correo electrónico no puede estar vacía");
        }

        if (password === "") {
            setInputError(true);
            setPasswordError("La entrada de contraseña no puede estar vacía");
        }
        if (inputError === false) {
            let loginBody = JSON.stringify({ email, password });
            axios
                .post(LOGIN_URL, loginBody, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    if (response.data.success) {
                        localStorage.setItem("authToken", response.data.token);
                        clearFields();

                        loginSuccess(response.data);

                        //Navegue a la página deseada
                        navigate("/", { replace: true });
                    }else {
                        // Si no se recibe "success" en la respuesta
                        setPasswordError(response.data.message);
                    }
                })
                .catch((error) => {
                    if (error.response) {
                        // El servidor respondió con un estado distinto de 2xx
                        setPasswordError(error.response.data.message || "Error en el servidor. Inténtalo de nuevo.");
                    } else if (error.request) {
                        // No se recibió respuesta
                        setPasswordError("No se recibió respuesta del servidor. Verifica tu conexión a Internet.");
                    } else {
                        // Algo sucedió al configurar la solicitud que disparó un error
                        setPasswordError("Se produjo un error. Inténtalo de nuevo.");
                    }
                });
        }
    };

    const clearFields = () => {
        setEmail("");
        setEmailError("");
        setPassword("");
        setPasswordError("");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900 login-body-content-left">
        <h1 className="mb-8 smallMobile:text-[20px] mobile:text-[30px] tablet:text-[30px] laptop:text-[50px] desktop:text-[60px]"> SISTEMA DE INVENTARIO </h1>
        <div className="w-[90%] max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <Logo />
                {!forgot ? (<Form 
                    
                    formData={{
                        inputs: [
                            {
                                key: "email",
                                type: "email",
                                name: "email",
                                placeholder: "Ingrese su correo electronico",
                                handler: (e) => setEmail(e.target.value),
                                error: emailError,
                            },
                            {
                                key: "password",
                                type: "password",
                                name: "password",
                                placeholder: "Ingresa tu contraseña",
                                handler: (e) => setPassword(e.target.value),
                                error: passwordError,
                            },
                        ],
                    }}
                    formButton={"Ingresar"}
                    handlers={{
                        formHandler: handleLogin,
                    }}
                />):(<Form 
                    
                    formData={{
                        inputs: [
                            {
                                key: "email",
                                type: "email",
                                name: "email",
                                placeholder: "Ingrese su correo electronico",
                                handler: (e) => setEmail(e.target.value),
                                error: emailError,
                            },
                        ],
                    }}
                    formButton={"Entregar"}
                    handlers={{
                        formHandler: forgotAction,
                    }}
                />)}
                
                    <div className="fieldDiv py-[0.5rem] px-12">
                        <button
                            onClick={()=>setForgot(!forgot)}
                            className="auth-form-forgotpassword no-underline p-0 text-black border-0"
                        >
                            Olvidaste la contrasena?
                        </button>
                    </div>
            </div>
        </div>
    );
}

export default Login;
