import User from '../models/db/user.model';

class Admin {

    static async getAllUsers (req, res) {
        const users = await User.find({});
        res.status(200).json({
            status: 200,
            data: users,
        })
    }
  }

//const update=async (req,res,next)=>{
  //  const {id}=req.query
    //let updatedData={

      // name:req.body.name,
       //email:req.body.email,
       //password:req.body.password,
       //role:req.body.role,
   // }
    //const user=await User.findByIdAndUpdate(id,{$set:updatedData})
    //try{
      // if(!user){
        //   const error=new Error('User not found.')
          // error.statusCode=404;
           //throw error
    //   }
      // res.status(200).json({
        //   message:"user updated",user:user
       //});
   //}
   //catch(err){
     //  if(!err.statusCode){
       //    err.statusCode=500;
       //}
      
     //}
      //next(err);
   //}

export default Admin