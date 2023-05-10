const removeLinks = (body) => {
  let newStr = "";

  body.split(" ").forEach(str => {
    if (
      str.indexOf('http:') !== -1 ||
      str.indexOf('https:') !== -1 ||
      str.indexOf('www.') !== -1
    ) {
      newStr += "link"
    } else {
      newStr += str;
    }

    newStr += " ";
  });

  return newStr;
}

// https://stackoverflow.com/a/822464/2710227
const stripHtml = (htmlString) => {
  return htmlString.replace(/<[^>]*>?/gm, '');
}

// https://stackoverflow.com/a/9609450/2710227
const decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})()

// |\W removes everything non alpha num including spaces
export const cleanText = (str) => decodeEntities(
  stripHtml(
    removeLinks(
      str.replace(/(\r\n|\n|\r)/gm, "").replace(/'/g, "").replace('"', '').replace(/\\/g, '') // nasty
    )
  )
);
