//import Head from 'next/head'
import Link from 'next/link';
import Router from 'next/router'
import React from 'react'
import flash from 'next-flash';
import { gql } from "@apollo/client";
import client from '@/apollo-client'

import LibCookie from "@/lib/LibCookie";
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'

interface IState {
  name: string,
  content: string,
  _token: string,
  user_id: string,
  button_display: boolean,
}
interface IProps {
  id: string,
  csrf: any,
  item: any,
  user_id: string,
  siteId: number,
}
//
export default class Page extends React.Component<IProps, IState> {
  static async getInitialProps(ctx) {
    console.log("id=", ctx.query.id)
    const id = ctx.query.id
    const data = await client.query({
      query: gql`
      query {
        category(id: ${id}) {
          id
          siteId
          name
          createdAt
        }                    
      }
      ` ,
      fetchPolicy: "network-only"
    });
    const item = data.data.category
    const siteId = item.siteId    
console.log(item); 
    return {
      id: id,
      item: item,
      user_id : '',
      csrf: '',
      siteId: siteId,
    };
  }
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.state = {
      name: this.props.item.name, 
      content: this.props.item.content,
      _token : this.props.csrf.token,
      user_id: '', button_display: false,
    }
console.log(props )
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
console.log( "user_id=" , uid)    
    if(uid === null){
      flash.set({ messages_error: 'Error, Login require' })
      Router.push('/login');
    }else{
      this.setState({
        user_id: uid, button_display: true,
      });      
    }
  }     
  async handleClickDelete(){
    console.log("#deete-id:" , this.props.id)
    try {
      const result = await client.mutate({
        mutation:  gql`
        mutation {
          deleteCategory( id: ${this.props.id}){
            id
          }
        }
      ` 
      })
console.log(result);
/*
      if(result.data.deleteBook.id === 'undefined'){
        throw new Error('Error , deleteTask');
      }
*/
      Router.push(`/category?site=${this.props.siteId}`);     
    } catch (error) {
      console.error(error);
    }     
  } 
  async handleClick(){
  console.log("#-handleClick")
    await this.update_item()
  }     
  async update_item(){
    try {
      const name = document.querySelector<HTMLInputElement>('#name');
      console.log("#update_item-id:" , this.props.id);
      const result = await client.mutate({
        mutation: gql`
        mutation {
          updateCategory(id: ${this.props.id}, name: "${name.value}"){
            id
          }          
        }                    
      `
      });
console.log(result);
/*
      if(result.data.updateBook.id === 'undefined'){
        throw new Error('Error , updateBook');
      }
*/
      Router.push(`/category?site=${this.props.siteId}`);
    } catch (error) {
      console.error(error);
      alert("Error, save item");
    }     
  }  
  render() {
console.log(this.state);
    return (
      <Layout>
        {this.state.button_display ? (<div />): (
          <LoadingBox></LoadingBox>
        )
        }        
        <div className="container">
          <Link href={`/category?site=${this.props.siteId}`}>
            <a className="btn btn-outline-primary mt-2">Back</a></Link>
          <hr className="mt-2 mb-2" />
          <h1>Category - Edit</h1>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Name:</label>
                <input type="text" id="name" className="form-control"
                defaultValue={this.state.name}
                 />
              </div>
            </div>
          </div>
          {this.state.button_display ? (
          <div>
            <div className="form-group mt-2">
              <button className="btn btn-primary" onClick={this.handleClick}>Save
              </button>
            </div>
            <hr />                  
            <div className="form-group">
              <button className="btn btn-danger" onClick={this.handleClickDelete}>Delete
              </button>
            </div>
          </div>
          ): ""
          }          
          <hr />
          ID : {this.props.id}
        </div>
      </Layout>
    );
  }
}

