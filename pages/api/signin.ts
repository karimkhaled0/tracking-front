import type { NextApiRequest, NextApiResponse } from 'next'
import Jwt  from 'jsonwebtoken'

const KEY = "dsajdasldasmdsaldsa"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!req.body) {
        res.statusCode = 404
        res.end("Error")
    }
    console.log(req.body)
   
  const {email, password} = req.body

  res.json({
      token: Jwt.sign({
          email,
      }, KEY)
  }) 
}
