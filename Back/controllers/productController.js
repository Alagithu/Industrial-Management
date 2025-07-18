const Product = require('../models/Product');
const bcrypt=require('bcrypt');
const fs=require('fs');
//********************************************** */
const getAllProducts = async(req,res)=>{

const products = await Product.find();

if (!products.length){
    return res.status(400).json({message: "No products found"});
}
res.json(products);

}
//********************************************************** */
const filtrerByCategory = async(req,res)=>{

    const {category}=req.params;
try{
    const products = await Product.find({category});
if(!products.length){
    return res.status(400).json({message: "No products found"});
}
return res.status(200).json(products);
}
catch(err){
    console.error(err);
    return res.status(500).json({message:"server error"})
}   
    }
/*-------------------------------------------------------------------------------------------------*/
const addProduct = async (req, res) => {
    const { name, category, stock, rating } = req.body;
  
    // Check for missing fields
    if (!name || !category  || !stock || !rating ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const duplicatedName = await Product.findOne({ name }).exec();
  
      if (duplicatedName) {
        return res.status(409).json({ message: "Product already exists" });
      }
  
      await Product.create({
        name,
        category,
        stock,
        rating,
      });
  
      return res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

  //************************************************************** */
  const updateProduct = async (req, res) => {
    const { name, category, stock, rating } = req.body;
    if (!name || !category || !stock || !rating) {
        return res.status(400).json({ message: "All fields are required" });
    }  
    try {
        const {id}=req.params;
        const product = await Product.findById(id);
  // Update product details
    product.name = name;
    product.category = category;
    product.stock = stock;
    product.rating = rating;

    // Save the updated product
    await product.save();

    return res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
    }
};
  //*************************************************************** */
  const deleteProduct = async (req, res) => {  
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Prduit supprimée.' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
};

    //***************************************************** */

    const filtreProduct = async (req,res) => {
        const  {category,minPrice,maxPrice,minRating,maxRating}=req.querry ;
        let filtreCriteria = {}
        if(category) {
            filtreCriteria.category=category;
        }
        if(minPrice || maxPrice ){
            filtreCriteria.price = {}
            if(minPrice) filtreCriteria.price.$gte = minPrice ;
            if(maxPrice) filtreCriteria.price.$lte = maxPrice ;
    
        }
        if(minRating || maxRating ){
            filtreCriteria.Rating = {}
            if(minRating) filtreCriteria.Rating.$gte = minRating;
            if(maxRating) filtreCriteria.Rating.$lte = maxRating ;
            console.log(filtreCriteria);
        }
        
        try {
         const products =   await Product.find(filtreCriteria) ;
         if(products.length===0){
            return res.status(404).json({message : "No products found"})
         }
         return res.status(200).json({
            count:products.length ,
            products
         })
        }catch(error) {
            console.error(error) ;
            return res.status(500).json({ message: "Erreur serveur" });
    
        }
    } 
    //************************************************************* */
    const paginateProducts=async(req,res)=>{
        const {page,limit}=req.query;
       
        try{
            const products=await Product.find().skip((page-1)*limit)
            if(!products.length){
                return res.status(400).json({message: "No products found for this category"});
            }
            return res.status(200).json(products);
            }
            catch(err){
                console.error(err);
                return res.status(500).json({message:"server error"})
        }
    }

    module.exports = {filtrerByCategory,filtreProduct,paginateProducts,getAllProducts,addProduct,updateProduct,deleteProduct};