import Head from 'next/head'
import React from 'react'
import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'
import { marked } from 'marked';
import Layout from '@/components/layout'
import LibGraphql from "@/lib/LibGraphql";
//
function Page(props) {
  const item = props.item
  let content = LibGraphql.getTagString(item.content)
  content = marked.parse(content);
console.log(item)
  return (
  <Layout>
    <div className="container">
      <Link href={`/pages?site=${item.siteId}`}>
        <a className="btn btn-outline-primary mt-2">Back</a>
      </Link>
      <hr />
      <div><h1>Title : {item.title}</h1>
      </div>
      <div className="shadow-sm bg-white p-4 mt-2 mb-4">
        <div id="post_item" dangerouslySetInnerHTML={{__html: `${content}`}}>
        </div>
      </div>      
      <hr />
      ID: {item.id}      
    </div>
  </Layout>
  )
}
//
export const getServerSideProps = async (ctx) => {
  const id = ctx.query.id
  const data = await client.query({
    query: gql`
    query {
      page(id: ${id}) {
        id
        siteId
        title
        content
        createdAt
      }                        
    }
    ` ,
    fetchPolicy: "network-only"
  });
console.log(data.data.page); 
  const item = data.data.page; 
  return {
    props: { item: item },
  }
}

export default Page

