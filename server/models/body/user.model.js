    const createUser = req => {
        const createuser = {
            email: req.body.email,
            names: req.body.names,
            password: req.body.password
        }

        return createuser;
    }
    
    const changeRole=req =>{
        const role= {
            role: req.body.role,
        }
         
        return role;
    }
    const changeStatus=req =>{
        const status= {
            role: req.body.status,
        }

        return status;
    }
         
    const loginUser = req => {
        const user = {
            email: req.body.email,
            password: req.body.password,
        }

        return user;
    }


export default {createUser, loginUser, changeRole, changeStatus};