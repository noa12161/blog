import qs from 'qs';

const a =
  '?q=npm+qs&oq=npm+qs&aqs=chrome..69i57j35i39l2j0i131i433i512l3j0i3j0i131i433i512j0i433i512j0i131i433i512.7385j1j15&sourceid=chrome&ie=UTF-8';

const parsedA = qs.parse(a);
console.log(parsedA);
