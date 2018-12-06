'use strict';

module.exports = function(Review) {

    Review.observe("before save", (context, next) => {

        if (context.instance) {

            context.instance.userId = context.options.accessToken.userId;

        }

        next();

    });

};
