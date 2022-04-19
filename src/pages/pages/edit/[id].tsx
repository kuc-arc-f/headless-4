//import Head from 'next/head'
import Link from 'next/link';
import Router from 'next/router'
import React from 'react'
import flash from 'next-flash';
import { gql } from "@apollo/client";
import client from '@/apollo-client'

import LibCookie from "@/lib/LibCookie";
import LibGraphql from "@/lib/LibGraphql";
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import MessageBox from '@/components/MessageBox'

interface IState {
  title: string,
  content: string,
  _token: string,
  user_id: string,
  button_display: boolean,
  message: string,
}
interface IProps {
  id: string,
  csrf: any,
  item: any,
  user_id: string,
  siteId: number,
}
//
export default class TaskEdit extends React.Component<IProps, IState> {
  static async getInitialProps(ctx) {
    console.log("id=", ctx.query.id)
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
    const item = data.data.page
    const siteId = item.siteId 
//console.log(item);
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
    const  content = LibGraphql.getTagString(this.props.item.content)
    this.state = {
      title: this.props.item.title, 
      content: content,
      _token : this.props.csrf.token,
      user_id: '', button_display: false, message: '',
    }
//console.log(props )
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
          deletePage( id: ${this.props.id}){
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
      Router.push(`/pages?site=${this.props.siteId}`);      
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
      console.log("#update_item-id:" , this.props.id);
      const title = document.querySelector<HTMLInputElement>('#title');
      const content = document.querySelector<HTMLInputElement>('#content');
      let contentValue = content.value;
      contentValue = LibGraphql.replaceMutaionString(contentValue);      
      const result = await client.mutate({
        mutation: gql`
        mutation {
          updatePage(id: ${this.props.id}, title: "${title.value}"
          , content: "${contentValue}"){
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
      this.setState({message: "Success , Save"});
//      Router.push(`/pages?site=${this.props.siteId}`);
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
        <MessageBox success={this.state.message} error=""/>  
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <Link href={`/pages?site=${this.props.siteId}`}>
              <a className="btn btn-outline-primary mt-2">Back</a></Link>              
            </div>
            <div className="col-md-4"><h3>Pages - Edit</h3>
            </div>
            <div className="col-md-4">
              {this.state.button_display ? (
              <div>
                <div className="form-group mt-2">
                  <button className="btn btn-primary" onClick={this.handleClick}>Save
                  </button>
                  <Link href={`/pages/${this.props.id}`}>
                    <a><button className="btn btn-outline-primary mx-2">Preview</button>
                    </a>
                  </Link>              
                </div>
              </div>
              ): ""}          
            </div>
          </div>

          <hr className="mt-2 mb-2" />
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Title:</label>
                <input type="text" id="title" className="form-control"
                defaultValue={this.state.title} />                
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>Content:</label>
            <div className="col-sm-12">
              <textarea name="content" id="content" className="form-control"
               rows={10} placeholder="markdown input, please"
               defaultValue={this.state.content}></textarea>
            </div>
          </div> 
          {this.state.button_display ? (
          <div>
            {/*
            <div className="form-group mt-2">
              <button className="btn btn-primary" onClick={this.handleClick}>Save
              </button>
            </div>
            */}
            <hr />                  
            <div className="form-group">
              <button className="btn btn-danger" onClick={this.handleClickDelete}>Delete
              </button>
            </div>
          </div>
          ): ""}          
          <hr />
          ID : {this.props.id}
        </div>
      </Layout>
    );
  }
}

