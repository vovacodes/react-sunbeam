import { useContext } from "react"
import { SunbeamContext, SunbeamContextValue } from "../SunbeamContext"

export function useSunbeam(): SunbeamContextValue {
    const sunbeamContextValue = useContext(SunbeamContext)

    if (!sunbeamContextValue)
        throw new Error(
            "useSunbeam: the value for SunbeamContext is not provided. " +
                "Make sure <SunbeamProvider> is present in the tree"
        )

    return sunbeamContextValue
}
