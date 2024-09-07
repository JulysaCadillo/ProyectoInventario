import React, { useEffect, useState, useRef, useCallback  } from "react";
import Footer from "../../Components/Footer/Footer";
import CancelIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./Users.css";
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

const USER_URL = "/api/auth/user";

function Users() {
    const tableRef = useRef(null);
    // COMPRUEBE SI EL USUARIO HA INICIADO SESIÓN, DE LO CONTRARIO REDIRIGIR A LA PÁGINA DE INICIO DE SESIÓN
    useAuth("INVENTORY");

    const mode = useSelector((state) => state.darkMode);
    const token = useSelector((state) => state.auth.user?.token);

    const [userArray, setUserArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("");

    // cuadro de diálogo de opciones
    const [openOptionsDialog, setOpenOptionsDialog] = useState(false);
    const [dialogUserId, setDialogUserId] = useState("");
    const [dialogUserEmail, setDialogUserEmail] = useState("");
    const [dialogUserPhone, setDialogUserPhone] = useState("");
    const [dialogUserFirst, setDialogUserFirst] = useState("");
    const [dialogUserLast, setDialogUserLast] = useState("");
    const [dialogUserPermission, setDialogUserPermission] = useState("");

    // cuadro de diálogo agregar elemento
    const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
    const [dialogFieldUserEmail, setDialogFieldUserEmail] = useState("");
    const [dialogFieldUserPhone, setDialogFieldUserPhone] = useState("");
    const [dialogFieldUserFirst, setDialogFieldUserFirst] = useState("");
    const [dialogFieldUserLast, setDialogFieldUserLast] = useState("");
    const [dialogFieldUserPassword, setDialogFieldUserPassword] = useState("");
    const [dialogFieldUserPermission, setDialogFieldUserPermission] = useState("");

    // cuadro de diálogo editar elemento
    const [opeEditItemDialog, setOpenEditItemDialog] = useState(false);
    const [dialogEditFieldUserEmail, setDialogEditFieldUserEmail] = useState("");
    const [dialogEditFieldUserPhone, setDialogEditFieldUserPhone] = useState("");
    const [dialogEditFieldUserFirst, setDialogEditFieldUserFirst] = useState("");
    const [dialogEditFieldUserLast, setDialogEditFieldUserLast] = useState("");
    const [dialogEditFieldUserPassword, setDialogEditFieldUserPassword] = useState("");
    const [dialogEditFieldUserPermission, setDialogEditFieldUserPermission] = useState("");

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
        setOpenAddItemDialog(true);
    };
    const handleCloseAddItemDialog = () => {
        setDialogFieldUserEmail("");
        setDialogFieldUserPhone("");
        setDialogFieldUserFirst("");
        setDialogFieldUserLast("");
        setDialogFieldUserPassword("");
        setDialogFieldUserPermission("");
        setOpenAddItemDialog(false);
    };

    // editar controlador de diálogo de elemento
    const handleHydrateEditDialog = (data) => {
        setDialogEditFieldUserEmail(data.email);
        setDialogEditFieldUserPhone(data.phone);
        setDialogEditFieldUserFirst(data.first_name);
        setDialogEditFieldUserLast(data.last_name);
        setDialogEditFieldUserPassword(data.password);
        setDialogEditFieldUserPermission(data.permission_id);
        setOpenEditItemDialog(true);
    };
    const handleCloseEditItemDialog = () => {
        setDialogEditFieldUserEmail("");
        setDialogEditFieldUserPhone("");
        setDialogEditFieldUserFirst("");
        setDialogEditFieldUserLast("");
        setDialogEditFieldUserPassword("");
        setDialogEditFieldUserPermission("");
        setOpenEditItemDialog(false);
    };

    // RECOGEDORES Y MANEJADORES DE DATOS
    const getAllUser = useCallback(() => {
        setLoading(true);

        axios
            .get(USER_URL, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    if (!response.data.success) {
                        setUserArray(response.data);
                    } else {
                        setUserArray([]);
                    }
                } else {
                    setUserArray([]);
                }
            })
            .catch((error) => {
                // manejar error
            })
            .finally(() => {
                setLoading(false);
            });
    },[]);

    const handleAddNewItemSubmit = (e) => {
        e.preventDefault();

        setOpenAddItemDialog(false);
        setLoading(true);

        let userBody = {
            email: dialogFieldUserEmail,
            phone: dialogFieldUserPhone,
            first_name: dialogFieldUserFirst,
            last_name: dialogFieldUserLast,
            password: dialogFieldUserPassword,
            permission: dialogFieldUserPermission,
        };

        axios
            .post(USER_URL, userBody, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    handleCloseAddItemDialog();
                    getAllUser();
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

    const handlePressEdit = (itemId) => {
        setOpenOptionsDialog(false);
        setLoading(true);

        axios
            .get(USER_URL + `/${itemId}`, {
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

        let userBody = {
            email: dialogEditFieldUserEmail,
            phone: dialogEditFieldUserPhone,
            first_name: dialogEditFieldUserFirst,
            last_name: dialogEditFieldUserLast,
            password: dialogEditFieldUserPassword,
            permission: dialogEditFieldUserPermission,
        };

        axios
            .put(USER_URL + `/${dialogUserId}`, userBody, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    handleCloseEditItemDialog();
                    getAllUser();
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
            .delete(USER_URL + `/${dialogUserId}`, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    getAllUser();
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
            getAllUser();
        }
    }, [token, getAllUser]);

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
                                        {userArray.length > 0
                                            ? `${userArray.length} usuarios.`
                                            : "No hay Usuarios!"}
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
                                            filename="usuario"
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
                                                <th>Email</th>
                                                <th>Nombre</th>
                                                <th>Apellido</th>
                                                <th>Telefono</th>
                                                <th>Permiso</th>
                                                {role === 2 && (<th></th>)}
                                            </tr>
                                            {userArray.map((item, i) => (
                                                <tr
                                                    key={i}
                                                    className="hover:bg-[#96b7f3 ] transition-all duration-300 rounded-sm border-b-2 border-t-2 border-gray-300"
                                                >
                                                    <td>{item.id}</td>
                                                    <td>{item.email}</td>
                                                    <td>{item.first_name}</td>
                                                    <td>{item.last_name}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.permission_name}</td>
                                                    {role === 2 && (<td>
                                                        <div
                                                            onClick={() => {
                                                                setDialogUserEmail(
                                                                    item.email
                                                                );
                                                                setDialogUserFirst(
                                                                    item.first_name
                                                                );
                                                                setDialogUserPhone(
                                                                    item.phone
                                                                );
                                                                setDialogUserLast(
                                                                    item.last_name
                                                                );
                                                                setDialogUserPermission(
                                                                    item.permission_name
                                                                );
                                                                setDialogUserId(
                                                                    item.id
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
                            <span className="font-bold">Email: </span>
                        </span>
                        {dialogUserEmail}
                    </DialogContentText>
                    <DialogContentText>
                        <span className="flex flex-row justify-start items-center gap-4">
                            <span className="font-bold">Nombre: </span>
                        </span>
                        {dialogUserFirst} {dialogUserLast}
                    </DialogContentText>
                    <DialogContentText>
                        <span className="flex flex-row justify-start items-center gap-4">
                            <span className="font-bold">Telefono: </span>
                        </span>
                        {dialogUserPhone}
                    </DialogContentText>
                    <DialogContentText>
                        <span className="flex flex-row justify-start items-center gap-4">
                            <span className="font-bold">Permiso: </span>
                        </span>
                        {dialogUserPermission}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <MuiButton
                        onClick={() => handlePressEdit(dialogUserId)}
                        color="inherit"
                        className="flex flex-row justify-start items-center gap-4"
                    >
                        <EditIcon />
                        <span>Editar</span>
                    </MuiButton>
                    <MuiButton
                        onClick={() => handlePressDelete(dialogUserId)}
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
                <DialogTitle>Agregar Usuario</DialogTitle>
                <DialogContent>

                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        required
                        value={dialogFieldUserEmail}
                        onChange={(e) => setDialogFieldUserEmail(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        required
                        value={dialogFieldUserFirst}
                        onChange={(e) => setDialogFieldUserFirst(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Apellido"
                        fullWidth
                        required
                        value={dialogFieldUserLast}
                        onChange={(e) => setDialogFieldUserLast(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Password"
                        fullWidth
                        required
                        value={dialogFieldUserPassword}
                        onChange={(e) => setDialogFieldUserPassword(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Telefono"
                        fullWidth
                        required
                        value={dialogFieldUserPhone}
                        onChange={(e) => setDialogFieldUserPhone(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        select
                        label="Permiso"
                        fullWidth
                        required
                        value={dialogFieldUserPermission}
                        onChange={(e) => setDialogFieldUserPermission(e.target.value)}
                    >
                        <MenuItem key={1} value={1}>User</MenuItem>
                        <MenuItem key={2} value={2}>Admin</MenuItem>
                    </TextField>
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
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>

                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        required
                        value={dialogEditFieldUserEmail}
                        onChange={(e) => setDialogEditFieldUserEmail(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        required
                        value={dialogEditFieldUserFirst}
                        onChange={(e) => setDialogEditFieldUserFirst(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Apellido"
                        fullWidth
                        required
                        value={dialogEditFieldUserLast}
                        onChange={(e) => setDialogEditFieldUserLast(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Password"
                        fullWidth
                        required
                        value={dialogEditFieldUserPassword}
                        onChange={(e) => setDialogEditFieldUserPassword(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Telefono"
                        fullWidth
                        required
                        value={dialogEditFieldUserPhone}
                        onChange={(e) => setDialogEditFieldUserPhone(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        select
                        label="Permiso"
                        fullWidth
                        required
                        value={dialogEditFieldUserPermission}
                        onChange={(e) => setDialogEditFieldUserPermission(e.target.value)}
                    >
                        <MenuItem key={1} value={1}>User</MenuItem>
                        <MenuItem key={2} value={2}>Admin</MenuItem>
                    </TextField>
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

export default Users;
