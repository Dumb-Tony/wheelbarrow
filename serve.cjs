const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname;
http.createServer((req,res)=>{
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html';}catch{res.writeHead(400);return res.end();}
 if(!/^(index\.html|style\.css|garden\.js|tests\/replay\.js|vendor\/[\w.-]+\.js)$/.test(name)){res.writeHead(404);return res.end('Not found');}
 const file=path.join(root,name);fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);return res.end();}res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':name.endsWith('.css')?'text/css':'text/html');res.setHeader('Cache-Control','no-store');res.end(data);});
}).listen(8769,'127.0.0.1',()=>console.log('Wheelbarrow: http://localhost:8769'));
