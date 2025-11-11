import type { CoursePart } from "../types"
import Part from "./Part"

const Content = ({course}: {course: CoursePart}) => {
  return (
    <p>
      <strong>{course.name} {course.exerciseCount}</strong><br />
      <Part course={course} />
    </p>
  )
}
export default Content