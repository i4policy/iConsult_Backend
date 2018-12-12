module.exports = function(UserAccount) {
    return async function(name, userId) {
        
        try {

            let user = await UserAccount.findOne({where: {facebookID: userId}, include: ["userRole"]});

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
                name: name,
                facebookID: userId,
                email: `${userId}@facebook.com`,
                password: userId
            });

            user = await UserAccount.findOne({where: {facebookID: userId}, include: ["userRole"]});

            let accessToken = await user.accessTokens.create();

            user.auth_token = accessToken.id;

            return user;
            
        } catch(error) {
            
            throw error;
            
        }
        
    };
};