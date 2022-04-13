
const LibGraphql = {
  /* 改行等を、タグ変換する */
  replaceMutaionString: function(value){
    try{
      let contentValue = value;
      contentValue = contentValue.replace(/\r?\n/g, '<br />');  //win
      contentValue = contentValue.replace(/\n/g, '<br />');
      contentValue = contentValue.replace(/\"/g, '<doubleQuarts>');
      return contentValue;
    } catch (e) {
      console.log(e);
      throw new Error('error, replaceMutaionString');
    }
  },
  /* タグから、改行コード等に変換 */
  getTagString: function(contentValue){
    try{
//      let contentValue = value;
      let content = contentValue.replace(/<br \/>/gi, '\n');
      content = content.replace(/<doubleQuarts>/gi, '"');
      return content;
    } catch (e) {
      console.log(e);
      throw new Error('error, getTagString');
    }
  },  
}
export default LibGraphql
