const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");
const app = express();
const PORT = 1337;

app.use(morgan('dev'));
app.use(express.static('./public'));


//main page
app.get("/", (req, res) => {
  const posts = postBank.list();

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Shazaam Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Shazaam Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span><a href="/posts/${post.id}">${post.title}</a>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
  </body>
  </html>`;
  
  res.send(html);
});


//single post page
app.get( '/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);

  if (!post.id) {
    throw new Error('Not Found')
  } 
  
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Shazaam Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-item">
      <header><img src="/logo.png"/>Shazaam Wizard News</header>
      
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>${post.title}
            <small>(by ${post.name})
            <br> ${post.content}
            </small>
            
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>
    </div>
  </body>
  </body>
  </html>`
  
  res.send(html);
})

app.use((err, req, res, next) => {
  res.status(404).send('404 Page not found...')
})

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});