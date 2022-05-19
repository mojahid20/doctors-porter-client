const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
require ('dotenv').config();
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qldwn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
     await client.connect()
     const Usercollecttion = client.db("Dantal_portal").collection('Appiontment');
     const bookingCollection = client.db("Dantal_portal").collection('bookings');
     const servicecollecttion = client.db("Dantal_portal").collection('users');
    app.get('/Appiontment', async (req,res)=>{
      const query={};
      const cursor= Usercollecttion.find(query);
      const service= await cursor.toArray()
      res.send(service);
    } );

   




    app.get('/available', async(req,res)=>{
      const date=req.query.date ;


      
      app.put('/user/:email', async (req,res)=>{
        const email=req.params.email;
        const user=req.body;
        const filter = { email:email};
        const options = { upsert: true };
        const updateDoc = {
          $set: user,
        };
        const result = await servicecollecttion.updateOne(filter, updateDoc, options);
        res.send(result)
      })


// get all servces
      const service= await Usercollecttion.find().toArray();
      
// get the booking of that day 
const query = {date: date};
const bookings = await bookingCollection.find(query).toArray();
services.forEach(service=>{
  // step 4: find bookings for that service. output: [{}, {}, {}, {}]
  const serviceBookings = bookings.filter(book => book.treatment === service.name);
  // step 5: select slots for the service Bookings: ['', '', '', '']
  const bookedSlots = serviceBookings.map(book => book.slot);
  // step 6: select those slots that are not in bookedSlots
  const available = service.slots.filter(slot => !bookedSlots.includes(slot));
  //step 7: set available to slots to make it easier 
  service.slots = available;
});


res.send(service)
    })

     app.post('/booking', async (req,res)=>{
       const booking= req.body;
       const query={treatment:booking.treatment, date:booking.date,patient:booking.patient};
       const exist= await bookingcollecttion.findOne(query);
       if(exist){
         return res.send({success:false, booking:exist})
       }
       const result= await bookingcollecttion.insertOne(booking);
       res.send({success:true, result});
     });
     
     console.log('databas is connectd')
    }
    finally{

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello docttoors uncle')
})

app.listen(port, () => {
  console.log(`dantal  app listening on port ${port}`)
})