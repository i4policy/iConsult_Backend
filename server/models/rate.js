'use strict';

module.exports = function(Rate) {
    
    Rate.observe("before save", (context, next) => {
        
        if (context.instance) {
            
            context.instance.userId = context.options.accessToken.userId;
            
        }
        
        next();
        
    });
    
};
