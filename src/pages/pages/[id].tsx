import Head from 'next/head'
import React from 'react'
import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'
import { marked } from 'marked';
import Layout from '@/components/layout'
import LibGraphql from "@/lib/LibGraphql";
import LoadingBox from '@/components/LoadingBox'

interface IState {
  title: string,
  content: string,
  _token: string,
  item: any,
  createdAt: string,
  categoryName: string,
  button_display: boolean,
}
interface IProps {
  id: string,
  csrf: any,
  item: any,
}
//
export default class Page extends React.Component<IProps, IState> {
  constructor(props){
    super(props)  
    this.state = {
      title: '', 
      content: '',
      createdAt: '',
      _token : '',
      categoryName: '', 
      item: {},
      button_display: false,
    }  
  }  
  async componentDidMount(){
    try{
      const id = this.props.id;
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
    //console.log(data.data.page); 
      const item = data.data.page;
      let content = LibGraphql.getTagString(item.content)
      content = marked.parse(content);
//console.log(item);
      this.setState({
        item: item, content: content, button_display: true,
      });

    } catch (e) {
      console.error(e);
    }
  }
  render(){
//console.log(this.state);
    return (
      <Layout>
        {this.state.button_display ? (<div />): (
          <LoadingBox></LoadingBox>
        )}        
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <Link href={`/pages?site=${this.state.item.siteId}`}>
                <a className="btn btn-outline-primary mt-2">Back</a>
              </Link>
            </div>
            <div className="col-md-4">
              <Link href={`/pages/edit/${this.props.id}`}>
                <a className="btn btn-primary mt-2">Edit</a>
              </Link>          
            </div>
            <div className="col-md-4"></div>
          </div>
          <hr />
          <div><h1>Title : {this.state.item.title}</h1>
          </div>
          <div className="shadow-sm bg-white p-4 mt-2 mb-4">
            <div id="post_item" dangerouslySetInnerHTML={{__html: `${this.state.content}`}}>
            </div>
          </div>      
          <hr />
          ID: {this.props.id}      
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

}
//console.log(item)
//
export const getServerSideProps = async (ctx) => {
  const id = ctx.query.id
//console.log(data.data.page); 
  return {
    props: { 
      //item: item ,
      id: id },
  }
}

