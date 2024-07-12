import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { verify } from "hono/jwt";
import { outcomes } from '../outcomes';

export const gameRouter=new Hono<{
    Bindings:{
        DATABASE_URL: string
        JWT_SECRET: string
    },
    Variables:{
        userId: string
    }
}>()

//middleware
gameRouter.use('/*', async(c, next) =>{
    const authHeader=c.req.header("Authorization") || ""
    try{
        const user=await verify(authHeader,c.env.JWT_SECRET)
        if(user){
            c.set("userId", user.id)
            //it doesnt return anything so it tells the call to move forward
            await next();
        }
        else{
            c.status(403);
            return c.json({
                message: "You are not logged in"
            })
        }
    }
    catch(e){
        c.status(403)
        return c.json({
            message: "You are not logged in"
        })
    }
})

const TOTAL_DROPS = 16;

const MULTIPLIERS_LOW: {[ key: number ]: number} = {
    0: 16,
    1: 9,
    2: 2,
    3: 1.4,
    4: 1.2,
    5: 1.1,
    6: 1,
    7: 0.8,
    8: 0.5,
    9: 0.8,
    10: 1,
    11: 1.1,
    12: 1.2,
    13: 1.4,
    14: 2,
    15: 9,
    16: 16
}

const MULTIPLIERS_MEDIUM: {[ key: number ]: number} = {
    0: 110,
    1: 41,
    2: 10,
    3: 5,
    4: 3,
    5: 1.5,
    6: 1,
    7: 0.5,
    8: 0.2,
    9: 0.5,
    10: 1,
    11: 1.5,
    12: 3,
    13: 5,
    14: 10,
    15: 41,
    16: 110
}

const MULTIPLIERS_HIGH: {[ key: number ]: number} = {
    0: 1000,
    1: 130,
    2: 26,
    3: 9,
    4: 4,
    5: 2,
    6: 0.2,
    7: 0.2,
    8: 0.2,
    9: 0.2,
    10: 0.2,
    11: 2,
    12: 4,
    13: 9,
    14: 26,
    15: 130,
    16: 1000
}

gameRouter.get('/risk',async(c) => {
    
    const body=await c.req.json()
    const val=body.val
    return c.json({val})

})
gameRouter.get('/wallet', async(c)=>{
    const prisma=new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const userId= c.get("userId");
    try{
    const walletAmount = await prisma.user.findFirst({
        where:{
            id: userId
        },
        select:{
            money: true
        }
    })

    const {money} = walletAmount
    return c.json({
        money
    })
    }
    catch(e) {
        console.error(e);
    c.status(500);
    return c.json({ error: 'Internal Server Error' });
    }

})
gameRouter.post('/playGame', async(c) => {
    const prisma=new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    console.log("After PRisma")

    const body=await c.req.json()
    console.log("Get Body")
    const amountToBet=body.bet
    const risk=body.risk
    const userId=c.get("userId")
    try{
    const originalWalletamt=await prisma.user.findFirst({
        where: {
            id: userId
        },
        select:{
            money: true
        }

    })
    const {money} = originalWalletamt
    console.log("Orignal Bet",{money})
    let outcome = 0;
    const pattern = []
    for (let i = 0; i < TOTAL_DROPS; i++) {
        if (Math.random() > 0.5) {
            pattern.push("R")
            outcome++;
        } else {
            pattern.push("L")
        }
    }
    let multiplier=0
    if(risk==2){
         multiplier = MULTIPLIERS_MEDIUM[outcome];
    }
    else if(risk==3){
         multiplier = MULTIPLIERS_HIGH[outcome];
    }
    else{
         multiplier = MULTIPLIERS_LOW[outcome];
    }
    const possiblieOutcomes = outcomes[outcome];
    


    let updatedAmount=0.0
    if(multiplier == 1)
        updatedAmount=money
    else if(multiplier > 1)
        updatedAmount=money + amountToBet * multiplier
    else
        updatedAmount=money - amountToBet * multiplier


    const profitLoss=  multiplier * amountToBet -amountToBet;

    const walletAmount=await prisma.user.update({
      where:{
        id: userId,
      },
      data:{

        money:updatedAmount
      }

    })
    
    return c.json({
        point: possiblieOutcomes[Math.floor(Math.random() * possiblieOutcomes.length || 0)],
        multiplier,
        pattern,
        walletAmount, profitLoss
    })
  } catch (e) {
    console.error(e);
    c.status(500);
    return c.json({ error: 'Internal Server Error' });
  }


})