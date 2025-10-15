
/* Syötä tavoiteltu tuntien keskimäärä konsoliin ensimmäisenä (indeksiin [2])
 ja päivittäiset tunnit sen jälkeen. */ 

interface schedule {
  array: number[]
  target: number
}

const parseArguments = (args: string[]): schedule => {
  if (args.length < 4) throw new Error('Not enough arguments.');
  const dailyHours = args.slice(3);
  const targetValue = Number(args[2]);
  const hoursAsNumbers: number[] = [];
  if (isNaN(targetValue)) {
    throw new Error('Target must be a number.');
  }
  dailyHours.forEach((d) => {
    if (isNaN(Number(d))) {
      throw new Error('Hours recorded must be numbers.');
    } else {
      hoursAsNumbers.push(Number(d));
    }
  });

  return ({
    array: hoursAsNumbers,
    target: targetValue
  });
};

export const exerciseCalculator = (array: number[], target: number) => {
  const totalDays = array.length;
  const trainingDays = array.filter(a => a > 0).length;
  const targetValue = target;
  const totalHours = array.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
  const dailyAverage = Number((totalHours / totalDays).toFixed(2));
  const success = dailyAverage >= target ?  true : false;
  const rating = () => {
    if (success) {
      return 3;
    } else if (dailyAverage >= target/2) {
      return 2;
    } else {
      return 1;
    }
  };
  const ratingDescription = () => {
    if (rating() === 3) {
      return 'Goal achieved.';
    } else if (rating() === 2) {
      return 'Not quite there...';
    } else {
      return 'Not even close.';
    }
  };

  return ({
    periodLength: totalDays,
    trainingDays: trainingDays,
    success: success,
    rating: rating(),
    ratingDescription: ratingDescription(),
    target: targetValue,
    average: dailyAverage
  });
};

if (require.main === module) {
  try {
    const {array, target} = parseArguments(process.argv);
    console.log(exerciseCalculator(array, target));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}