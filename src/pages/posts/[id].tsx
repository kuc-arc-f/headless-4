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
//console.log(content)
  return (
  <Layout>
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <Link href={`/posts?site=${item.siteId}`}>
            <a className="btn btn-outline-primary mt-2">Back</a>
          </Link>
        </div>
        <div className="col-md-4">
          <Link href={`/posts/edit/${item.id}`}>
            <a className="btn btn-primary mt-2">Edit</a>
          </Link>
        </div>
        <div className="col-md-4">
        </div>
      </div>
      <hr className="my-1" />
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
    <style>{`
      div#post_item img{
        max-width : 100%;
        height : auto;
      }
      #post_item pre{
        background-color: #EEE;
        padding: 0.5rem;
      }      
      .show_head_wrap{ font-size: 1.4rem; }
      .pdf_next_page {
        page-break-before: always;
        background-color: green;
        border: none;        
      }
      @media print {
        .hidden_print{
          display: none;
        }
      }
      `}</style>     
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

