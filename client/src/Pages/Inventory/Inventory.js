import React, { useEffect, useState, useRef } from "react";
import Footer from "../../Components/Footer/Footer";
import CancelIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./Inventory.css";
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

const INVENTORY_URL = "/api/auth/inventory";
const CATEGORY_URL = "/api/categories";
const SUPPLIER_URL = "/api/supplier";

function Inventory() {
    const tableRef = useRef(null);
    // COMPRUEBE SI EL USUARIO HA INICIADO SESIÓN, DE LO CONTRARIO REDIRIGIR A LA PÁGINA DE INICIO DE SESIÓN
    useAuth("INVENTORY");

    const mode = useSelector((state) => state.darkMode);
    const token = useSelector((state) => state.auth.user?.token);
    const [searchTerm, setSearchTerm] = useState('');
    const [inventoryArray, setInventoryArray] = useState([]);
    const [categoryArray, setCategoryArray] = useState([]);
    const [supplierArray, setSupplierArray] = useState([]);
    const [ownerId, setOwnerId] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);

    // cuadro de diálogo de opciones
    const [openOptionsDialog, setOpenOptionsDialog] = useState(false);
    const [dialogItemCategory, setDialogItemCategory] = useState("");
    const [dialogItemName, setDialogItemName] = useState("");
    const [dialogItemDescription, setDialogItemDescription] = useState("");
    const [dialogItemPrice, setDialogItemPrice] = useState("");
    const [dialogItemStock, setDialogItemStock] = useState("");
    const [dialogItemSupplier, setDialogItemSupplier] = useState("");
    const [dialogItemId, setDialogItemId] = useState("");

    // cuadro de diálogo agregar elemento
    const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
    const [dialogFieldCategory, setDialogFieldCategory] = useState("");
    const [dialogFieldItemName, setDialogFieldItemName] = useState("");
    const [dialogFieldItemDescription, setDialogFieldItemDescription] = useState("");
    const [dialogFieldItemPrice, setDialogFieldItemPrice] = useState("");
    const [dialogFieldItemStock, setDialogFieldItemStock] = useState("");
    const [dialogFieldSupplier, setDialogFieldSupplier] = useState("");

    // cuadro de diálogo editar elemento
    const [opeEditItemDialog, setOpenEditItemDialog] = useState(false);
    const [dialogEditFieldCategory, setDialogEditFieldCategory] = useState("");
    const [dialogEditFieldItemName, setDialogEditFieldItemName] = useState("");
    const [dialogEditFieldItemDescription, setDialogEditFieldItemDescription] = useState("");
    const [dialogEditFieldItemPrice, setDialogEditFieldItemPrice] = useState("");
    const [dialogEditFieldItemStock, setDialogEditFieldItemStock] = useState("");
    const [dialogEditFieldSupplier, setDialogEditFieldSupplier] = useState("");

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
        getAllSupplier();
        setOpenAddItemDialog(true);
    };
    const handleCloseAddItemDialog = () => {
        setDialogFieldCategory("");
        setDialogFieldItemName("");
        setDialogFieldItemDescription("");
        setDialogFieldItemPrice("");
        setDialogFieldItemStock("");
        setDialogFieldSupplier("");
        setOpenAddItemDialog(false);
    };

    // editar controlador de diálogo de elemento
    const handleHydrateEditDialog = (data) => {
        getAllCategories();
        getAllSupplier();
        setDialogEditFieldCategory(data.category);
        setDialogEditFieldItemName(data.product_name);
        setDialogEditFieldItemDescription(data.description);
        setDialogEditFieldItemPrice(data.price);
        setDialogEditFieldItemStock(data.stock);
        setDialogEditFieldSupplier(data.supplier);
        setOpenEditItemDialog(true);
    };
    const handleCloseEditItemDialog = () => {
        setDialogEditFieldCategory("");
        setDialogEditFieldItemName("");
        setDialogEditFieldItemDescription("");
        setDialogEditFieldItemPrice("");
        setDialogEditFieldItemStock("");
        setDialogEditFieldSupplier("");
        setOpenEditItemDialog(false);
    };

    // RECOGEDORES Y MANEJADORES DE DATOS
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

    const getAllSupplier = () => {
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

        let inventoryBody = {
            category: dialogFieldCategory,
            productName: dialogFieldItemName,
            description: dialogFieldItemDescription,
            price: dialogFieldItemPrice,
            stock: dialogFieldItemStock,
            supplier: dialogFieldSupplier,
            user_id: ownerId,
        };

        axios
            .post(INVENTORY_URL, inventoryBody, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    handleCloseAddItemDialog();
                    getAllItems(ownerId);
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
            .get(INVENTORY_URL + `/${itemId}`, {
                params: {
                    user_id: ownerId,
                },
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

        let inventoryBody = {
            category: dialogEditFieldCategory,
            productName: dialogEditFieldItemName,
            description: dialogEditFieldItemDescription,
            price: dialogEditFieldItemPrice,
            stock: dialogEditFieldItemStock,
            supplier: dialogEditFieldSupplier,
            user_id: ownerId,
        };

        axios
            .put(INVENTORY_URL + `/${dialogItemId}`, inventoryBody, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    handleCloseEditItemDialog();
                    getAllItems(ownerId);
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
            .delete(INVENTORY_URL + `/${dialogItemId}`, {
                headers: {
                    "x-auth-token": token,
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                if (response.data) {
                    getAllItems(ownerId);
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
            setRole(jwtData.permission);
            getAllItems(jwtData.user_id);
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
                                        {inventoryArray.length > 0
                                            ? `${inventoryArray.length} productos.`
                                            : "No hay Productos!"}
                                    </div>
                                    <div
                                        onClick={handleOpenAddItemDialog}
                                        className="col-start-5 text-center bg-blue-500 p-2 rounded-md cursor-pointer"
                                    >
                                        <AddIcon />
                                    </div>
                                    <div
                                        className="col-start-6 text-center bg-blue-500 p-2 rounded-md cursor-pointer"
                                    >
                                        <DownloadTableExcel
                                            filename="Productos"
                                            sheet="sheet1"
                                            currentTableRef={tableRef.current}
                                        >
                                        <button>
                                            <PrintIcon />
                                        </button>
                                        </DownloadTableExcel>
                                    </div>
                                </div>
                                <div className="m-8 text-[20px] font-bold items-center">
                                    <input
                                        type="text"
                                        placeholder="Buscar por Nombre"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="mb-4 p-2 border border-gray-300 rounded"
                                    />
                                </div>
                                <div className="overflow-x-auto"> {/* Enable horizontal scrolling */}
                                    <table className="tableCSS w-full h-[40vh] text-center" ref={tableRef}>
                                    <tbody>
                                        <tr className="border-b-2 border-t-2 border-grey-300">
                                            <th>Id</th>
                                            <th>Categoria</th>
                                            <th>Nombre</th>
                                            <th>Descripcion</th>
                                            <th>Precio</th>
                                            <th>Stock</th>
                                            <th>Proveedor</th>
                                            <th>Usuario</th>
                                            {role === 2 && <th></th>}
                                        </tr>
                                        {inventoryArray
                                            .filter(item => item.product_name.toLowerCase().includes(searchTerm.toLowerCase())) // Filter logic
                                            .map((item, i) => (
                                                <tr
                                                    key={i}
                                                    className="hover:bg-[#96b7f3] transition-all duration-300 rounded-sm order-b-2 border-t-2 border-grey-300"
                                                >
                                                    <td>{item.product_id}</td>
                                                    <td>{item.category_name}</td>
                                                    <td>{item.product_name}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.stock}</td>
                                                    <td>{item.supplier_name}</td>
                                                    <td>{item.email}</td>
                                                    {role === 2 && (
                                                        <td>
                                                            <div
                                                                onClick={() => {
                                                                    setDialogItemCategory(item.category_name);
                                                                    setDialogItemName(item.product_name);
                                                                    setDialogItemDescription(item.description);
                                                                    setDialogItemPrice(item.price);
                                                                    setDialogItemStock(item.stock);
                                                                    setDialogItemSupplier(item.supplier);
                                                                    setDialogItemId(item.product_id);
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

            {/* Cuadro de diálogo Opciones*/}
            <Dialog open={openOptionsDialog} onClose={handleCloseOptionsDialog}>
                <DialogContent>
                    <DialogContentText>
                        <span className="flex flex-row justify-start items-center gap-4">
                            <span className="font-bold">Categoria: </span>
                        </span>
                        {dialogItemCategory}
                    </DialogContentText>
                    <DialogContentText>
                        <span className="flex flex-row justify-start items-center gap-4">
                            <span className="font-bold">Nombre: </span>
                        </span>
                        {dialogItemName}
                    </DialogContentText>
                    <DialogContentText>
                        <span className="flex flex-row justify-start items-center gap-4">
                            <span className="font-bold">Descripcion: </span>
                        </span>
                        {dialogItemDescription}
                    </DialogContentText>
                    <DialogContentText>
                        <span className="flex flex-row justify-start items-center gap-4">
                            <span className="font-bold">Precio: </span>
                        </span>
                        {dialogItemPrice}
                    </DialogContentText>
                    <DialogContentText>
                        <span className="flex flex-row justify-start items-center gap-4">
                            <span className="font-bold">Stock: </span>
                        </span>
                        {dialogItemStock}
                    </DialogContentText>
                    <DialogContentText>
                        <span className="flex flex-row justify-start items-center gap-4">
                            <span className="font-bold">Proveedor: </span>
                        </span>
                        {dialogItemSupplier}
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
                <DialogTitle>Agregar Producto.</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        select
                        label="Categorias"
                        fullWidth
                        required
                        value={dialogFieldCategory}
                        onChange={(e) => setDialogFieldCategory(e.target.value)}
                    >
                        {categoryArray.map((category) => (
                            <MenuItem
                                key={category.category_id}
                                value={category.category_id}
                            >
                                {category.category_name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        margin="dense"
                        label="Nombre de Porducto"
                        fullWidth
                        required
                        value={dialogFieldItemName}
                        onChange={(e) => setDialogFieldItemName(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        label="Descripcion"
                        fullWidth
                        required
                        value={dialogFieldItemDescription}
                        onChange={(e) => setDialogFieldItemDescription(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Precio de Producto"
                        fullWidth
                        required
                        value={dialogFieldItemPrice}
                        onChange={(e) =>
                            setDialogFieldItemPrice(e.target.value)
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Stock de Producto"
                        fullWidth
                        required
                        value={dialogFieldItemStock}
                        onChange={(e) =>
                            setDialogFieldItemStock(e.target.value)
                        }
                    />
                    <TextField
                    margin="dense"
                    select
                    label="Proveedor"
                    fullWidth
                    required
                    value={dialogFieldSupplier}
                    onChange={(e) => setDialogFieldSupplier(e.target.value)}
                >
                    {supplierArray.map((supplier) => (
                        <MenuItem
                            key={supplier.supplier_id}
                            value={supplier.supplier_id}
                        >
                            {supplier.supplier_name}
                        </MenuItem>
                    ))}
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

            {/* Cuadro de diálogo Editar elemento */}
            <Dialog
                open={opeEditItemDialog}
                onClose={handleCloseEditItemDialog}
            >
                <DialogTitle>Editar Producto.</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        select
                        label="Categorias"
                        fullWidth
                        required
                        value={dialogEditFieldCategory}
                        onChange={(e) =>
                            setDialogEditFieldCategory(e.target.value)
                        }
                    >
                        {categoryArray.map((category) => (
                            <MenuItem
                                key={category.category_id}
                                value={category.category_id}
                            >
                                {category.category_name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        margin="dense"
                        label="Nombre de Producto"
                        fullWidth
                        required
                        value={dialogEditFieldItemName}
                        onChange={(e) =>
                            setDialogEditFieldItemName(e.target.value)
                        }
                    />

                    <TextField
                        margin="dense"
                        label="Descripcion"
                        fullWidth
                        required
                        value={dialogEditFieldItemDescription}
                        onChange={(e) =>
                            setDialogEditFieldItemDescription(e.target.value)
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Precio de Producto"
                        type="number"
                        fullWidth
                        required
                        value={dialogEditFieldItemPrice}
                        onChange={(e) =>
                            setDialogEditFieldItemPrice(e.target.value)
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Stock de Producto"
                        type="number"
                        fullWidth
                        required
                        value={dialogEditFieldItemStock}
                        onChange={(e) =>
                            setDialogEditFieldItemStock(e.target.value)
                        }
                    />
                    <TextField
                        margin="dense"
                        select
                        label="Proveedor"
                        fullWidth
                        required
                        value={dialogEditFieldSupplier}
                        onChange={(e) =>
                            setDialogEditFieldSupplier(e.target.value)
                        }
                    >
                        {supplierArray.map((supplier) => (
                            <MenuItem
                                key={supplier.supplier_id}
                                value={supplier.supplier_id}
                            >
                                {supplier.supplier_name}
                            </MenuItem>
                        ))}
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

export default Inventory;
