'use strict';

module.exports = function(Comment) {

    Comment.observe("before save", (context, next) => {

        if (context.instance) {

            context.instance.userId = context.options.accessToken.userId;

        }

        next();

    });

};
