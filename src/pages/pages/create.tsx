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

interface IState {
  title: string,
  content: string,
  _token: string,
  user_id: string,
  button_display: boolean,
}
interface IProps {
  csrf: any,
  user_id: string,
  siteId: string,
}
//
export default class PageCreate extends Component<IProps, IState> {
  constructor(props){
    super(props)
    this.state = {
      title: '', content: '', _token : '', user_id: '', button_display: false
    }
    this.handleClick = this.handleClick.bind(this);
console.log(props)
  }
  async componentDidMount(){
    const key = process.env.COOKIE_KEY_USER_ID;
    const uid = LibCookie.get_cookie(key);
//console.log( "user_id=" , uid)
    if(uid === null){
      flash.set({ messages_error: 'Error, Login require' })
      Router.push('/login');
    }else{
  //console.log(data.data.getToken);
      this.setState({
         user_id: uid, button_display: true,
      });    
    }
  }   
  handleChangeTitle(e){
    this.setState({title: e.target.value})
  }
  handleClick(){
    this.addItem()
  } 
  async addItem(){
    try {
      const title = document.querySelector<HTMLInputElement>('#title');
      const content = document.querySelector<HTMLInputElement>('#content');
      let contentValue = content.value;
      contentValue = LibGraphql.replaceMutaionString(contentValue);
//console.log(contentValue);
      const result = await client.mutate({
        mutation:gql`
        mutation {
          addPage(title: "${title.value}", content: "${contentValue}",
           siteId: ${this.props.siteId}){
            id
          }                    
        }                    
      `
      });
console.log(result);
      Router.push(`/pages?site=${this.props.siteId}`);
    } catch (error) {
      console.error(error);
      alert("Error, save item")
    }    
  } 
  render() {
console.log(this.state);
    return (
    <Layout>
      <main>
        {this.state.button_display ? (<div />): (
          <LoadingBox></LoadingBox>
        )}
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <Link href={`/pages?site=${this.props.siteId}`}>
              <a className="btn btn-outline-primary mt-2">Back</a></Link>
            </div>
            <div className="col-md-4"><h3>Page - Create</h3>
            </div>
            <div className="col-md-4">
            </div>
          </div>
          <hr className="mt-2 mb-2" />
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