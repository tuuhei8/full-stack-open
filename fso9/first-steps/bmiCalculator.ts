
/* Aseta konsoliin pituus ensimmäisenä (indeksiin [2]) */

interface values {
  a: number
  b: number
}

const parseArguments = (args: string[]): values => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      a: Number(args[2]),
      b: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const bmiCalculator = (a: number, b: number) => {
  const bmi = Number((b / (a/100)**2).toFixed(1));
  if (bmi < 18.5) {
    return 'underweight';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return 'normal weight';
  } else if (bmi >= 25 && bmi <= 29.9) {
    return 'overweight';
  } else {
    return 'obese';
  }
};
if (require.main === module) {
  try {
    const { a, b } = parseArguments(process.argv);
    console.log(bmiCalculator(a, b));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}
