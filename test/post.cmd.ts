import request from 'superagent'

const data = {
  images: [
    'https://theboutiqueadventurer.com/wp-content/uploads/2021/02/London-Tower-Bridge-at-Sunset.jpg.webp',
    'https://www.thepiccadillywestend.co.uk/blog/wp-content/uploads/2018/11/London-Millennium-bridge-sunset.jpg',
    '',
    ''
  ]
}

const post = () => request.post('http://localhost:21001/images').send(data)

post()
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err)
    process.exit(1)
  })
