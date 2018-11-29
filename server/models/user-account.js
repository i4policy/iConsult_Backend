'use strict';

const facebookLogin = require("../handlers/facebook");
const googleLogin = require("../handlers/google");
const twitterLogin = require("../handlers/twitter");
const localSignup = require("../handlers/local");

module.exports = function(UserAccount) {
    
    UserAccount.facebookLogin = facebookLogin(UserAccount);
    UserAccount.googleLogin = googleLogin(UserAccount);
    UserAccount.twitterLogin = twitterLogin(UserAccount);
    UserAccount.registerUser = localSignup(UserAccount);

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
        
        const user = await UserAccount.find({where: {id: result.userId}, include: ["userRole"]});
        
        ctx.result.userRole = user[0].userRole;
        
    });
    
    UserAccount.remoteMethod("facebookLogin", {
        description: "facebook login",
        accepts: [
            {arg: "id", type: "string", required: true},
            {arg: "name", type: "string", required: true}
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
    
    UserAccount.remoteMethod("googleLogin", {
        description: "google login",
        accepts: [
            {arg: "id", type: "string", required: true},
            {arg: "name", type: "string", required: true}
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
    
    UserAccount.remoteMethod("twitterLogin", {
        description: "twitter login",
        accepts: [
            {arg: "id", type: "string", required: true},
            {arg: "name", type: "string", required: true}
        ],
        returns: {
            type: "object",
            root: true
        },
        http: {
            verb: "post",
            path: "/twitterLogin"
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
    
    
};
