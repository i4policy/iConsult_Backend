module.exports = function(Document) {
    return async function(documentId, options) {
        
        let data = {
            sections: {}
        };
        
        const { Section, Annotation } = Document.app.models;
        
        const { Comment, Review, Rate } = Section.app.models;
        
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
            
            let rc = await Review.find({
                where: {
                    sectionId: section.id
                }
            });
            
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
            
            rc = rc.length;
            
            cc = cc.length;

            rac = rac.length;

            let averageRating = Math.round(totalRating / rac);
            
            data.sections[section.title] = {
                reviews: rc,
                comments: cc,
                ratings: rac,
                averageRating: averageRating,
                totalEngagement: rc + cc + rac
            };
            
        }
        
        return data;
        
    }
};