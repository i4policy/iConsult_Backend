const fetch = require("node-fetch");

module.exports = function(UserAccount) {
    return async function(auth_token) {
        
        try {
            
            const response = await fetch(`https://graph.facebook.com/me?access_token=${auth_token}`);

            if (!response.ok) {
                let error = new Error("Invalid facebook auth token");
                error.status = 403;
                throw error;
            }
            
            let data = await response.json();

            let user = await UserAccount.findOne({where: {facebookID: data.id}, include: ["userRole"]});

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
                facebookID: data.id,
                email: `${data.id}@facebook.com`,
                password: data.id
            });

            user = await UserAccount.findOne({where: {facebookID: data.id}, include: ["userRole"]});

            let accessToken = await user.accessTokens.create();

            user.auth_token = accessToken.id;

            return user;
            
        } catch(error) {
            
            throw error;
            
        }
        
    };
};