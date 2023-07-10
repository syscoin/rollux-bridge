import { useMemo } from "react"

export const useAddAsset = () => {
    return useMemo(() => {
        return {
            addAsset: () => {
                console.log("add asset");
            },
            onSuccess: () => {
                console.log("success");
            },
            onError: () => {
                console.log("error");
            }
        }
    }, []);
}

export default useAddAsset;