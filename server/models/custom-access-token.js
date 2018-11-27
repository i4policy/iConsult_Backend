'use strict';

module.exports = function(CustomAccessToken) {
    CustomAccessToken.observe("before save", async ctx => {
        if (ctx.instance && ctx.isNewInstance) {
            const { UserAccount } = CustomAccessToken.app.models;
            try {
                const user = await UserAccount.findById(ctx.instance.userId);
                if (user) {
                    delete user.password;
                    ctx.instance.userInfo = user;
                }
            } catch (error) {
                throw error;
            }
        }
    });
};
