module.exports = function(Document) {
    return async function(documentId, options) {

        let data = {};

        const { Section } = Document.app.models;

        const { Comment, Review } = Section.app.models;

        let sections = await Section.find({
            where: {
                documentId: documentId
            }
        });

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

            rc = rc.length;

            cc = cc.length;

            data[section.title] = {
                reviews: rc,
                comments: cc,
                totalEngagement: rc + cc
            };

        }

        return data;

    }
};