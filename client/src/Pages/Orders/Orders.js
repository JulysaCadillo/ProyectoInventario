import React, { useEffect, useState, useRef, useCallback } from "react";
import Footer from "../../Components/Footer/Footer";
import CancelIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./Orders.css";
import { useSelector } from "react-redux";
import Navigation from "../../Components/Navigation/Navigation";
import {
    Button as MuiButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    MenuItem,
    TextField,
    DialogTitle,
} from "@mui/material";
import useAuth from "../../Hooks/useAuth";
import jwtDecode from "jwt-decode";
import axios from "axios";
import Loader from "../../Components/Loaders/Loader-FS";
import { DownloadTableExcel } from 'react-export-table-to-excel';
import SideMenu from "../../Components/SideMenu/SideMenu";

const ORDERS_URL = "/api/auth/orders";
const INVENTORY_URL = "/api/auth/inventory";
function Orders() {
    const tableRef = useRef(null);
    // COMPRUEBE SI EL USUARIO HA INICIADO SESIÓN, DE LO CONTRARIO REDIRIGIR A LA PÁGINA DE INICIO DE SESIÓN
    useAuth("INVENTORY");

    const mode = useSelector((state) => state.darkMode);
    const token = useSelector((state) => state.auth.user?.token);

    const [inventoryArray, setInventoryArray] = useState([]);
    const [ordersArray, setOrdersArray] = useState([]);
    const [ownerId, setOwnerId] = useState("");
    const [loading, setLoading] = useState(false);

    // cuadro de diálogo de opciones
    const [openOptionsDialog, setOpenOptionsDialog] = useState(false);
    const [dialogProductId, setDialogProductId] = useState("");
    const [dialogQuantity, setDialogQuantity] = useState(0);
    const [dialogOrderId, setDialogOrderId] = useState("");

    // cuadro de diálogo agregar elemento
    const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
    const [dialogFieldProductId, setDialogFieldProductId] = useState("");
    const [dialogFieldQuantity, setDialogFieldQuantity] = useState("");
    const [dialogFieldStock, setDialogFieldStock] = useState("");

    // cuadro de diálogo editar elemento
    const [opeEditItemDialog, setOpenEditItemDialog] = useState(false);
    const [dialogEditFieldProductId, setDialogEditFieldProductId] = useState("");
    const [dialogEditFieldQuantity, setDialogEditFieldQuantity] = useState("");
    const [dialogEditFieldOriginal, setDialogEditFieldOriginal] = useState("");

    // cuadro de diálogo de éxito
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [successDialogTitle, setSuccessDialogTitle] = useState("");
    const [successDialogContent, setSuccessDialogContent] = useState("");

    // controlador de diálogo de opciones
    const handleCloseOptionsDialog = () => {
        setOpenOptionsDialog(false);
    };

    // agregar controlador de diálogo de elemento
    const handleOpenAddItemDialog = () => {
        getAllProducts();
        setOpenAddItemDialog(true);
    };
    const handleCloseAddItemDialog = () => {
        setDialogFieldProductId("");
        setDialogFieldQuantity("");
        setOpenAddItemDialog(false);
    };

    // editar controlador de diálogo de elemento
    const handleHydrateEditDialog = (data) => {
        getAllProducts();
        setDialogEditFieldProductId(data.product_id);
        setDialogEditFieldQuantity(data.quantity);
        setDialogEditFieldOriginal(data.quantity);
        setOpenEditItemDialog(true);
    };
    const handleCloseEditItemDialog = () => {
        setDialogEditFieldProductId("");
        setDialogEditFieldQuantity("");
        setOpenEditItemDialog(false);
    };

    // RECOGEDORES Y MANEJADORES DE DATOS
    const getAllOrders = useCallback(() => {
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
    }, []);

    const getAllProducts = () => {
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
                    } else {
                        setInventoryArray([]);
                    }
                } else {
                    setInventoryArray([]);
                }
            })
            .catch((error) => {
                // Manejar error
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleAddNewItemSubmit = (e) => {
        e.preventDefault();
        if(dialogFieldStock >= dialogFieldQuantity){
            setOpenAddItemDialog(false);
            setLoading(true);
    
    
            let ordersBody = {
                product_id: dialogFieldProductId,
                quantity: dialogFieldQuantity,
                user_id: ownerId,
            };
    
            axios
                .post(ORDERS_URL, ordersBody, {
                    headers: {
                        "x-auth-token": token,
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    if (response.data) {
                        handleCloseAddItemDialog();
                        getAllOrders();
                        setSuccessDialogTitle("EXITOSO");
                        setSuccessDialogContent(response.data.message);
                        setOpenSuccessDialog(true);
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }else{
            setSuccessDialogContent('productos insuficiente');
            setOpenSuccessDialog(true);
        }
    };

    const handlePressEdit = (orderId) => {
        setOpenOptionsDialog(false);
        setLoading(true);

        axios
            .get(ORDERS_URL + `/${orderId}`, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    handleHydrateEditDialog(response.data[0]);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleEditItemSubmit = (e) => {
        e.preventDefault();

        for(let i = 0; i<inventoryArray.length; i++){
            if(inventoryArray[i].product_id === dialogEditFieldProductId){

                if(inventoryArray[i].stock >= (dialogEditFieldQuantity-dialogEditFieldOriginal)){
        
                setOpenEditItemDialog(false);
                setLoading(true);
        
                let ordersBody = {
                    product_id: dialogEditFieldProductId,
                    quantity: dialogEditFieldQuantity,
                    quantity_original: dialogEditFieldOriginal,
                    user_id: ownerId,
                };
        
                axios
                    .put(ORDERS_URL + `/${dialogOrderId}`, ordersBody, {
                        headers: {
                            "x-auth-token": token,
                            "Content-Type": "application/json",
                        },
                    })
                    .then((response) => {
                        if (response.data) {
                            handleCloseEditItemDialog();
                            getAllOrders();
                            setSuccessDialogTitle("EXITOSO");
                            setSuccessDialogContent(response.data.message);
                            setOpenSuccessDialog(true);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
                }else{
                    setSuccessDialogContent('productos insuficiente');
                    setOpenSuccessDialog(true);
                }
                break;
            }
        }
    };

    const handlePressDelete = () => {
        setOpenOptionsDialog(false);
        setLoading(true);

        axios
            .delete(ORDERS_URL + `/${dialogOrderId}`, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    getAllOrders();
                    setSuccessDialogTitle("EXITOSO");
                    setSuccessDialogContent(response.data.message);
                    setOpenSuccessDialog(true);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (token !== undefined) {
            let jwtData = jwtDecode(token);
            setOwnerId(jwtData.user_id);
            getAllOrders();
        }
    }, [token, getAllOrders]);

    return (
        <>
            {loading && <Loader />}
            <Navigation />
            <div className="flex h-full">
                <SideMenu />
                <div className="inventory-body-main">
                    <div className="my-[15vh] smallMobile:mx-5 mobile:mx-5 tablet:mx-0 laptop:mx-0 desktop:mx-0">
                        <div className="flex flex-row items-start justify-evenly flex-wrap m-1 smallMobile:gap-3 mobile:gap-5 tablet:gap-5 laptop:gap-0 desktop:gap-0">
                            <div
                                className="min-h-fit smallMobile:w-auto mobile:w-full tablet:w-3/4 laptop:w-auto desktop:w-auto rounded-[10px] shadow-[0_2px_4px_rgb(0_0_0_/_10%)_,_0_8px_16px_rgb(0_0_0_/_10%)] backdrop-blur-[10px] bg-[#ffffffd6] p-0 pb-8"
                                style={{
                                    backgroundColor: `${mode.bgCard}`,
                                    color: `${mode.colorCard}`,
                                }}
                            >
                                <div className="m-8 text-[20px] font-bold grid grid-cols-6 gap-2 items-center">
                                    
                                    <div
                                        className={`col-start-1 ${
                                            "smallMobile:invisible mobile:invisible tablet:visible laptop:visible desktop:visible smallMobile:font-extralight mobile:font-extralight tablet:font-bold laptop:font-bold desktop:font-bold smallMobile:text-[15px] mobile:text-[15px] tablet:text-[20px] laptop:text-[20px] desktop:text-[20px]"
                                        }`}
                                    >
                                        {ordersArray.length > 0
                                            ? `${ordersArray.length} ordenes.`
                                            : "No hay Ordenes!"}
                                    </div>
                                    <div
                                        onClick={handleOpenAddItemDialog}
                                        className="col-start-5 text-center  bg-blue-500 p-2 rounded-md cursor-pointer"
                                    >
                                        <AddIcon />
                                    </div>
                                    <div
                                        className="col-start-6 text-center  bg-blue-500 p-2 rounded-md cursor-pointer"
                                    >
                                        <DownloadTableExcel
                                            filename="ordenes"
                                            sheet="sheet1"
                                            currentTableRef={tableRef.current}
                                        >
                                        <button>
                                            <PrintIcon />
                                        </button>
                                        </DownloadTableExcel>
                                    </div>
                                </div>
                                <div className="overflow-x-auto"> {/* Enable horizontal scrolling */}
                                    <table className="tableCSS w-full h-[40vh] overflow-y-scroll text-center" ref={tableRef}>
                                        <tbody>
                                            <tr className="border-b-2 border-t-2 border-gray-300">
                                                <th>Id</th>
                                                <th>Producto</th>
                                                <th>Cantidad</th>
                                                <th>Precio Total</th>
                                                <th>Stock Actual</th>
                                                <th>Usuario</th>
                                                <th>Fecha Creacion</th>
                                                <th></th>
                                            </tr>
                                            {ordersArray.map((item, i) => (
                                                <tr
                                                    key={i}
                                                    className="hover:bg-[#b6c4c7fb] transition-all duration-300 rounded-sm border-b-2 border-t-2 border-gray-300"
                                                >
                                                    <td>{item.order_id}</td>
                                                    <td>{item.product_name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{Number(item.price) * Number(item.quantity)}</td>
                                                    <td>{item.stock}</td>
                                                    <td>{item.first_name} {item.last_name}</td>
                                                    <td>{item.created_date.split("T")[0]} {item.created_date.split("T")[1].split(".")[0]}</td>
                                                    <td>
                                                        <div
                                                            onClick={() => {
                                                                setDialogProductId(
                                                                    item.product_name
                                                                );
                                                                setDialogQuantity(
                                                                    item.quantity
                                                                );
                                                                setDialogOrderId(
                                                                    item.order_id
                                                                );
                                                                setOpenOptionsDialog(
                                                                    true
                                                                );
                                                            }}
                                                            className="mx-auto w-fit cursor-pointer"
                                                        >
                                                            <MoreVertIcon />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cuadro de diálogo Opciones */}
            <Dialog open={openOptionsDialog} onClose={handleCloseOptionsDialog}>
                <DialogContent>
                    <DialogContentText>
                        <span className="flex flex-row justify-start items-center gap-4">
                            <span className="font-bold">Producto: </span>
                        </span>
                        {dialogProductId}
                    </DialogContentText>
                    <DialogContentText>
                        <span className="flex flex-row justify-start items-center gap-4">
                            <span className="font-bold">Cantidad: </span>
                        </span>
                        {dialogQuantity}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <MuiButton
                        onClick={() => handlePressEdit(dialogOrderId)}
                        color="inherit"
                        className="flex flex-row justify-start items-center gap-4"
                    >
                        <EditIcon />
                        <span>Editar</span>
                    </MuiButton>
                    <MuiButton
                        onClick={() => handlePressDelete(dialogOrderId)}
                        color="inherit"
                    >
                        <div className="flex flex-row justify-start items-center gap-4 text-red-600">
                            <CancelIcon />
                            <span>Borrar</span>
                        </div>
                    </MuiButton>
                </DialogActions>
            </Dialog>

            {/* Cuadro de diálogo Agregar elemento*/}
            <Dialog open={openAddItemDialog} onClose={handleCloseAddItemDialog}>
                <DialogTitle>Agregar Ordenes</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        select
                        label="Producto"
                        fullWidth
                        required
                        value={dialogFieldProductId}
                        onChange={(e) => {
                            setDialogFieldProductId(e.target.value);
                            
                            for(let i = 0; i<inventoryArray.length; i++){
                                if(inventoryArray[i].product_id === e.target.value){
                                    setDialogFieldStock(inventoryArray[i].stock);
                                    break;
                                }
                            }
                        }}
                    >
                        {inventoryArray.map((category) => (
                            <MenuItem
                                key={category.product_id}
                                value={category.product_id}
                            >
                                {category.product_name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        margin="dense"
                        label="Cantidad"
                        fullWidth
                        required
                        value={dialogFieldQuantity}
                        onChange={(e) => setDialogFieldQuantity(e.target.value)}
                    />
                </DialogContent>
                <DialogActions className="mt-2">
                    <MuiButton
                        onClick={handleCloseAddItemDialog}
                        color="primary"
                        className="mr-2"
                    >
                        Cancelar
                    </MuiButton>
                    <MuiButton onClick={handleAddNewItemSubmit} color="primary">
                        Agregar
                    </MuiButton>
                </DialogActions>
            </Dialog>

            {/* Cuadro de diálogo Editar elemento*/}
            <Dialog
                open={opeEditItemDialog}
                onClose={handleCloseEditItemDialog}
            >
                <DialogTitle>Editar Orden</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        select
                        label="Producto"
                        fullWidth
                        required
                        value={dialogEditFieldProductId}
                        onChange={(e) => {
                            setDialogEditFieldProductId(e.target.value);
                        }}
                    >
                        {inventoryArray.map((product) => (
                            <MenuItem
                                key={product.product_id}
                                value={product.product_id}
                            >
                                {product.product_name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        margin="dense"
                        label="Cantidad"
                        fullWidth
                        required
                        value={dialogEditFieldQuantity}
                        onChange={(e) => setDialogEditFieldQuantity(e.target.value)}
                    />
                </DialogContent>
                <DialogActions className="mt-2">
                    <MuiButton
                        onClick={handleCloseEditItemDialog}
                        color="primary"
                        className="mr-2"
                    >
                        Cancelar
                    </MuiButton>
                    <MuiButton onClick={handleEditItemSubmit} color="primary">
                        Actualizar
                    </MuiButton>
                </DialogActions>
            </Dialog>

            {/* Cuadro de diálogo ÉXITO de confirmación */}
            <Dialog
                open={openSuccessDialog}
                onClose={() => setOpenSuccessDialog(false)}
            >
                <DialogTitle>{successDialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {successDialogContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <MuiButton
                        onClick={() => setOpenSuccessDialog(false)}
                        color="primary"
                        autoFocus
                    >
                        OK
                    </MuiButton>
                </DialogActions>
            </Dialog>

            <Footer />
        </>
    );
}

export default Orders;
