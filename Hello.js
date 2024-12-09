export default function Hello(app) {
    app.get('/platepal', (req, res) => {
        res.send('Life is delicious!')
    })
    app.get('/', (req, res) => {
        res.send('Welcome to Platepal!')
    })  
}