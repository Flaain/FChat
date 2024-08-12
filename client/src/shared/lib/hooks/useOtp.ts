import React from "react";
import { OtpContext } from "../contexts/otp/context";

export const useOtp = () => React.useContext(OtpContext);