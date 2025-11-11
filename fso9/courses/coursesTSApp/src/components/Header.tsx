import type { HeaderType } from "../types"

const Header = (props: HeaderType) => {
  return (
    <h1>
      {props.courseName}
    </h1>
  )
}

export default Header