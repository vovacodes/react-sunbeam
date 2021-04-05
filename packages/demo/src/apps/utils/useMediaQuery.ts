import * as React from "react"

/**
 * @param query e.g. `"(max-width: 640px)"`
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches)

    React.useEffect(() => {
        const mediaQueryList = window.matchMedia(query)

        function handleMatchesUpdate() {
            setMatches(mediaQueryList.matches)
        }
        mediaQueryList.onchange = handleMatchesUpdate

        handleMatchesUpdate()

        return () => {
            mediaQueryList.onchange = null
        }
    }, [query, setMatches])

    return matches
}
