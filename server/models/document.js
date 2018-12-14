'use strict';

const stats = require("../handlers/stats");
const report = require("../handlers/report");
const clone = require("../handlers/clone");

module.exports = function(Document) {

    Document.stats = stats(Document);

    Document.report = report(Document);

    Document.clone = clone(Document);
    
    Document.remoteMethod("stats", {
        
        description: "various stats for the document",
        
        accepts: [
            { arg: "documentId", type: "string", required: true },
            { arg: "options", type: "object", http: "optionsFromRequest" }
        ],
        
        returns: {
            type: "object",
            root: true
        },
        
        http: { verb: "get", path: "/stats" }
        
    });
    
    Document.remoteMethod("report", {
        
        description: "various stats for the document",
        
        accepts: [
            { arg: "documentId", type: "string", required: true },
            { arg: "options", type: "object", http: "optionsFromRequest" }
        ],
        
        returns: {
            type: "object",
            root: true
        },
        
        http: { verb: "get", path: "/report" }
        
    });
    
    Document.remoteMethod("clone", {
        
        description: "clone document with sections",
        
        accepts: [
            { arg: "documentId", type: "string", required: true },
            { arg: "options", type: "object", http: "optionsFromRequest" }
        ],
        
        returns: {
            type: "object",
            root: true
        },
        
        http: { verb: "get", path: "/:id/clone" }
        
    });

};
