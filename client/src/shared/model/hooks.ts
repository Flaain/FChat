import { RootState, StoreDispatch } from "@/app/model/store";
import { useSelector, type TypedUseSelectorHook, useDispatch } from "react-redux";

export const useAppDispatch = useDispatch<StoreDispatch>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;