module.exports = function(UserAccount) {
    
    return async function(name, email, password) {
        
        const { UserRole } = UserAccount.app.models;
        
        const adminUserRole = await UserRole.findOne({
            where: { name: "admin" }
        });
        
        if (!adminUserRole) {
            console.error("unable to find admin user role");
            throw new Error("Internal server error try again");
        }
        
        const user = {
            userRoleId: adminUserRole.id,
            name,
            email,
            password
        };
        
        const createdUser = await UserAccount.create(user);
        
        return createdUser;
    
    };

};