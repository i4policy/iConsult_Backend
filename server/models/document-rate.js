'use strict';

module.exports = function(DocumentRate) {
    
    DocumentRate.observe("before save", (context, next) => {
        
        if (context.instance) {
            
            context.instance.userId = context.options.accessToken.userId;
            
        }
        
        next();
        
    });

};
