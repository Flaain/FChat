import React from 'react';
import { SigninContext } from '../../model/context';

export const useSigninForm = () => React.useContext(SigninContext);