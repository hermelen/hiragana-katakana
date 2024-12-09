type ScoreProps = {
  score: number[];
  trainingLength: number;
};

export function Score({ score, trainingLength }: ScoreProps) {
  return (
    <div
      className="flex
                       justify-center
                       items-center
                       pr-5
                       pl-5
                       mb-5
                       h-10
                       text-center
                       rounded-sm
                       shadow-lg
                       text-white
                       text-xl
                       bg-gradient-to-b 
                       to-stone-800
                       from-indigo-500"
    >
      {score.reduce((acc, curr) => acc + curr, 0)}/{trainingLength}
    </div>
  );
}
