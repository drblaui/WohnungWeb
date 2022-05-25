import { getLinks } from "./mail";

getLinks((links) => {
	console.log(links);
	console.log("Callback!")
});