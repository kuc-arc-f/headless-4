import React, {Component, useEffect, useState} from 'react';
import { gql } from "@apollo/client";
import client from '@/apollo-client'
import Layout from '@/components/layout'
import LoadingBox from '@/components/LoadingBox'
import SignUpBox from '@/components/auth/SignUpBox';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {auth} from '@/firebase';

interface IProps {
  history:string[],
  tasks: any[],
}
interface IObject {
  id: number,
  title: string
}
//
function Page(props:IProps) {
  //state 
  const [displayButton, setdisplayButton] = useState(false);
//console.log(props.tasks);
  const handleSubmit = (event: any) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
console.log(email.value);
    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then( async(userCredential) => {
      console.log('user created');
      console.log(userCredential.user);
      console.log(userCredential.user.uid);
      try{
        await addUser(email.value);
        alert("OK, save");
        location.href= '/auth/login';      
      } catch (e) {
        console.error(e);
        alert("error, save");
      } 
    })
  }
  const addUser = async function(email: string){
    try{
      const result = await client.mutate({
        mutation:gql`
        mutation {
          addUser(email: "${email}"){
            id
          }         
        }                    
      `
      });
console.log(result);      
    } catch (e) {
      console.error(e);
      throw new Error('Error , addUser: ' + e);
    }    
  } 
  const validUserCheck = async function(){
    try{
      const data = await client.query({
        query: gql`
        query {
          countUser                
        }
        `,
        fetchPolicy: "network-only"
      });
      const count = data.data.countUser;
console.log(data.data.countUser);
      if(count > 0){
        setdisplayButton(true);
        alert("Error, max user over");
        location.href= '/auth/login'; 
      }else{
        setdisplayButton(true);
      }
    } catch (e) {
      console.error(e);
      throw new Error('Error , validUserCheck: ' + e);
    }    
  }
  useEffect(() => {
    validUserCheck();
  },[]);  
   
  return (
  <Layout>
    {displayButton ? (<div />): (
      <LoadingBox></LoadingBox>
    )} 
    <div className="container py-4">
      <h1>SignUp</h1>
      <form onSubmit={handleSubmit}>
        <SignUpBox />
        <div>
          {displayButton ? (
            <button className="btn btn-primary">Save</button>
          ) : (<div></div>)}
        </div>
      </form>
    </div>
  </Layout>
  );
}

export default Page;

