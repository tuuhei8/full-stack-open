const FilterSection = (props) => {
  return (
    <div>
      Find countries: <input type="text"
      value={props.filterValue}
      onChange={props.filterOnChange} />
    </div>
  )
}

export default FilterSection