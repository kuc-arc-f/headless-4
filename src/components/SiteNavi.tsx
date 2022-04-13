import Link from 'next/link';
import Head from 'next/head';
//import flash from 'next-flash';
import React from 'react'
//
export default function SiteNavi(props){
//console.log(props.siteId);
  return (
  <div className="text-center">
    <Link href={`/posts?site=${props.siteId}`}>
      <a className="mx-2">[ Post ]</a>
    </Link> 
    <Link href={`/pages?site=${props.siteId}`}>
      <a className="mx-2">[ Page ]</a>
    </Link>     
    <Link href={`/category?site=${props.siteId}`}>
      <a className="mx-2">[ Category ]</a>
    </Link>
    <hr className="my-0" />     
  </div>
  );
}
