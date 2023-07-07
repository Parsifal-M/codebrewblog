import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
deckDeckGoHighlightElement();

const HomeIndex = ({ data, location }) => {
  const siteTitle = 'CodeBrew'




  return (
    <Layout location={location} title={siteTitle}>
      <Bio />
    </Layout>
  )
  }

export default HomeIndex

