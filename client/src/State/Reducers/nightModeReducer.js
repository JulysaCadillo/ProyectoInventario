const reducer = (
    state = {
        bgNavbar: "#2261d6",
        bgCard: "#ffffffd6",
        colorNavbar: "#000000",
        colorCard: "#000000",
    },
    action
) => {
    if (action.payload === true) {
        return {
            bgNavbar: "#001819d6",
            bgCard: "#2c2c2cd6",
            colorNavbar: "#2261d6",
            colorCard: "#ffffff",
        };
    } else if (action.payload === false) {
        return {
            bgNavbar: "#2261d6",
            bgCard: "#ffffffd6",
            colorNavbar: "#000000",
            colorCard: "#000000",
        };
    } else {
        return state;
    }
};

export default reducer;
