export const getSearchTerm = () => {
    const rawSearchTerm = document.getElementById("search").value.trim();
    // delimiter / where the regex begins and end.
    // after closing delimiter is where modifiers comes. g - global, i - case-insensitive
    // [] character class,set of characters that can all be matched by the regex.
    // {} exact number of characters. {min,max} range of number of characters.

    // [ ]{2,} look for 2 or more whitespaces 
    const regex = /[ ]{2,}/gi;
    //find 2 or more whitespaces by regex and replace them with just 1 whitespace
    const searchTerm = rawSearchTerm.replaceAll(regex, " ");
    return searchTerm;
}

export const retrieveSearchResults = async (searchTerm) => {
    const wikiSearchString = getWikiSearchString(searchTerm);
    const wikiSearchResults = await requestData(wikiSearchString);
    let resultArray = [];
    if (wikiSearchResults.hasOwnProperty("query")) {
        resultArray = processWikiResults(wikiSearchResults.query.pages);
    }

    return resultArray;

}

const getWikiSearchString = (searchTerm) => {
    const maxChars = getMaxChars();

    /*  const baseSearchUrl = "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrlimit=20&prop=pageimages|extracts&exintro&explaintext&exlimit=max&format=json&origin=*";
     const rawSearchString = baseSearchUrl + `&exchars=${maxChars}` + `&gsrsearch=${searchTerm}`; */

    const rawSearchString = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages|extracts&exchars=${maxChars}&exintro&explaintext&exlimit=max&format=json&origin=*`;

    //origin=* the requesting code from any origin is allowed to access the resources.
    //cors-cross-origin resource sharing.
    //cors- an http-header based mechanism that allows a server to indicate any origin(domain,port) other than its own from which a browser should permit loading resources.
    //for security reasons,browsers restrict cross-origin http requests initiated from scripts.

    //URN is subset of URL and URL is subset of URI. (U-uniform,R-resource,N-name,L-locater,I-identifier)
    //URN- a unique and persistent identifier. e.g. urn:isbn:0-486-27557-4
    //URL-how to access the resource(protocol-http,ftp,https,file) and location of it(web address-domain name,path).query,fragment identifier(e.g. #id ) are optional.
    //URI- could be either or both of them:) it is a generic term.

    //default character set in html5 is utf-8.First 127 characters(0-127) of utf-8 are same as ascii and represented by a single byte.
    //e.g. space is encoded to %20 (unsafe char- % and 20(utf-8,ascii-hex)=U+0020(unicode code point)=32(ascii,unicode-dec)=00100000(binary)
    const searchString = encodeURI(rawSearchString);
    /* console.log("raw search string\n", rawSearchString);
    console.log("encoded URI\n", searchString); */
    return searchString;

}
const getMaxChars = () => {
    const width = window.innerWidth | document.body.clientWidth;
    let maxChars;
    if (width < 414) maxChars = 65;
    if (width >= 414 && width < 1400) maxChars = 100;
    if (width >= 1400) maxChars = 130;
    return maxChars;
}

const requestData = async (searchString) => {
    try {
        const response = await fetch(searchString);
        const data = await response.json();
        // console.log("json data\n", data);
        return data;
    }
    catch (err) {
        console.error(err);
    }

}

const processWikiResults = (results) => {
    const resultArray = [];
    Object.keys(results).forEach(key => {
        const id = key;
        const title = results[key].title;
        const text = results[key].extract;
        const img = results[key].hasOwnProperty("thumbnail") ? results[key].thumbnail.source : null;
        const item = {
            id: id,
            title: title,
            img: img,
            text: text
        };
        resultArray.push(item);
    });
    return resultArray;
}