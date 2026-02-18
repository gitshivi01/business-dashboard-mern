const Product = require('../models/Product');


exports.getAllProducts= async (req,res) => {
    try{
        const products= await Product.find().populate('createdBy', 'name email');
        res.json(products);
    }
  catch(error){
    res.status(500).json({message: error.message});
  }

};

exports.getProductById= async (req, res) => {
    try{
        const product=await Product.findById(req.params.id);;
        if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
} catch(error) {
    res.status(500).json({message: error.message});
}
};
exports.createProduct= async (req, res) => {
    try{
        const {name, description, price, category, stock}= req.body;

        const product= await Product.create({name, description, price, category, stock, createdBy:req.userId});

        res.status(201).json(product);
    }catch(error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateProduct= async(req,res) =>  {
    try{
        const { name, description, price, category, stock } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
    
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};