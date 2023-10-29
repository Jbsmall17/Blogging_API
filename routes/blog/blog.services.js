function estimateReadingTime(text) {
    const wordsPerMinute = 225; 
  
    const wordCount = text.split(/\s+/).length;
  

    const readingTimeInMinutes = wordCount / wordsPerMinute;
    const readingTimeInMilliseconds = readingTimeInMinutes * 60 * 1000;
  
    return readingTimeInMilliseconds;
  }

module.exports = estimateReadingTime

