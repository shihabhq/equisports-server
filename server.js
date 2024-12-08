import express from "express";

import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@sportsproducts.mqsor.mongodb.net/?retryWrites=true&w=majority&appName=sportsproducts`;

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
    const getMyProducts = async (req, res) => {
      const { useremail } = req.query;

      try {
        // Query MongoDB for products that match the userEmail
        const products = await productCollection
          .find({ email: useremail })
          .toArray();

        if (products.length === 0) {
          return res
            .status(404)
            .json({ message: "No products found for this email." });
        }

        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ message: "Error fetching products." });
      }
    };

    const viewSingleProduct = async (req, res) => {
      const { id } = req.params;

      try {
        const query = { _id: new ObjectId(id) };
        const singleProduct = await productCollection.findOne(query);


        if (!singleProduct) {
          return res
            .status(404)
            .json({ message: "No product found with this ID." });
        }

        res.status(200).json(singleProduct);
      } catch (error) {
        res.status(500).json({ message: "Error fetching products." });
      }
    };
    const updateProduct = async (req, res) => {};

    const addProducts = async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      console.log(result);
      res.send(result);
    };
    const deleteProduct = async (req, res) => {
      const { id } = req.params;

      try {
        const query = { _id: new ObjectId(id) };
        const result = await productCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(400).send("no Product found to delete");
      }
    };

    app.post("/products", addProducts);
    app.get("/home-products", getHomeProducts);
    app.get("/all-products", getAllProducts);
    app.get("/my-products", getMyProducts);
    app.get("/product-details/:id", viewSingleProduct);
    app.delete("/delete-product/:id", deleteProduct);

    await client.db("admin").command({ ping: 1 });
  } catch (e) {
    console.log("failed to connect with the db");
  }
}
run().catch(console.dir);

app.listen(5000, () => {
  console.log("app is running");
});
