import server from './server';
//import fs from 'fs';
process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

const port = +server.config.API_PORT;
const host = server.config.API_HOST;

//const appStructure = server.overview({ hideEmpty: true })
//fs.writeFileSync('./appStructure.json', JSON.stringify(appStructure, null, 2))

await server.listen({ host, port }).then((address) => {
  console.log(`server listening on ${address}`);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
