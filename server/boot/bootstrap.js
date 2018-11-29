module.exports = async function(app) {

    app.dataSources.mongo.autoupdate();

    const User = app.models.UserAccount;
    const UserRole = app.models.UserRole;

    const email = "admin@i4policy.org";
    
    UserRole.registerResolver("$admin", async (role, context) => {

        if (!context.accessToken || !context.accessToken.userId) return false;

        return context.accessToken.$userInfo.userRole.name === "admin";

    });

    try {

        let role = await UserRole.findOrCreate({
            name: "regular",
            description: "Regular user"
        });

        role = await UserRole.findOrCreate({
            name: "admin",
            description: "Administrator user"
        });

        await User.findOrCreate({where: {email: email}},{
            name: "I4Policy Administrator",
            email: email,
            password: "password",
            userRoleId: role[0].id
        });

    } catch(error) {

        throw error;

    }

};