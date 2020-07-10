function convertStringToFileName(input, extension=false) {
    let output="", reachedFirstLetter=false, charType, r=0;

    function getCharType(code) {
      if ( (code >=65 && code <= 90) || (code>=97 && code <=122) ) {return "LETTER"}
      if (code >=48 && code <= 57) {return "NUMERAL"}
      return "OTHER"
    }

    for (r=0; r< input.length; r++) {
      charType = (getCharType(input.charCodeAt(r)))
      if (charType === 'LETTER') {reachedFirstLetter = true}

      if (charType !== 'LETTER' && !reachedFirstLetter) {continue}
      if (charType === 'OTHER') {
        if (output.charAt(output.length-1) !== '-') {output += '-';}
        continue
      }
      output += input.charAt(r).toLowerCase()
    }

    if (extension) { output += '.' + extension}
    return output
}

export {convertStringToFileName}