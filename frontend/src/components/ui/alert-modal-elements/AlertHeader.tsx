// frontend/src/components/ui/alert-modal-elements/AlertHeader.tsx

import React from "react";
import { AlertProps } from "@/constants/interface";
import { AlertMainDetails } from "../AlertMainDetails";

export const AlertHeader: React.FC<AlertProps> = ({ alert }) => {
    return (
        <div className = "px-8 py-4">
            <div className = "flex flex-col gap-4 mt-2">
                <AlertMainDetails alert = {alert} />
                <div className = "flex flex-col gap-4">
                    {alert.Description && (
                        <div className = "p-3">
                            <div className = "flex flex-col gap-4">
                                <div>
                                    <p className = "text-sm text-black font-medium mb-2"> Description: </p>
                                    <p className = "font-light text-gray-700 text-sm inline-block py-1.5 rounded-md"> {alert.Description}. </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};