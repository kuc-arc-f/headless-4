import Link from 'next/link';
//import Header from '../Layout/AppHead';
//import LibPost from "@/lib/LibPost";

const IndexRow = function (props){
//console.log(props);
  return (
  <tr>
    <td>
      <Link href={`/posts/${props.id}`}>
        <a className=""><h3>{props.title}</h3>
        </a>
      </Link>      
      {props.date} , ID: {props.id} , Category : {props.categoryName}
    </td>
    <td>
      <Link href={`/posts/edit/${props.id}`}>
        <a className="btn btn-sm btn-outline-primary"> Edit</a>
      </Link>
    </td>
  </tr>
  )
}
export default IndexRow;
