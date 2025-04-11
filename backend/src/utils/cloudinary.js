import {v2 as cloudinary} from "cloudinary"

import fs from "fs"


cloudinary.config({ 
  cloud_name:'dbrm5pijb', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});



const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // // file has been uploaded successfull
        // console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
      console.log(error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}


const deleteFromCloudinary = async (oldCoverUrl) => {
    try {
      // Extract the public_id from the Cloudinary URL
      const publicId = oldCoverUrl.split('/').pop().split('.')[0]; // Extracts the file name (before the extension)
  
      
      
      // Delete the image from Cloudinary
      const result = await cloudinary.uploader.destroy(publicId);
  
      console.log("Result : ", result);
      // Handle the result of the deletion
      if (result.result === "ok") {
        
        return true;
      } else {
       
        return false;
      }
  
    } catch (error) {
     
      return false;
    }
  };
  


export {uploadOnCloudinary,deleteFromCloudinary}