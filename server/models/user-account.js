'use strict';

const facebookLogin = require("../handlers/facebook");
const googleLogin = require("../handlers/google");
const localSignup = require("../handlers/local");
const registerAdminUser = require("../handlers/admin-register");
const passwordReset = require("../handlers/password-reset");
const userResponse = require("../handlers/user-response");
const botLogin = require("../handlers/bot-login");

module.exports = function(UserAccount) {
    
    UserAccount.facebookLogin = facebookLogin(UserAccount);
    UserAccount.googleLogin = googleLogin(UserAccount);
    UserAccount.registerUser = localSignup(UserAccount);
    UserAccount.registerAdminUser = registerAdminUser(UserAccount);
    UserAccount.userResponse = userResponse(UserAccount);
    UserAccount.botLogin = botLogin(UserAccount);


    UserAccount.on("resetPasswordRequest", passwordReset(UserAccount));

    UserAccount.beforeRemote("login", async(ctx, result) => {

        let captcha = ctx.req.body.captcha;
        
        const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${captcha}`, {
            method: "POST"
        });
    
        const data = await response.json();
        
        if (!data.success) {
            let error = new Error("Recaptcha Failed");
            error.status = 403;
            throw error;
        }

    });
    
    
    UserAccount.afterRemote("login", async (ctx, result) => {
        
        let user = await UserAccount.find({where: {id: result.userId}, include: ["userRole"]});

        user = user[0];

        user.auth_token = result.id;
        
        ctx.result = user;
        
    });
    
    UserAccount.remoteMethod("facebookLogin", {
        description: "facebook login",
        accepts: [
            {arg: "auth_token", type: "string", required: true}
        ],
        returns: {
            type: "object",
            root: true
        },
        http: {
            verb: "post",
            path: "/facebookLogin"
        }
    });
    
    UserAccount.remoteMethod("botLogin", {
        description: "facebook bot login",
        accepts: [
            {arg: "name", type: "string", required: true},
            {arg: "id", type: "string", required: true}
        ],
        returns: {
            type: "object",
            root: true
        },
        http: {
            verb: "post",
            path: "/botLogin"
        }
    });
    
    UserAccount.remoteMethod("googleLogin", {
        description: "google login",
        accepts: [
            {arg: "auth_token", type: "string", required: true},
        ],
        returns: {
            type: "object",
            root: true
        },
        http: {
            verb: "post",
            path: "/googleLogin"
        }
    });
    
    UserAccount.remoteMethod("registerUser", {
        
        description: "regular user registration method",
        
        accepts: [
            { arg: "name", type: "string", required: true },
            { arg: "email", type: "string", required: true },
            { arg: "phone_number", type: "string", required: false},
            { arg: "password", type: "string", required: true },
            { arg: "captcha", type: "string", required: true }
        ],
        
        returns: {
            type: "object",
            root: true
        },
        
        http: { verb: "post", path: "/sign-up" }
        
    });
    
    UserAccount.remoteMethod("registerAdminUser", {
        
        description: "admin user registration method",
        
        accepts: [
            { arg: "name", type: "string", required: true },
            { arg: "email", type: "string", required: true },
            { arg: "password", type: "string", required: true }
        ],
        
        returns: {
            type: "object",
            root: true
        },
        
        http: { verb: "post", path: "/register-admin" }
        
    });
    
    UserAccount.remoteMethod("userResponse", {
        
        description: "compiled user response method",
        
        accepts: [
            { arg: "documentId", type: "string", required: true },
            { arg: "options", type: "object", http: "optionsFromRequest" }
        ],
        
        returns: {
            type: "object",
            root: true
        },
        
        http: { verb: "get", path: "/response" }
        
    });
    
    
};
