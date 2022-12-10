import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
import tmx from "tmx-parser";

async function main() {
    const map = await new Promise((res, rej) => {
    tmx.parseFile("./map.tmx", function (err, loadedMap) {
      if (err) return rej(err);
      res(loadedMap);
    });
  });
  const layer = map.layers[0]; 
  const tiles = layer.tiles; 
  //console.log(layer.tiles);
  const map2D = []  
  console.log("map " + map.height + "width " + map.width);
  
  for(let row = 0; row < map.height; row++){
    const tileRow = []
    for(let col = 0; col < map.width; col++){
     tileRow.push(tiles[row * map.height + col])
    }
    map2D.push(tileRow); 
  }
 console.log("map2D", map2D);

 
  io.on("connect", (socket) => {
    console.log("user connected", socket.id);
    io.emit('map')
  });
  app.use(express.static("public"));
  httpServer.listen(5000);
}
main();
