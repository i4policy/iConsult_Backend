const fetch = require("node-fetch");

module.exports = function(UserAccount) {
    return async function(auth_token) {
        
        try {
            
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${auth_token}`);

            if (!response.ok) {
                let error = new Error("Invalid google auth token");
                error.status = 403;
                throw error;
            }
            
            let data = await response.json();

            let user = await UserAccount.findOne({where: {googleID: data.sub}, include: ["userRole"]});

            if (user) {

                let authToken = await user.accessTokens.create({});

                user.auth_token = authToken.id;

                return user;

            }
        
            const { UserRole } = UserAccount.app.models;
            
            const regularUserRole = await UserRole.findOne({
                where: { name: "regular" }
            });
            
            if (!regularUserRole) {
                console.error("unable to find regular user role");
                throw new Error("Internal server error try again");
            }

            user = await UserAccount.create({
                userRoleId: regularUserRole.id,
                name: data.name,
                googleID: data.sub,
                email: data.email,
                password: data.sub
            });

            user = await UserAccount.findOne({where: {googleID: data.sub}, include: ["userRole"]});

            let accessToken = await user.accessTokens.create({});

            user.auth_token = accessToken.id;

            return user;
            
        } catch(error) {
            
            throw error;
            
        }
        
    };
};