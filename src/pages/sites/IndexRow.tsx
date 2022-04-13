import Link from 'next/link';
//import Header from '../Layout/AppHead';

const IndexRow = props => (
  <tr>
    <td>
      <h3>{props.name}
      </h3>
      {props.date} , ID: {props.id}
    </td>
    <td>
      <Link href={`/posts?site=${props.id}`}>
        <a className="btn btn-primary mb-2"> Open</a>
      </Link><br />
      <Link href={`/sites/edit/${props.id}`}>
        <a className="btn btn-sm btn-outline-primary"> Edit</a>
      </Link>
    </td>
  </tr>
);
export default IndexRow;
