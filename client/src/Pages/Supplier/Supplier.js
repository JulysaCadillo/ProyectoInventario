import React, { useEffect, useState, useRef } from "react";
import Footer from "../../Components/Footer/Footer";
import CancelIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./Supplier.css";
import { useSelector } from "react-redux";
import Navigation from "../../Components/Navigation/Navigation";
import {
    Button as MuiButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    TextField,
    DialogTitle,
} from "@mui/material";
import useAuth from "../../Hooks/useAuth";
import jwtDecode from "jwt-decode";
import axios from "axios";
import Loader from "../../Components/Loaders/Loader-FS";
import { DownloadTableExcel } from 'react-export-table-to-excel';
import SideMenu from "../../Components/SideMenu/SideMenu";

const SUPPLIER_URL = "/api/supplier";

function Supplier() {
    const tableRef = useRef(null);
    // COMPRUEBE SI EL USUARIO HA INICIADO SESIÓN, DE LO CONTRARIO REDIRIGIR A LA PÁGINA DE INICIO DE SESIÓN
    useAuth("INVENTORY");

    const mode = useSelector((state) => state.darkMode);
    const token = useSelector((state) => state.auth.user?.token);

    const [supplierArray, setSupplierArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("");

    // cuadro de diálogo de opciones
    const [openOptionsDialog, setOpenOptionsDialog] = useState(false);
    const [dialogSupplierName, setDialogSupplierName] = useState("");
    const [dialogSupplierEmail, setDialogSupplierEmail] = useState("");
    const [dialogSupplierPhone, setDialogSupplierPhone] = useState("");
    const [dialogSupplierId, setDialogSupplierId] = useState("");

    // cuadro de diálogo agregar elemento
    const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
    const [dialogFieldSupplierName, setDialogFieldSupplierName] = useState("");
    const [dialogFieldSupplierEmail, setDialogFieldSupplierEmail] = useState("");
    const [dialogFieldSupplierPhone, setDialogFieldSupplierPhone] = useState("");

    // cuadro de diálogo editar elemento
    const [opeEditItemDialog, setOpenEditItemDialog] = useState(false);
    const [dialogEditFieldSupplierName, setDialogEditFieldSupplierName] = useState("");
    const [dialogEditFieldSupplierEmail, setDialogEditFieldSupplierEmail] = useState("");
    const [dialogEditFieldSupplierPhone, setDialogEditFieldSupplierPhone] = useState("");

    // cuadro de diálogo de éxito
    const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
    const [successDialogTitle, setSuccessDialogTitle] = useState("");
    const [successDialogContent, setSuccessDialogContent] = useState("");

    // controlador de diálogo de opciones
    const handleCloseOptionsDialog = () => {
        setOpenOptionsDialog(false);
    };

    //  agregar controlador de diálogo de elemento
    const handleOpenAddItemDialog = () => {
        setOpenAddItemDialog(true);
    };
    const handleCloseAddItemDialog = () => {
        setDialogFieldSupplierEmail("");
        setDialogFieldSupplierName("");
        setDialogFieldSupplierPhone("");
        setOpenAddItemDialog(false);
    };

    // editar controlador de diálogo de elemento
    const handleHydrateEditDialog = (data) => {
        setDialogEditFieldSupplierName(data.supplier_name);
        setDialogEditFieldSupplierEmail(data.supplier_email);
        setDialogEditFieldSupplierPhone(data.supplier_phone);
        setOpenEditItemDialog(true);
    };
    const handleCloseEditItemDialog = () => {
        setDialogEditFieldSupplierName("");
        setDialogEditFieldSupplierEmail("");
        setDialogEditFieldSupplierPhone("");
        setOpenEditItemDialog(false);
    };

    // RECOGEDORES Y MANEJADORES DE DATOS
    const getAllItems = () => {
        axios
            .get(SUPPLIER_URL)
            .then((response) => {
                if (response.data) {
                    setSupplierArray(response.data.data);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleAddNewItemSubmit = (e) => {
        e.preventDefault();

        setOpenAddItemDialog(false);
        setLoading(true);

        let supplierBody = {
            supplier_name: dialogFieldSupplierName,
            supplier_email: dialogFieldSupplierEmail,
            supplier_phone: dialogFieldSupplierPhone,
        };

        axios
            .post(SUPPLIER_URL, supplierBody, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    handleCloseAddItemDialog();
                    getAllItems();
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

    const handlePressEdit = (supplierId) => {
        setOpenOptionsDialog(false);
        setLoading(true);

        axios
            .get(SUPPLIER_URL + `/${supplierId}`, {
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

        setOpenEditItemDialog(false);
        setLoading(true);

        let supplierBody = {
            supplier_name: dialogEditFieldSupplierName,
            supplier_email: dialogEditFieldSupplierEmail,
            supplier_phone: dialogEditFieldSupplierPhone,
        };

        axios
            .put(SUPPLIER_URL + `/${dialogSupplierId}`, supplierBody, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    handleCloseEditItemDialog();
                    getAllItems();
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

    const handlePressDelete = () => {
        setOpenOptionsDialog(false);
        setLoading(true);

        axios
            .delete(SUPPLIER_URL + `/${dialogSupplierId}`, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    getAllItems();
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
            setRole(jwtData.permission);
            getAllItems();
        }
    }, [token]);

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
                                        {supplierArray.length > 0
                                            ? `${supplierArray.length} proveedores.`
                                            : "No hay Proveedores!"}
                                    </div>
                                    {role === 2 && (<div
                                        onClick={handleOpenAddItemDialog}
                                        className="col-start-5 text-center  bg-blue-500 p-2 rounded-md cursor-pointer"
                                    >
                                        <AddIcon />
                                    </div>)}
                                    <div
                                        className="col-start-6 text-center  bg-blue-500 p-2 rounded-md cursor-pointer"
                                    >
                                        <DownloadTableExcel
                                            filename="proveedor"
                                            sheet="sheet1"
                                            currentTableRef={tableRef.current}
                                        >
                                        <button>
                                            <PrintIcon />
                                        </button>
                                        </DownloadTableExcel>
                                    </div>
                                    {}
                                </div>
                                <div className="overflow-x-auto"> {/* Enable horizontal scrolling */}
                                    <table className="tableCSS w-full h-[40vh] overflow-y-scroll text-center" ref={tableRef}>
                                        <tbody>
                                            <tr className="border-b-2 border-t-2 border-gray-300">
                                                <th>Id</th>
                                                <th>Proveedor</th>
                                                <th>Email</th>
                                                <th>Telefono</th>
                                                {role === 2 && (<th></th>)}
                                            </tr>
                                            {supplierArray.map((item, i) => (
                                                <tr
                                                    key={i}
                                                    className="hover:bg-[#96b7f3 ] transition-all duration-300 rounded-sm border-b-2 border-t-2 border-gray-300"
                                                >
                                                    <td>{item.supplier_id}</td>
                                                    <td>{item.supplier_name}</td>
                                                    <td>{item.supplier_email}</td>
                                                    <td>{item.supplier_phone}</td>
                                                    {role === 2 && (<td>
                                                        <div
                                                            onClick={() => {
                                                                setDialogSupplierEmail(
                                                                    item.supplier_email
                                                                );
                                                                setDialogSupplierName(
                                                                    item.supplier_name
                                                                );
                                                                setDialogSupplierPhone(
                                                                    item.supplier_phone
                                                                );
                                                                setDialogSupplierId(
                                                                    item.supplier_id
                                                                );
                                                                setOpenOptionsDialog(
                                                                    true
                                                                );
                                                            }}
                                                            className="mx-auto w-fit cursor-pointer"
                                                        >
                                                            <MoreVertIcon />
                                                        </div>
                                                    </td>)}
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
                            <span className="font-bold">Proveedor: </span>
                        </span>
                        {dialogSupplierName}
                    </DialogContentText>
                    <DialogContentText>
                        <span className="flex flex-row justify-start items-center gap-4">
                            <span className="font-bold">Email: </span>
                        </span>
                        {dialogSupplierEmail}
                    </DialogContentText>
                    <DialogContentText>
                        <span className="flex flex-row justify-start items-center gap-4">
                            <span className="font-bold">Telefono: </span>
                        </span>
                        {dialogSupplierPhone}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <MuiButton
                        onClick={() => handlePressEdit(dialogSupplierId)}
                        color="inherit"
                        className="flex flex-row justify-start items-center gap-4"
                    >
                        <EditIcon />
                        <span>Editar</span>
                    </MuiButton>
                    <MuiButton
                        onClick={() => handlePressDelete(dialogSupplierId)}
                        color="inherit"
                    >
                        <div className="flex flex-row justify-start items-center gap-4 text-red-600">
                            <CancelIcon />
                            <span>Borrar</span>
                        </div>
                    </MuiButton>
                </DialogActions>
            </Dialog>

            {/* Cuadro de diálogo Agregar elemento */}
            <Dialog open={openAddItemDialog} onClose={handleCloseAddItemDialog}>
                <DialogTitle>Agregar Proveedor</DialogTitle>
                <DialogContent>

                    <TextField
                        margin="dense"
                        label="Proveedor"
                        fullWidth
                        required
                        value={dialogFieldSupplierName}
                        onChange={(e) => setDialogFieldSupplierName(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        required
                        value={dialogFieldSupplierEmail}
                        onChange={(e) => setDialogFieldSupplierEmail(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Telefono"
                        fullWidth
                        required
                        value={dialogFieldSupplierPhone}
                        onChange={(e) => setDialogFieldSupplierPhone(e.target.value)}
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
                <DialogTitle>Editar Proveedor</DialogTitle>
                <DialogContent>

                    <TextField
                        margin="dense"
                        label="Proveedor"
                        fullWidth
                        required
                        value={dialogEditFieldSupplierName}
                        onChange={(e) => setDialogEditFieldSupplierName(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        required
                        value={dialogEditFieldSupplierEmail}
                        onChange={(e) => setDialogEditFieldSupplierEmail(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Telefono"
                        fullWidth
                        required
                        value={dialogEditFieldSupplierPhone}
                        onChange={(e) => setDialogEditFieldSupplierPhone(e.target.value)}
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

export default Supplier;
