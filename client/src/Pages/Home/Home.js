import React, { useEffect, useState } from "react";
import Footer from "../../Components/Footer/Footer";
import "./Home.css";
import Navigation from "../../Components/Navigation/Navigation";
import BarChart from "../../Components/Chart/BarChart";
import PieChart from "../../Components/Chart/PieChart";
import useAuth from "../../Hooks/useAuth";
import SideMenu from "../../Components/SideMenu/SideMenu";
import { useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import axios from "axios";

const INVENTORY_URL = "/api/auth/inventory";
const ORDERS_URL = "/api/auth/orders";

function Home() {
    const mode = useSelector((state) => state.darkMode);
    // COMPROBAR SI EL USUARIO ESTÁ INICIADO SESIÓN, DE LO CONTRARIO REDIRECCIONAR A LA PÁGINA DE INICIO DE SESIÓN
    useAuth("INVENTORY");
    const [ownerEmail, setOwnerEmail] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const token = useSelector((state) => state.auth.user?.token);
    const [inventoryArray, setInventoryArray] = useState([]);
    const [ordersArray, setOrdersArray] = useState([]);
    const [loading, setLoading] = useState(false);


    const getAllItems = (user_id) => {
        setLoading(true);

        axios
            .get(INVENTORY_URL, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    if (!response.data.success) {
                        setInventoryArray(response.data);
                        console.log(loading);
                    } else {
                        setInventoryArray([]);
                    }
                } else {
                    setInventoryArray([]);
                }
            })
            .catch((error) => {
                //Manejar error
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getAllOrders = () => {
        setLoading(true);

        axios
            .get(ORDERS_URL, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    if (!response.data.success) {
                        setOrdersArray(response.data);
                    } else {
                        setOrdersArray([]);
                    }
                } else {
                    setOrdersArray([]);
                }
            })
            .catch((error) => {
                // Manejar error
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        let jwtData = null;
        if (token !== undefined) {
            jwtData = jwtDecode(token);
            setOwnerEmail(jwtData.email);
            setOwnerName(jwtData.first_name + " " + jwtData.last_name);
            getAllItems(jwtData.user_id);
            getAllOrders();
        }
    }, [token]);

    return (
        <>
            <Navigation />
            <div className="flex h-full">
                <SideMenu />
                <div className="inventory-body-main">
                    <div className="my-[15vh] smallMobile:mx-5 mobile:mx-5 tablet:mx-0 laptop:mx-0 desktop:mx-0">
                        <div className="flex flex-row items-start justify-evenly flex-wrap m-2  smallMobile:gap-3 mobile:gap-5 tablet:gap-5 laptop:gap-0 desktop:gap-0">
                            <div
                                className="min-h-fit rounded-[10px] shadow-[0_2px_4px_rgb(0_0_0_/_10%)_,_0_8px_16px_rgb(0_0_0_/_10%)] backdrop-blur-[10px] bg-[#ffffffd6] p-11"
                                style={{
                                    backgroundColor: `${mode.bgCard}`,
                                    color: "#000",
                                }}
                            >
                                <div className="m-8 text-[20px] font-bold grid grid-cols-6 gap-2 items-center">
                       
                                    <div
                                        className={`col-start-1`}
                                    >
                                      
                                      👋 BIENVENIDO 
                                    </div>
                                    <div
                                        className={`col-start-1`}
                                    >
                                      
                                        {ownerEmail} 
                                    </div>
                                    <div
                                        className={`col-start-1`}
                                    >
                                      
                                        {ownerName} 
                                    </div>
                                </div>
                                
                            </div>

                            <div className="mt-2 p-1 grid grid-cols-1 gap-4 smallMobile:grid-cols-1 mobile:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-2 desktop:grid-cols-2">
                                {/* Card 1 */}
                                <div
                                    className="min-h-fit rounded-[10px] shadow-[0_2px_4px_rgb(0_0_0_/_10%)_,_0_8px_16px_rgb(0_0_0_/_10%)] backdrop-blur-[10px] bg-[#ffffffd6] p-4"
                                    style={{
                                        backgroundColor: `${mode.bgCard}`,
                                        color: "#000",
                                    }}
                                >
                                    <BarChart products={inventoryArray} />
                                </div>

                                {/* Card 2 */}
                                <div
                                    className="min-h-fit rounded-[10px] shadow-[0_2px_4px_rgb(0_0_0_/_10%)_,_0_8px_16px_rgb(0_0_0_/_10%)] backdrop-blur-[10px] bg-[#ffffffd6] p-4"
                                    style={{
                                        backgroundColor: `${mode.bgCard}`,
                                        color: "#000",
                                    }}
                                >
                                    <PieChart orders={ordersArray} />
                                </div>
                            </div>
                                                     
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Home;
