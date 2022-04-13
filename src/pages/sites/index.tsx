import {useState, useEffect}  from 'react';
import React from 'react';
import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import IndexRow from './IndexRow';
import LibCookie from '@/lib/LibCookie'
import LibCommon from '@/lib/LibCommon'

const perPage = 5;
interface IProps {
  items: Array<object>,
  history:string[],
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
export default class SiteIndex extends React.Component<IProps, IState> {
  static async getInitialProps(ctx) {
//console.log(items);  
    return {
      items: [],
    }
  }
  constructor(props){
    super(props)
    this.state = {
      items: [], items_all: [], perPage: 10, offset: 0, pageCount: 0, categoryItems: [],
      category: '', button_display: false,
     };
//console.log(props);   
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
        sites {
          id
          name
          createdAt    
        }        
      }
      `,
      fetchPolicy: "network-only"
    });
    let items = data.data.sites;
    this.setState({
      items: items, items_all: items, button_display: true, pageCount: 0, 
    })  
  }    
  render(){
    const currentPage = Math.round(this.state.offset / perPage);
    const data = this.state.items;
console.log(this.state);
    return(
    <Layout>
      {this.state.button_display ? (<div />): (
        <LoadingBox></LoadingBox>
      )}       
      <div className="container py-4">
        <h3>Site - index</h3>
        <hr />
        <Link href="/sites/create">
          <a><button className="btn btn-primary mt-2">Create</button>
          </a>
        </Link>
        <hr />
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
console.log(createdAt);            
    //console.log(item.values.title);  created_at
            return (
              <IndexRow key={index} id={item.id} name={item.name} date={createdAt} />
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
