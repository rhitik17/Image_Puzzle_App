
export const customHash = (input :string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; 
  }
  return hash.toString();
};



export   const generatePieces = (size: number) =>
    Array.from({ length: size * size }, (_, i) => i + 1);

export   const shufflePieces = (pieces: number[], size: number) => {
    let shuffled = [...pieces];
    do {
      shuffled = shuffled.sort(() => Math.random() - 0.5);
    } while (isSolvable(shuffled, size));

    return shuffled;
  };

  export   const isSolvable = (pieces: number[], size: number) => {
    let inversions = 0;
    for (let i = 0; i < pieces.length; i++) {
      for (let j = i + 1; j < pieces.length; j++) {
        if (pieces[i] > pieces[j] && pieces[i] !== 0 && pieces[j] !== 0)
          inversions++;
      }
    }
    if (size % 2 === 0) {
      const rowFromBottom = Math.floor(pieces.indexOf(0) / size) + 1;
      return (rowFromBottom % 2 === 0) === (inversions % 2 === 0);
    }
    return inversions % 2 === 0;
  };

  export const contineousfailure = (levels : number[]) =>{

    if(levels?.length <3) return false;

    let count = 1;

    for(let i = 1; i < levels?.length; i++){
      if(levels[i]-levels[i-1]){
        count++;
        if(count >= 3) return true;
      }else{
        count = 1;
      }
    }

 return false;
  }