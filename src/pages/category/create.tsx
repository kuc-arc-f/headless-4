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
export default class TaskCreate extends Component<IProps, IState> {
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
      const name = document.querySelector<HTMLInputElement>('#name');
      const result = await client.mutate({
        mutation:gql`
        mutation {
          addCategory(name: "${name.value}", siteId: ${this.props.siteId}){
            id
          }                    
        }                    
      `
      });
console.log(result);
      Router.push(`/category?site=${this.props.siteId}`);
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
          <Link href={`/category?site=${this.props.siteId}`}>
            <a className="btn btn-outline-primary mt-2">Back</a></Link>
          <hr className="mt-2 mb-2" />
          <h3>Category - Create</h3>
          <div className="col-md-6 form-group">
            <label>Name:</label>
            <input type="text" name="name" id="name" className="form-control"
            />
          </div> 
          {this.state.button_display ? (
          <div className="form-group my-2">
            <button className="btn btn-primary" onClick={this.handleClick}>Create
            </button>
          </div>                
          ): (<div></div>)
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