import Link from 'next/link';
//import Header from '../Layout/AppHead';

const IndexRow = props => (
  <tr>
    <td>
      <Link href={`/pages/${props.id}`}>
        <a className=""><h3>{props.title}</h3>
        </a>
      </Link>      
      {props.date} , ID: {props.id}
    </td>
    <td>
      <Link href={`/pages/edit/${props.id}`}>
        <a className="btn btn-sm btn-outline-primary"> Edit</a>
      </Link>
    </td>
  </tr>
);
export default IndexRow;
