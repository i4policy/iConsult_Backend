module.exports = function(Document) {
    return async function(documentId, options) {
        
        let data = {
            sections: {}
        };
        
        const { Section, Annotation } = Document.app.models;
        
        const { Comment, Rate } = Section.app.models;
        
        let sections = await Section.find({
            where: {
                documentId: documentId
            }
        });
        
        let annotations = await Annotation.find({
            where: {
                documentId: documentId
            }
        });
        
        data["totalAnnotations"] = annotations.length;
        
        for (let i in sections) {
            
            let section = sections[i];
            
            let cc = await Comment.find({
                where: {
                    sectionId: section.id
                }
            });
            
            let rac = await Rate.find({
                where: {
                    sectionId: section.id
                }
            });

            let totalRating = rac.reduce((accumlator, value) => {
                return accumlator + value.content;
            }, 0);
            
            cc = cc.length;

            rac = rac.length;

            let averageRating = Math.round(totalRating / rac);
            
            data.sections[section.title] = {
                comments: cc,
                ratings: rac,
                averageRating: averageRating,
                totalEngagement: cc + rac
            };
            
        }
        
        return data;
        
    }
};