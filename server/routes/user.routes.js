import express from 'express';
import SuperAdmin from "../controllers/superAdmin.controller";
import UserController from '../controllers/user.controller';
import Vendor from '../controllers/vendor.controller';
import verifyLogin from "../middleware/Authorization";
const routes = express();

routes.post('/signup', UserController.signup);
routes.post('/signin',UserController.signin);
routes.get('/users', SuperAdmin.getAllUsers);
routes.post('/forgetPassword',UserController.forgetPassword);

routes.patch('/role', verifyLogin , SuperAdmin.changeRoles);
routes.patch('/status', verifyLogin , SuperAdmin.changeStatus);
//routes.get('/clients',Vendor.getAllClients);
routes.delete('/delete', SuperAdmin.deleteUser);
routes.patch('/disactivate',SuperAdmin.DisableUsers);
routes.post('/resetPassword',UserController.resetPassword);



export default routes;