import React from "react";
import { ModalContext } from "../contexts/modal/context";

export const useModal = () => React.useContext(ModalContext);