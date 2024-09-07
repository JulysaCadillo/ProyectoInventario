import React from "react";
import { Link } from "react-router-dom";


function Form({ formHead, formFoot, formData, formButton, handlers }) {
    return (
          
        <div className="parent flex flex-row justify-around mt-20 py- px-35">
            <div className="container flex flex-col items-center bg-white py-1 px-[85px]">
                <h2>{formHead}</h2>

                <form className="formContainer flex flex-col justify-center items-center" onSubmit={handlers.formHandler}>
                    {formData.inputs.map((input) => (
                        <div key={input.key} className="fieldDiv py-[0.5rem] px-0">
                            <input
                                type={input.type}
                                className="fields border-[1px] border-solid text-black border-[#2261d6] rounded-[20px] text-[14px] py-[14px] px-[16px] w-[20.5rem] focus:outline-none"
                                name={input.name}
                                placeholder={input.placeholder}
                                onChange={input.handler}
                            />
                            {input.error && (
                                <div className="warning font-extrabold text-[11px] text-red-500">
                                    <p>{input.error}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    <div className="fieldDiv py-[0.5rem] px-0">
                        <input
                            type="submit"
                            className="btn bg-[#2261d6] border-0 rounded-[20px] text-[16px] leading-[2.5rem] p-0 w-[20.5rem] text-white duration-[200ms] hover:bg-[#847777	] hover:cursor-pointer"
                            value={formButton}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Form;
