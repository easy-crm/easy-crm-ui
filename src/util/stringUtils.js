/* eslint-disable no-bitwise */
const getQueryStringFromObject = (obj) => {
  const searchParams = new URLSearchParams();
  Object.keys(obj).forEach((key) => searchParams.append(key, obj[key]));
  return searchParams.toString();
};

const stringToColour = (str) => {
  const text = `random${str}random`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '';
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += `00${value.toString(16)}`.substr(-2);
  }
  return colour;
};

const getAvatarUrlFromName = (name) => {
  return `https://ui-avatars.com/api/?name=${name}&background=${stringToColour(
    name
  )}&color=fff`;
};

const shortenDisplayString = (str = '') => {
  return str.length <= 100 ? str : `${str.substring(0, 97)}...`;
};

export {
  getQueryStringFromObject,
  getAvatarUrlFromName,
  shortenDisplayString,
  stringToColour,
};
