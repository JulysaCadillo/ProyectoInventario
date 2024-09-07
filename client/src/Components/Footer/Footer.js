import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer id="foot" className="bg-[#000] w-full h-[100px]">
            <div className="text-white flex flex-col justify-center items-start gap-10 relative h-full pt-2 smallMobile:px-[1rem] mobile:px-[1.5rem] tablet:px-[2rem] laptop:px-[4rem] desktop:px-[4rem]">
                
                <div className="w-full flex flex-row justify-between items-center text-[0.75rem]">
                    Copyright © {new Date().getFullYear()}
                    <div className="flex flex-row justify-between items-center gap-5 flex-nowrap">
                        <Link to="/privacy-and-terms">Lima - Perú</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
