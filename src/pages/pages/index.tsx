import {useState, useEffect}  from 'react';
import React from 'react';
import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import SiteNavi from '@/components/SiteNavi'

import IndexRow from './IndexRow';
import LibCookie from '@/lib/LibCookie'
import LibCommon from '@/lib/LibCommon'

const perPage = 5;
interface IProps {
  items: Array<object>,
  history:string[],
  siteId: number,
}
interface IState {
  items: any[],
  items_all: any[],
  categoryItems: any[],
  category: string,
  perPage: number,
  offset: number,
  pageCount: number,
  button_display: boolean,
}
//
export default class PageIndex extends React.Component<IProps, IState> {
  constructor(props){
    super(props)
    this.state = {
      items: [], items_all: [], perPage: 10, offset: 0, pageCount: 0, categoryItems: [],
      category: '', button_display: false,
     };
console.log(props);   
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const validCookie = LibCookie.get_cookie(key);
//    console.log(d);
    if(validCookie === null){
      location.href = '/auth/login';
    }
    const data = await client.query({
      query: gql`
      query {
        pages(siteId: ${this.props.siteId}) {
          id
          title
          createdAt    
        }                        
      }
      `,
      fetchPolicy: "network-only"
    });
console.log(data.data.pages);
    let items = data.data.pages;
    this.setState({
      items: items, items_all: items, button_display: true, pageCount: 0, 
    })  
  }    
  render(){
    const data = this.state.items;
console.log(this.state);
    return(
    <Layout>
      <SiteNavi siteId={this.props.siteId} />
      {this.state.button_display ? (<div />): (
        <LoadingBox></LoadingBox>
      )}       
      <div className="container mt-1 pb-4">
        <h3>Pages - index</h3>
        siteId : {this.props.siteId}
        <hr className="my-1" />
        <Link href={`/pages/create?site=${this.props.siteId}`}>
          <a><button className="btn btn-primary">Create</button>
          </a>
        </Link>
        <hr className="my-1" />
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {data.map((item: any ,index: number) => {
            let createdAt = LibCommon.converDatetimeString(item.createdAt);
//console.log(createdAt);            
//console.log(item.values.title);  created_at
            return (
              <IndexRow key={index} id={item.id} title={item.title} date={createdAt} />
            )
          })}      
          </tbody>
        </table>
        <hr />
       
      </div>
    </Layout>
    );
  }
}

export const getServerSideProps = async (ctx) => {
console.log(ctx.query.site);
  const site = ctx.query.site;
  return {
    props: { siteId : site },
  }
}