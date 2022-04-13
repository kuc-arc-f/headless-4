import { gql } from "@apollo/client";
import client from '@/apollo-client'

const LibPost = {
  getCategory:async function(siteId){
    try{
      let ret = [];
      const data = await client.query({
        query: gql`
        query {
          categories(siteId: ${siteId}) {
            id
            name
            createdAt    
          }                          
        }
        `,
        fetchPolicy: "network-only"
      });
//console.log(data.data.categories); 
      ret = data.data.categories;     
      return ret;
    } catch (e) {
      console.error(e);
      throw new Error('error, getCategory: ' + e );
    }
  },
  getCategoryName: function(categoryItems, categoryId){
    try{
      let ret = "";
      let category = categoryItems.filter(categoryItem => (categoryItem.id === categoryId)
      );
      if(category.length > 0){
        ret = category[0].name;
      }        
      return ret;
    } catch (e) {
      console.error(e);
      throw new Error('error, getCategory: ' + e );
    }
  },
}
export default LibPost
