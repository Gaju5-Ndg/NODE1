 import User from '../models/body/user.model';
 import validation from '../helpers/validation';    
 import Authenticate from '../helpers/authenticate';   
 import UserModel from '../models/db/user.model';    
 import Mongoose  from 'mongoose';
 import jwt from 'jsonwebtoken';
import sendEmail from '../helpers/sendEmail';
import sendResetEmail from '../helpers/sendResetEmail';


const _=require('lodash')
             
class UserController {
    static async signup(req, res) {
         const {names,email, password} = req.body;
         const loEmail = email.toLowerCase();
         const { error } = validation.registerValidations(User.createUser(req));

         if (error) {
             return res.status(400).json({
                 status: 400,
                 message: error.details[0].message.replace(/"/g,'')
             });
         }
        const result = await UserModel.find({email: loEmail})
            if(result.length) {
                return res.status(409).json({
                    status:409,
                    message:"Email already exists, try another one",
                })
            }
            const hashedPassword = Authenticate.hashPassword(password);
            
            const user = new UserModel({
                _id: new Mongoose.Types.ObjectId(),
                names: names,
                email: loEmail,
                password: hashedPassword,
                status: 'active'
            });

            
            user.save()
                .then(() => {
                    res.status(201).json({
                        message: "heyy , you have created an account",
                        status: 201,
                    });
                    sendEmail(email,names)
                }).catch(err => {
                    res.status(500).json({
                        message: "check your internnet",
                        status: 500
                    })
                })
        }
      
    static signin (req,res) {
        const {email, password} = req.body;

        const { error } = validation.loginValidations(User.loginUser(req));

         if (error) {
             return res.status(400).json({
                 status: 400,
                 message: error.details[0].message.replace(/"/g,'')
             });
         }

        const loEmail = email.toLowerCase();

        UserModel.find({email:loEmail}, (error, result) => {

            if(result.length){
            const compared = Authenticate.comparePassword(password, result[0].password)

            if(compared) {
                res.status(200).json({
                    message: "you are logged in successfully",
                    status: 200,
                    token: Authenticate.generateToken(result[0])
                });
            } else {
                    res.status(400).json({
                        message: "incorrect input or password",
                        status: 403,
                    });
            }
            }else {
                res.status(400).json({
                    message: "incorrect input or password",
                    status: 403,
                });
            }
            
        });
    }


    // forget

      
       
    static forgetPassword=(req,res)=>{
        try {
            const {email}=req.body;
            UserModel.findOne({email},(err,user)=>{
                if(err || !user){
                    return res.status(400).json({error:"user of this email does not exists"})
                }
                
                const restoken=jwt.sign({_id: user._id},process.env.TOKENSECRET,{expiresIn:'20m'});
                req.token = restoken
                req.user = user
                const mailOption= {
                    from: `"Gaju"<${process.env.EMAIL}>`,
                    to: email,
                    subject: 'Reset your password',
                    html: `<p>Dear User, you  requested a password reset to restore access to your account.</p> <br> <a href=${process.env.FRONTEND_URL}/userRoute/reset-password?token=${restoken}><b>Reset password Link</b></a>`,
                    name: 'Welcome to My Books, Click on the link below to reset  your Password',
                    body:`<a href=${process.env.FRONTEND_URL}/userRoute/verification?token=${restoken}>Link</a>`
                };
        const userData={
            user,
            resentLink:restoken
        }
        console.log(userData)
        // // user.resentLink=token
       
        return UserModel.updateOne({_id: user._id},userData, (err,success)=>{
            if(err){
                return res.status(400).json({error:err})
                            }
                            else{
                                // console.log(transport)
                                const sendmail =sendResetEmail(mailOption);
                                    if(sendmail){
                                        return res.json({message:'Email has been sent, kindly follow the instructions',userData});
                                    }
                                   
                                
                             
                            }
        })
            })
        } catch (error) {
        
            return res.status(500).json(error.message)
        }
    }

    // reset password

   static resetPassword=(req,res)=>{
        const{resentLink,newPassword}=req.body;
        if(resentLink){
            jwt.verify(resentLink,process.env.TOKENSECRET,function(error,decodedToken){
                if(error){
                    return res.json({
                        error:"incorrect token or it is expired"
                    })
                }
                UserModel.findOne({resentLink},(err,user)=>{
                    if(err || !user){
                        return res.status(400).json({error:' user of this token does not exists'})
                    }
                    const obj={
                        ...user,
                        password:newPassword
                    }
                    user=_.extend(user,obj);
                    // res.json({user})
                    user.save((err,result)=>{
                        if(result){
                            return res.status(200).json({message:'Your password has been changed'});
                        }
                        else{
                            return res.status(400).json({error:"reset password error"}) 
                        }
                    })
                })
            })
        }
        else{
            return res.status(400).json({error:'Authentication Error'})
        }
}


}

export default UserController;