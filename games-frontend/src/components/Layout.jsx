import { Outlet } from 'react-router-dom'

/**
 * Layout wrapper for all games.
 * Outlet renders the matched child route (the actual game).
 * This can be extended to add shared navigation, headers, etc.
 */
function Layout() {
    return (
        <>
            <Outlet />
        </>
    )
}

export default Layout
