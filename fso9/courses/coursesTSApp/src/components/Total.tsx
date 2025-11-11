import type { TotalType } from "../types";

const Total = (props: TotalType) => {
  return (
    <p>
      Number of exercises {props.totalExercises}
    </p>
  )
}

export default Total