import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sportsproducts.mqsor.mongodb.net/?retryWrites=true&w=majority&appName=sportsproducts`;

const deleteProducts = async (req, res) => {};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client.db("productDB").collection("product");

    const CreateEquipment = async (req, res) => {};

    const getHomeProducts = async (req, res) => {
      let cursor;
      try {
        cursor = productCollection.find().limit(6);
        const homeValues = await cursor.toArray();
        res.status(200).send(homeValues);
      } catch (error) {
        res.status(500).send({ message: "error while fetching data" });
      } finally {
        if (cursor) {
         await cursor.close();
        }
      }
    };
    const getAllProducts = async (req, res) => {
      let cursor;
      try {
        cursor = productCollection.find();
        const homeValues =await cursor.toArray();
        res.status(200).send(homeValues);
      } catch (error) {
        res.status(500).send({ message: "error while fetching data" });
      } finally {
        if (cursor) {
         await cursor.close();
        }
      }
    };
    const getMyProducts = async (req, res) => {
      const { userEmail } = req.query
      try {
        // Query MongoDB for products that match the userEmail
        const products = await productCollection.find({ userEmail }).toArray();
    
        if (products.length === 0) {
          return res.status(404).json({ message: 'No products found for this email.' });
        }
    
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching products.' });
      }
    };

    const viewSingleProduct = async (req, res) => {};

    const addProducts = async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      console.log(result);
      res.send(result);
    };

    app.post("/products", addProducts);
    app.get('/home-products', getHomeProducts)
    app.get('/all-products',getAllProducts)

    await client.db("admin").command({ ping: 1 });
  } catch (e) {
    console.log("failed to connect with the db");
  }
}
run().catch(console.dir);

app.listen(5000, () => {
  console.log("app is running");
});
