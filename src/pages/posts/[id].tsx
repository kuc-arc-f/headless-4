import Head from 'next/head'
import React from 'react'
import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'
import { marked } from 'marked';
import Layout from '@/components/layout'
import LibGraphql from "@/lib/LibGraphql";
import LibPost from "@/lib/LibPost";
import LibCommon from '@/lib/LibCommon'
//
function Page(props) {
  const item = props.item
  const categoryItems = props.categoryItems
  let content = LibGraphql.getTagString(item.content)
  content = marked.parse(content);
  let category = categoryItems.filter(categoryItem => (categoryItem.id === item.categoryId)
  );
  let categoryName = "";
  if(category.length > 0){
    categoryName = category[0].name;
  }
  let createdAt = LibCommon.converDatetimeString(item.createdAt);
// console.log(createdAt)
  return (
  <Layout>
    <div className="container">
      <Link href={`/posts?site=${item.siteId}`}>
        <a className="btn btn-outline-primary mt-2">Back</a>
      </Link>
      <hr />
      <div><h1>Title : {item.title}</h1>
      </div>
      date : {createdAt}<br />
      category : {categoryName}<br />
      ID: {item.id}      
      <hr className="my-1" />
      <div className="shadow-sm bg-white p-4 mt-2 mb-4">
        <div id="post_item" dangerouslySetInnerHTML={{__html: `${content}`}}>
        </div>
      </div>      
      <hr />
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
      post(id: ${id}) {
        id
        siteId
        title
        content
        categoryId
        createdAt
      }                  
    }
    ` ,
    fetchPolicy: "network-only"
  });
  const item = data.data.post; 
  const category = await LibPost.getCategory(item.siteId)
//console.log(item);
//console.log(category); 
  return {
    props: { item: item, categoryItems: category },
  }
}

export default Page

