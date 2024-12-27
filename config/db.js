import mongoose from 'mongoose'

export const connectDB =  async () =>{
    await mongoose.connect('mongodb+srv://jimcarrechat:Trevorbelmont631289@cluster0.m6mbr.mongodb.net/food-del').then(()=>console.log("DB Connected"))
}
