import { Link } from 'react-router-dom'

const DataRow = ({ data }) => {
  if (data.name) {
    return (
      <tr>
        <td>
          <Link to={`/users/${data.id}`}>{data.name}</Link>
        </td>
        <td>
          {data.blogs.length}
        </td>
      </tr>
    )
  }
  return null
}

export default DataRow