import Product from '../models/Product.js'
import express from 'express'

export const getProducts = async () => {
    return await Product.find()
}

export const createProducts = async (data) => {
    const product = data

    if (!product) {
        return {
            "sucess": false,
            "message": "No product data given"
        }
    }

    return await Product.create(product)
}

export const getProductById = async (id) => {
    return await Product.findById(id)
}

export const getProductByName = async (name) => {
    if (!name) {
        throw new Error('No product name given')
    }

    const productInfo = await Product.findOne({ name: new RegExp(name, 'i') })

    if (!productInfo) {
        throw new Error('Product not found')
    }

    return productInfo
}
export const updateProduct = async (id, data) => {
    return await Product.findByIdAndUpdate(id, data, { new: true })
}

export const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id,)
}