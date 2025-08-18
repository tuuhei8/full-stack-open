import DataRow from './DataRow'

const Users = ({ data }) => {

  return (
    <div>
      <h2>users</h2>
      <table>
        <thead>
          <tr>
            <th>
            </th>
            <th>
              blogs created
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map(d =>
            <DataRow key={d.id} data={d} />
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Users