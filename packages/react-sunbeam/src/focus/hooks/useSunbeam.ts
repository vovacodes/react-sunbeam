import { useContext } from "react"
import { SunbeamContext, SunbeamContextValue } from "../SunbeamContext"

export function useSunbeam(): SunbeamContextValue {
    return useContext(SunbeamContext)
}
