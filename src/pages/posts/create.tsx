import Link from 'next/link';
import Router from 'next/router'
import flash from 'next-flash';
import React, {Component} from 'react';
import { gql } from "@apollo/client";
import client from '@/apollo-client'

import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import LibCookie from "@/lib/LibCookie";
import LibGraphql from "@/lib/LibGraphql";
import LibPost from "@/lib/LibPost";

interface IState {
  title: string,
  content: string,
  _token: string,
  user_id: string,
  button_display: boolean,
  categoryItems: any[],
}
interface IProps {
  csrf: any,
  user_id: string,
  siteId: string,
}
//
export default class SiteCreate extends Component<IProps, IState> {
  constructor(props){
    super(props)
    this.state = {
      title: '', content: '', _token : '', user_id: '', button_display: false,
      categoryItems: [],
    }
    this.handleClick = this.handleClick.bind(this);
console.log(props)
  }
  async componentDidMount(){
    try{
      const key = process.env.COOKIE_KEY_USER_ID;
      const uid = LibCookie.get_cookie(key);
  //console.log( "user_id=" , uid)
      if(uid === null){
        flash.set({ messages_error: 'Error, Login require' })
        Router.push('/login');
      }else{
        const category = await LibPost.getCategory(this.props.siteId)
//console.log(category);
        this.setState({
           user_id: uid, button_display: true, categoryItems: category,
        });    
      }
    } catch (e) {
      console.error(e);
    }    
  }   
  handleClick(){
    this.addItem()
  } 
  async addItem(){
    try {
      const category = document.querySelector<HTMLInputElement>('#category_id');
      const title = document.querySelector<HTMLInputElement>('#title');
      const content = document.querySelector<HTMLInputElement>('#content');
      let contentValue = content.value;
      contentValue = LibGraphql.replaceMutaionString(contentValue);
//console.log(category.value);
      const result = await client.mutate({
        mutation:gql`
        mutation {
          addPost(title: "${title.value}", content: "${contentValue}", 
            categoryId: ${category.value}, siteId: ${this.props.siteId})
          {
            id
          }          
        }                    
      `
      });
console.log(result);
      Router.push(`/posts?site=${this.props.siteId}`);
    } catch (error) {
      console.error(error);
      alert("Error, save item")
    }    
  } 
  render() {
console.log(this.state);
    const category = this.state.categoryItems;
    return (
    <Layout>
      <main>
        {this.state.button_display ? (<div />): (
          <LoadingBox></LoadingBox>
        )}
        <div className="container">
          <Link href={`/posts?site=${this.props.siteId}`}>
            <a className="btn btn-outline-primary mt-2">Back</a></Link>
          <hr className="mt-2 mb-2" />
          <h3>Post - Create</h3>
          <div className="col-md-6 form-group">
            <label>Category :</label>
            <select id="category_id" name="category_id" className="form-select">
              <option value="0"></option>
              {category.map((item, index) => {
    // console.log(item)
                return(<option key={index}
                  value={item.id}>{item.name}</option>)            
              })}          
            </select>             
          </div>
          <div className="col-md-6 form-group">
            <label>Title:</label>
            <input type="text" name="title" id="title" className="form-control"
            />
          </div> 
          <div className="form-group">
            <label>Content:</label>
            <div className="col-sm-12">
              <textarea name="content" id="content" className="form-control"
               rows={10} placeholder="markdown input, please"></textarea>
            </div>
          </div> 
          {this.state.button_display ? (
          <div className="form-group my-2">
            <button className="btn btn-primary" onClick={this.handleClick}>Create
            </button>
          </div>                
          ): (
          <div>false</div>
          )
          }          
          <hr />
          {/*
          */}
        </div>
      </main>
    </Layout>
    )    
  } 
}

export const getServerSideProps = async (ctx) => {
console.log(ctx.query.site);
  const site = ctx.query.site;
  return {
    props: { siteId: site },
  }
}