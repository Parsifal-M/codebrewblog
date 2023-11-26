import * as React from "react"
import { Link, graphql } from "gatsby"
import Bio from "../components/bio"
import Layout from "../components/layout"
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";

deckDeckGoHighlightElement();

const HomeIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const blogPosts = data.allBlogPosts.nodes
  const tutorialPosts = data.allTutorialPosts.nodes

  return (
    <Layout location={location} title={siteTitle}>
      <Bio />
      <div className="blog-tutorial-container">
        <div>
          <h2>Recent Blog Posts</h2>
          <ol style={{ listStyle: `none` }}>
            {blogPosts.map(post => {
              const title = post.frontmatter.title || post.fields.slug
              return renderPost(post, title)
            })}
          </ol>
        </div>
        <div>
          <h2>Recent Tutorial Posts</h2>
          <ol style={{ listStyle: `none` }}>
            {tutorialPosts.map(post => {
              const title = post.frontmatter.title || post.fields.slug
              return renderPost(post, title)
            })}
          </ol>
        </div>
      </div>
    </Layout>
  )
}

const renderPost = (post, title) => (
  <li key={post.fields.slug}>
    <article
      className="post-list-item"
      itemScope
      itemType="http://schema.org/Article"
    >
      <header>
        <h2>
          <Link to={post.fields.slug} itemProp="url">
            <span itemProp="headline">{title}</span>
          </Link>
        </h2>
        <small>{post.frontmatter.date}</small>
      </header>
      <section>
        <p
          dangerouslySetInnerHTML={{
            __html: post.frontmatter.description || post.excerpt,
          }}
          itemProp="description"
        />
      </section>
    </article>
  </li>
)

export default HomeIndex

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
    allBlogPosts: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/blog/" } },
      sort: { fields: [frontmatter___date], order: DESC },
      limit: 3
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
    allTutorialPosts: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/tutorials/" } },
      sort: { fields: [frontmatter___date], order: DESC },
      limit: 3
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
