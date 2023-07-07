import * as React from "react"
import { Link } from "gatsby"
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";

deckDeckGoHighlightElement();

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  // Define the nav items
  const navItems = [
    { pathname: "/", display: "Home" },
    { pathname: "/tutorials", display: "Tutorials" },
    { pathname: "/blog", display: "Blog" },
  ]

  // Generate the nav items
  const navLinks = navItems.map(({ pathname, display }) => (
    <li style={{ marginRight: "1rem" }} key={pathname}>
      <Link to={pathname}>{display}</Link>
    </li>
  ))

  const header = (
    <>
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
      <nav className="navigation">
        <ul style={{ display: "flex", justifyContent: "flex-start" }}>
          {navLinks}
        </ul>
      </nav>
    </>
  )

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">
        {header}
      </header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
