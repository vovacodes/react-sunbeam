import { useContext } from "react"
import { SunbeamContext, SunbeamContextValue } from "../SunbeamContext.js"

export function useSunbeam(): SunbeamContextValue {
    return useContext(SunbeamContext)
}
