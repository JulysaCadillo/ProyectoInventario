import React, { useEffect, useState, useRef } from "react";
import Footer from "../../Components/Footer/Footer";
import CancelIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./Category.css";
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

const CATEGORY_URL = "/api/categories";

function Category() {
    const tableRef = useRef(null);
    // COMPRUEBA SI EL USUARIO HA INICIADO SESIÓN, DE LO CONTRARIO REDIRIGIR A LA PÁGINA DE INICIO DE SESIÓN
    useAuth("INVENTORY");

    const mode = useSelector((state) => state.darkMode);
    const token = useSelector((state) => state.auth.user?.token);

    const [categoryArray, setCategoryArray] = useState([]);
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState("");

    // cuadro de diálogo de opciones
    const [openOptionsDialog, setOpenOptionsDialog] = useState(false);
    const [dialogItemCategory, setDialogItemCategory] = useState("");
    const [dialogItemId, setDialogItemId] = useState("");

    // cuadro de diálogo agregar elemento
    const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
    const [dialogFieldCategory, setDialogFieldCategory] = useState("");

    // cuadro de diálogo editar elemento
    const [opeEditItemDialog, setOpenEditItemDialog] = useState(false);
    const [dialogEditFieldCategory, setDialogEditFieldCategory] = useState("");

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
        getAllCategories();
        setOpenAddItemDialog(true);
    };
    const handleCloseAddItemDialog = () => {
        setDialogFieldCategory("");
        setOpenAddItemDialog(false);
    };

    // editar controlador de diálogo de elemento
    const handleHydrateEditDialog = (data) => {
        getAllCategories();
        setDialogEditFieldCategory(data.category_name);
        setOpenEditItemDialog(true);
    };
    const handleCloseEditItemDialog = () => {
        setDialogEditFieldCategory("");
        setOpenEditItemDialog(false);
    };

    const getAllCategories = () => {
        axios
            .get(CATEGORY_URL)
            .then((response) => {
                if (response.data) {
                    setCategoryArray(response.data.data);
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

        let categoryBody = {
            category_name: dialogFieldCategory,
        };

        axios
            .post(CATEGORY_URL, categoryBody, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    handleCloseAddItemDialog();
                    getAllCategories();
                    setSuccessDialogTitle("Exitoso");
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
            .get(CATEGORY_URL + `/${itemId}`, {
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

        let categoryBody = {
            category_name: dialogEditFieldCategory,
        };

        axios
            .put(CATEGORY_URL + `/${dialogItemId}`, categoryBody, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    handleCloseEditItemDialog();
                    getAllCategories();
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
            .delete(CATEGORY_URL + `/${dialogItemId}`, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    getAllCategories();
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
            getAllCategories();
        }
    }, [token, categoryArray]);

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
                                
                                <div className='col-start-1'>
                                    {categoryArray.length > 0
                                        ? `${categoryArray.length} categorias.`
                                        : "No hay Categorias!"}
                                </div>
                                {role === 2 && (<div
                                    onClick={handleOpenAddItemDialog}
                                    className="col-start-5 text-center bg-blue-500 p-2 rounded-md cursor-pointer"
                                >
                                    <AddIcon />
                                </div>)}
                                <div
                                    className="col-start-6 text-center bg-blue-500 p-2 rounded-md cursor-pointer"
                                >
                                    <DownloadTableExcel
                                        filename="categoria"
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
                                    <table className="tableCSS w-full h-[40vh] text-center" ref={tableRef}>
                                        <thead>
                                            <tr className="border-b-2 border-t-2 border-gray-300">
                                                <th className="p-2">Id</th>
                                                <th className="p-2">Nombre de Categoria</th>
                                                {role === 2 && <th className="p-2"></th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {categoryArray.map((item, i) => (
                                                <tr
                                                    key={i}
                                                    className="hover:bg-[#96b7f3] transition-all duration-300 rounded-sm order-b-2 border-t-2 border-grey-300"
                                                >
                                                    <td className="p-2">{item.category_id}</td>
                                                    <td className="p-2">{item.category_name}</td>
                                                    {role === 2 && (
                                                        <td>
                                                            <div
                                                                onClick={() => {
                                                                    setDialogItemCategory(item.category_name);
                                                                    setDialogItemId(item.category_id);
                                                                    setOpenOptionsDialog(true);
                                                                }}
                                                                className="mx-auto w-fit cursor-pointer"
                                                            >
                                                                <MoreVertIcon />
                                                            </div>
                                                        </td>
                                                    )}
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
                            <span className="font-bold">Nombre de Categoria: </span>
                        </span>
                        {dialogItemCategory}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <MuiButton
                        onClick={() => handlePressEdit(dialogItemId)}
                        color="inherit"
                        className="flex flex-row justify-start items-center gap-4 "
                    >
                        <EditIcon />
                        <span>Editar</span>
                    </MuiButton>
                    <MuiButton
                        onClick={() => handlePressDelete(dialogItemId)}
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
                <DialogTitle>Agregar Categoria</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre de Categoria"
                        fullWidth
                        required
                        value={dialogFieldCategory}
                        onChange={(e) => setDialogFieldCategory(e.target.value)}
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
                <DialogTitle>Editar Categoria</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre de Categoria"
                        fullWidth
                        required
                        value={dialogEditFieldCategory}
                        onChange={(e) =>
                            setDialogEditFieldCategory(e.target.value)
                        }
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

            {/* Cuadro de diálogo ÉXITO de confirmación*/}
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

export default Category;
