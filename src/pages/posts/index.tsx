import {useState, useEffect}  from 'react';
import React from 'react';
import Router from 'next/router'
import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import SiteNavi from '@/components/SiteNavi'

import IndexRow from './IndexRow';
import ReactPaginate from 'react-paginate';
import LibPagenate from '@/lib/LibPagenate';
import LibCookie from '@/lib/LibCookie'
import LibPost from '@/lib/LibPost'
import LibCommon from '@/lib/LibCommon'

const perPage = 20;
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
  paginate_display: boolean,
}
//
export default class SiteIndex extends React.Component<IProps, IState> {
  constructor(props){
    super(props)
    this.state = {
      items: [], items_all: [], perPage: 10, offset: 0, pageCount: 0, categoryItems: [],
      category: '', button_display: false, paginate_display: false,
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
        posts(siteId: ${this.props.siteId}) {
          id
          title
          categoryId
          createdAt    
        }                
      }
      `,
      fetchPolicy: "network-only"
    });
    let items = data.data.posts;
//console.log(items);
    const categoryItems = await LibPost.getCategory(this.props.siteId)
    LibPagenate.set_per_page(perPage);
    const n = LibPagenate.getMaxPage(items.length);
    const d = LibPagenate.getPageStart(0);
//console.log(categoryItems);
    this.setState({
      items: items.slice(d.start, d.end), items_all: items, button_display: true, 
      paginate_display: true ,pageCount: n, categoryItems: categoryItems,
    })  
  }
  clickClear(){
    location.href = `/posts?site=${this.props.siteId}`;
  }
  async clickSearch(){
    try{
      const searchKey = document.querySelector<HTMLInputElement>('#searchKey');
//      console.log(searchKey.value);
      this.setState({ items: [] , button_display: false })
      const data = await client.query({
        query: gql`
        query {
          searchPosts(siteId:${this.props.siteId} , seachKey: "${searchKey.value}") {
            id
            title
            categoryId
            createdAt    
          }                          
        }
        `,
        fetchPolicy: "network-only"
      });      
      let items = data.data.searchPosts;
//console.log(items);
      this.setState({ 
        items: items, button_display: true, paginate_display: false, 
      }) 
    } catch (e) {
      console.error(e);
    }    
  }
  changeCategory(){
    try{
      const category = document.querySelector<HTMLInputElement>('#category');
//console.log(category.value);
      let items = this.state.items_all.filter(
        item => (item.categoryId === Number(category.value))
      );      
      this.setState({ items: items, paginate_display: false, })      
//console.log(items);
    } catch (e) {
      console.error(e);
    }    
  }
  handlePageClick(data: any){
    console.log('onPageChange', data);
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);
    const d = LibPagenate.getPageStart(selected);
// console.log(this.state.items_all);
    this.setState({
      offset: offset, 
      items: this.state.items_all.slice(d.start, d.end) 
    });

  }    
  render(){
    const currentPage = Math.round(this.state.offset / perPage);
    const data = this.state.items;
//console.log(this.state);
    return(
    <Layout>
      <SiteNavi siteId={this.props.siteId} />
      {this.state.button_display ? (<div />): (
        <LoadingBox></LoadingBox>
      )}       
      <div className="container mt-1 mb-4">
        <div className="row">
          <div className="col-md-4"><h3>Posts</h3>
          </div>
          <div className="col-md-4 pt-2">siteId : {this.props.siteId}
          </div>
          <div className="col-md-4 text-center">
            <Link href={`/posts/create?site=${this.props.siteId}`}>
              <a><button className="btn btn-primary mt-0">Create</button>
              </a>
            </Link>
          </div>
        </div>
        <hr className="my-1" />
        <div className="row">
          <div className="col-md-8 pt-2">
            <button onClick={() => this.clickClear()} className="btn btn-sm btn-outline-primary">Clear
            </button>
            <span className="search_key_wrap">
              <input type="text" size={24} className="mx-2 " name="searchKey" id="searchKey"
              placeholder="Title search Key" />        
            </span>
            <button onClick={() => this.clickSearch()} className="btn btn-sm btn-outline-primary">Search
            </button>            
          </div>
          <div className="col-md-4">
            <span>Category:</span>
            <select className="form-select" name="category" id="category"
            onChange={() => this.changeCategory()}>
            <option key={0} value={0}></option>
            {this.state.categoryItems.map((item ,index) => (
              <option key={index} value={item.id}>{item.name}</option>
            ))
            }
            </select>
          </div>        
        </div>
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
            let categoryName = LibPost.getCategoryName(this.state.categoryItems, item.categoryId);
            let createdAt = LibCommon.converDatetimeString(item.createdAt);
//console.log(createdAt);
//console.log(item.values.title);  created_at categoryItems
            return (
              <IndexRow key={index} id={item.id} title={item.title} date={createdAt}
              categoryName={categoryName} />
            )
          })}      
          </tbody>
        </table>
        <hr />
        {this.state.paginate_display ? (
        <nav aria-label="Page navigation comments" className="mt-4">
          <ReactPaginate
            previousLabel="previous"
            nextLabel="next"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            pageCount={this.state.pageCount}
            pageRangeDisplayed={4}
            marginPagesDisplayed={2}
            onPageChange={this.handlePageClick.bind(this)}
            containerClassName="pagination justify-content-center"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeClassName="active"
            hrefBuilder={(page, pageCount) =>
              page >= 1 && page <= pageCount ? `/page/${page}` : '#'
            }
            hrefAllControls
            forcePage={currentPage}
            onClick={(clickEvent) => {
              console.log('onClick', clickEvent);
            }}
          />
        </nav>
        ): (<div></div>)
        }       
      </div>
    </Layout>
    );
  }
}

export const getServerSideProps = async (ctx) => {
//console.log(ctx.query.site);
  const site = ctx.query.site;
  return {
    props: { siteId : site },
  }
}