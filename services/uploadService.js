// services/uploadService.js
import supabase from '../config/database.js'
import { v4 as uuidv4 } from 'uuid'

export const uploadProductImage = async (fileBuffer, mimetype) => {
    const extension = mimetype.split('/')[1]  // e.g. 'jpeg', 'png'
    const fileName = `${uuidv4()}.${extension}` // unique name e.g. abc-123.png

    if (!mimetype || !mimetype.includes('/')) {
        throw new Error('Invalid mimetype')
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!allowedTypes.includes(mimetype)) {
        throw new Error('Invalid file type')
    }

    if (fileBuffer.length > 2 * 1024 * 1024) {
        throw new Error("Image too large. Kindly choose another image")
    }
    const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, fileBuffer, {
            contentType: mimetype,
            upsert: false
        })

    if (error) throw error

    // Get the public URL
    const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

    return urlData.publicUrl
}