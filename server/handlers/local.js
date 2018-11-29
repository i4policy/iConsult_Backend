const fetch = require("node-fetch");

module.exports = function(UserAccount) {
    
    return async function(name, email, phone_number, password, captcha) {
        
        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captcha}`, {
            method: "POST"
        });
    
        const data = await response.json();
        
        if (!data.success) {
            let error = new Error("Recaptcha Failed");
            error.status = 403;
            throw error;
        }
        
        const { UserRole } = UserAccount.app.models;
        
        const regularUserRole = await UserRole.findOne({
            where: { name: "regular" }
        });
        
        if (!regularUserRole) {
            console.error("unable to find regular user role");
            throw new Error("Internal server error try again");
        }
        
        const user = {
            userRoleId: regularUserRole.id,
            name,
            email,
            password,
            phone_number
        };
        
        const createdUser = await UserAccount.create(user);
        
        return createdUser;
    
    };

};