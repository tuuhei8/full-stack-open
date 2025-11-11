import type { CoursePart } from "../types"

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({course}: {course: CoursePart}) => {
  switch (course.kind) {
    case "basic":
      return <i>{course.description}</i>
    case "group":
      return <>Project exercises: {course.groupProjectCount}.</>
    case "background":
      return (
        <>
          <i>{course.description}</i><br />
          Material: <a href={course.backgroundMaterial}>{course.backgroundMaterial}</a>
        </>
      )
    case "special":
      return (
        <>
          <i>{course.description}</i><br />
          required skills: {course.requirements.join(', ')}.
        </>
      )
    default:
      return assertNever(course)
  }
};

export default Part