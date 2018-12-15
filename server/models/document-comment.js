'use strict';

module.exports = function(DocumentComment) {
    
    DocumentComment.observe("before save", (context, next) => {
        
        if (context.instance) {
            
            context.instance.userId = context.options.accessToken.userId;
            
        }
        
        next();
        
    });

};
