module.exports = function(Document) {
    return async function (documentId) {

        const { Section } = Document.app.models;

        const { Review, Comment } = Section.app.models;

        const { UserAccount } = Section.app.models;

        let data = {};

        let sections = await Section.find({
            where: {
                documentId: documentId
            }
        });

        let users = await UserAccount.find({});

        for (let i in sections) {

            let section = sections[i];

            data[section.title] = [];

            for (let i in users) {

                let user = users[i];

                let filter = {
                    where: {
                        sectionId: section.id,
                        userId: user.id
                    }
                };

                let review = await Review.find(filter);

                let comment = await Comment.find(filter);

                review = review[0] ? review[0].content : "Not Provided";

                comment = comment[0] ? comment[0].content : "Not Provided";

                data[section.title].push({
                    userId: user.id,
                    comment: comment,
                    review: review
                });

            }

        }

        return data;
        
    };
};