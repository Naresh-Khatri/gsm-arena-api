import axios from 'axios'
import express, { Request, Response } from 'express'
import { parse } from 'node-html-parser'
const app = express()

const PORT = process.env.PORT || 3000

app.get('/', async (req: Request, res: Response) => {
    const quickSearch = await axios('https://www.gsmarena.com/quicksearch-8089.jpg')
    res.send(quickSearch.data)
})
app.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    const quickSearch = await axios(`https://www.gsmarena.com/hmmmm-${id}.php`)
    const document = parse(quickSearch.data)
    // create an object with th and td
    const structuredData = Array.from(document.querySelectorAll('table'))
        .map(table => {
            const th = Array.from(table.querySelectorAll('th'))[0]
            const td = Array.from(table.querySelectorAll('td')).map(td => td.text)
            return {
                [th.text]: td
            }
        })
    const deviceImg = document.querySelector('.specs-photo-main > a > img')
    const deviceImgUrl = deviceImg ? deviceImg.getAttribute('src') : ''
    const data = {
        ...structuredData,
    }

    console.log(structuredData)
    res.send(structuredData)

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})