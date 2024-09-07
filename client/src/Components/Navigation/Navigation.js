import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import InventoryIcon from '@mui/icons-material/Inventory';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CategoryIcon from '@mui/icons-material/Category';
import GroupIcon from '@mui/icons-material/Group';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from "@mui/icons-material/Logout";
import DehazeIcon from "@mui/icons-material/Dehaze";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../../State/index";
import Logo from "../Logo/Logo";
import jwtDecode from "jwt-decode";
import Loader from "../Loaders/Loader-FS";


function Navigation() {
    let navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    let mode = useSelector((state) => state.darkMode);
    if(mode.bgNavbar === null){
        mode.bgNavbar = '#2261d6';
    }
    const token = useSelector((state) => state.auth.user?.token);

    const dispatch = useDispatch();
    const [mobileMenu, setMobileMenu] = useState(false);
    const [accountMenu, setAccountMenu] = useState(false);
    const accountMenuRef = useRef(null);

    const handleClickOutside = (event) => {
        if (
            accountMenuRef.current &&
            !accountMenuRef.current.contains(event.target)
        ) {
            setAccountMenu(false);
        }
    };

    const [ownerEmail, setOwnerEmail] = useState("");


    useEffect(() => {
        let jwtData = null;
        if (token !== undefined) {
            jwtData = jwtDecode(token);
            setOwnerEmail(jwtData.email);
        }

        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, [token]);

    // UTILICE REDUX PARA OBTENER EL ESTADO DE INICIO DE SESIÓN
    const isLoginIn = useSelector((state) => state.auth.isAuthenticated);

    // SALIENDO DE TU CUENTA
    const { logout } = bindActionCreators(actionCreators, dispatch);

    const handleLogout = () => {
        setLoading(true);
        localStorage.removeItem("authToken");
        logout();

        setTimeout(() => {
            setLoading(false);
            navigate("/");
        }, 800);
    };

    return (
        <>
            {loading && <Loader />}
            <section
                id="headSection"
                style={{ backgroundColor: `#fff` }}
                className="w-[100vw] fixed top-0 z-[999] flex flex-row items-center justify-between h-[8vh] smallMobile:p-0 mobile:p-0 tablet:px-[5vw] laptop:px-[5vw] desktop:px-[5vw] shadow-[0_1px_1px_rgba(0,0,0,0.1)] backdrop-blur-[30px]"
            >
                {/* Código de navbar normal */}
                {/* Flex item 1 */}
                <div className="navbar noMobile-navbar flex flex-row justify-center">
                    <Link
                        to={"/"}
                        className="no-underline text-black py-0 px-[1.55rem] text-[1rem] cursor-pointer"
                    >
                        <Logo style={{ color: `${mode.colorNavbar}` }} />
                    </Link>
                  
                </div>

                {/* Flex item 2 */}
                <div className="navbar flex flex-row justify-center">
                    {/* codigo navbar normal */}
                    <div className="noMobile-navbar-links flex flex-row justify-center smallMobile:hidden mobile:hidden tablet:hidden laptop:block desktop:block">
                        
                        {!isLoginIn ? (
                            <>
                                <Link
                                    to={"/auth/login"}
                                    style={{ color: `${mode.colorNavbar}` }}
                                    className="no-underline text-black py-0 px-[1.55rem] text-[1rem] cursor-pointer"
                                >
                                    Login
                                </Link>
                            </>
                        ) : (
                            <span
                                className="text-black py-0 px-[1.55rem] text-[1rem]"
                                onClick={() => {
                                    setAccountMenu(!accountMenu);
                                }}
                            >
                                {accountMenu === false ? (
                                    <AccountCircleIcon
                                        style={{ color: `${mode.colorNavbar}` }}
                                        className="cursor-pointer"
                                    />
                                ) : (
                                    <CloseIcon
                                        style={{ color: `${mode.colorNavbar}` }}
                                        className="cursor-pointer"
                                    />
                                )}
                                {accountMenu && (
                                    <div
                                        ref={accountMenuRef}
                                        style={{                                         

                                            backgroundColor:  "#3B82F6" ,
                                        }}
                                        className="navbar-account-menu-box absolute flex flex-col justify-center items-center py-[8px] top-[7.8vh] right-[6.4vw] w-[20%] rounded-[5px] shadow-[0_3px_10px_rgba(0,0,0,0.2)]"
                                    >
                                        <span
                                            style={{
                                                color: `${mode.colorNavbar}`,
                                            }}
                                            className="p-2 text-[14px] border-b-[1px] border-black border-solid w-[90%]"
                                        >
                                            <span>Usuario: </span>
                                            <span>{ownerEmail}</span>
                                        </span>
                                        {}  
                                        <div
                                            style={{
                                                color: `${mode.colorNavbar}`,
                                                borderBottom: "none",
                                            }}
                                            className="no-underline text-black p-2 text-[1rem] cursor-pointer border-b-[1px] border-black border-solid w-[90%] rounded-[2px]"
                                            onClick={handleLogout}
                                        >
                                            Cerrar sesion
                                        </div>
                                    </div>
                                )}
                            </span>
                        )}
                    </div>

                    {/*  codigo Menu  */}
                    <div
                        className="mobile-navbar-links flex-col justify-center items-center pr-[6vw] smallMobile:flex mobile:flex tablet:flex laptop:hidden desktop:hidden"
                        style={{ color: `${mode.colorNavbar}` }}
                    >
                        <span
                            onClick={() => {
                                setMobileMenu(!mobileMenu);
                            }}
                        >
                            {mobileMenu ? <CloseIcon /> : <DehazeIcon />}
                        </span>
                        {mobileMenu && (
                            <div
                                className="mobile-navbar-links-box absolute flex flex-col justify-center items-center top-[8vh] left-0 w-[100%] tablet:h-[98vh] shadow-[0_8px_10px_rgba(0,0,0,0.2)]"
                                style={{
                                    backgroundColor: `${mode.bgNavbar.substring(
                                        0,
                                        7
                                    )}`,
                                }}
                            >
                                {}
                                {!isLoginIn ? (
                                    <>
                                        <Link
                                            to={"/auth/login"}
                                            style={{
                                                color: `${mode.colorNavbar}`,
                                            }}
                                            onClick={() => {
                                                setMobileMenu(!mobileMenu);
                                            }}
                                            className="no-underline text-black p-4 text-[1rem] cursor-pointer border-b-[1px] border-black border-solid w-[90%]"
                                        >
                                            Login
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                    <div
                                        style={{
                                            color: `${mode.colorNavbar}`,
                                            borderBottom: "none",
                                        }}
                                        className="no-underline text-black p-4 text-[1.5rem] cursor-pointer border-b-[1px] border-black border-solid w-[90%]"
                                        onClick={()=>navigate("/")}
                                    >
                                      <HomeIcon />  Panel
                                    </div>
                                    <div
                                        style={{
                                            color: `${mode.colorNavbar}`,
                                            borderBottom: "none",
                                        }}
                                        className="no-underline text-black p-4 text-[1.5rem] cursor-pointer border-b-[1px] border-black border-solid w-[90%]"
                                        onClick={()=>navigate("/inventory")}
                                    >
                                      <InventoryIcon />  Productos
                                    </div>
                                    <div
                                        style={{
                                            color: `${mode.colorNavbar}`,
                                            borderBottom: "none",
                                        }}
                                        className="no-underline text-black p-4 text-[1.5rem] cursor-pointer border-b-[1px] border-black border-solid w-[90%]"
                                        onClick={()=>navigate("/category")}
                                    >
                                      <CategoryIcon />  Categoria
                                    </div>
                                    <div
                                        style={{
                                            color: `${mode.colorNavbar}`,
                                            borderBottom: "none",
                                        }}
                                        className="no-underline text-black p-4 text-[1.5rem] cursor-pointer border-b-[1px] border-black border-solid w-[90%]"
                                        onClick={()=>navigate("/orders")}
                                    >
                                      <LoyaltyIcon />  Ordenes
                                    </div>
                                    <div
                                        style={{
                                            color: `${mode.colorNavbar}`,
                                            borderBottom: "none",
                                        }}
                                        className="no-underline text-black p-4 text-[1.5rem] cursor-pointer border-b-[1px] border-black border-solid w-[90%]"
                                        onClick={()=>navigate("/supplier")}
                                    >
                                      <StorefrontIcon />  Proveedor
                                    </div>
                                    <div
                                        style={{
                                            color: `${mode.colorNavbar}`,
                                            borderBottom: "none",
                                        }}
                                        className="no-underline text-black p-4 text-[1.5rem] cursor-pointer border-b-[1px] border-black border-solid w-[90%]"
                                        onClick={()=>navigate("/users")}
                                    >
                                      <GroupIcon />  Usuario
                                    </div>
                                    <div
                                        style={{
                                            color: `${mode.colorNavbar}`,
                                            borderBottom: "none",
                                        }}
                                        className="no-underline text-black p-4 text-[1.5rem] cursor-pointer border-b-[1px] border-black border-solid w-[90%]"
                                        onClick={handleLogout}
                                    >
                                      <LogoutIcon />  Iniciar sesion
                                    </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Navigation;
