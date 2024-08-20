import fs from "fs"
import { log } from 'console';

const args = process.argv.splice(2);

let url: string = `https://api.github.com/users/${args[0]}/events?page=${1}?per_page${10}`


function checkCache() {
  let data: any | null = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
  for(let i = 0; i < data.length; i++) {
    if (data[i].actor.display_login == args[0]) {
      return data.filter((element: any) => element.actor.display_login == args[0])
    }
  }

  return null;
}

function main() {
  let cache: Array<Object> | null = checkCache();
  if (cache == null) {
    fetchData();
    cache = checkCache();
    displayData(cache);
  } else {
    displayData(cache);
  }


}
async function fetchData() {
  console.log("here");
  let dataFetch: any | null;
  let responseData = await fetch(url)
  dataFetch = await responseData.json();

  let cacheData = JSON.parse(fs.readFileSync('data.json', 'utf-8'))

  for(let i = 0; i < dataFetch.length; i++) {
    cacheData.push(dataFetch[i])
  }
  fs.writeFileSync('data.json', JSON.stringify(cacheData));
}

function displayData(data: any | null) {
  if (data != null) {
    for (let i = 0; i < data.length; i++) {
      if(data[i].type == "PushEvent") {
        console.log(`Pushed ${data[i].payload.commits.length} commits to ${data[i].repo.name}`)
      }
      if(data[i].type == "CreateEvent") {
        console.log(`Created a new repo at ${data[i].repo.name}`)
      }
      if(data[i].type == "DeleteEvent") {
        console.log(`Deleted repo ${data[i].repo.name}`)
      }
      if(data[i].type == "WatchEvent") {
        console.log(`Turn watched repo ${data[i].repo.name}`)
      }
    }
  }
}




main();













