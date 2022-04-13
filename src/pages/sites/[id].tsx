import Head from 'next/head'
import React from 'react'
import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'

import Layout from '@/components/layout'
//
function Page(props) {
  const item = props.item
console.log(item)
  return (
  <Layout>
    <div className="container">
      <Link href="/tasks">
        <a className="btn btn-outline-primary mt-2">Back</a></Link>
      <hr />
      <div><h1>Title : {item.title}</h1>
      </div>
      <div>Content: {item.content}
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
      task(id: ${id}){
        id
        title
        content
        created_at
      }            
    }
    ` ,
    fetchPolicy: "network-only"
  });
console.log(data.data.task); 
  const item = data.data.task; 
  return {
    props: { item },
  }
}

export default Page

