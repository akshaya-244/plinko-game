import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

import { Hono } from "hono";
import { cors } from "hono/cors";
import { signupInput } from "../zod/zod";
import { sign } from "hono/jwt";
import { compress } from 'hono/compress';

export const usersRouter =new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables:{
        userId: string
    }
    

}>();

usersRouter.use('/*',cors())




usersRouter.post('/signup', async(c) => {
    const prisma=new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    if(!c.env.DATABASE_URL || !c.env.JWT_SECRET){
        throw new Error('Environment variables DATABASE_URL or JWT_SECRET are not defined')
    }
    const body=await c.req.json();
    const {success}=signupInput.safeParse(body)
    if(!success){
        c.status(411)
        return c.json({
            message: "Inputs are incorrect"
        })
    }
    try
    {
        const existingUser=await prisma.user.findUnique({
            where: {
                email: body.email
            }
        });    
        if(existingUser){
            c.status(409)
            return c.json({error: "Email already in use"});
        }
        const user=await prisma.user.create({
            data:{
                name: body.name,
                email: body.email,
                password: body.password,
                money: 10.0
            }
        })
        const jwt=await sign({id: user.id}, c.env.JWT_SECRET);
        return c.json({jwt})
        
    }
    catch(e){
        c.status(403);
        return c.text(`${e}`)
    }
})

usersRouter.post('/login',async(c)=>{
    const prisma=new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    if(!c.env.DATABASE_URL || !c.env.JWT_SECRET){
        throw new Error('Environment variables DATABASE_URL or JWT_SECRET are not defined')
    }
    const body= await c.req.json()
    try{
    const user= await prisma.user.findFirst({
        where:{
            email: body.email,
            password: body.password
        }
    })
    console.log(user)

    if(!user){
        c.status(409)
        return c.json({error: "Email or password is incorrect"})
    }
    const jwt=await sign({id: user.id}, c.env.JWT_SECRET)
    return c.json({jwt})

    }
    catch(e){
        c.status(403)
        return c.json("Error logging in")
    }

})

