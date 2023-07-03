import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"

const TutorialIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const tutorials = data.allMarkdownRemark.nodes

  if (tutorials.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <p>
          No tutorial posts found. Add markdown posts to "content/tutorials" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <ol style={{ listStyle: `none` }}>
        {tutorials.map(tutorial => {
          const title = tutorial.frontmatter.title || tutorial.fields.slug

          return (
            <li key={tutorial.fields.slug}>
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2>
                    <Link to={tutorial.fields.slug} itemProp="url">
                      <span itemProp="headline">{title}</span>
                    </Link>
                  </h2>
                  <small>{tutorial.frontmatter.date}</small>
                </header>
                <section>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: tutorial.frontmatter.description || tutorial.excerpt,
                    }}
                    itemProp="description"
                  />
                </section>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default TutorialIndex

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/tutorials/" } },
      sort: {frontmatter: {date: DESC}}
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
