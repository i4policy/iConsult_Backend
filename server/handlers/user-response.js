module.exports = function (UserAccount) {
    return async function(documentId, options) {

        const { Review, Comment, Annotation } = UserAccount.app.models;

        let userId = options.accessToken.userId;

        let filter = {
            documentId: documentId,
            userId: userId
        };

        let annotations = await Annotation.find(filter);

        delete filter.documentId;

        let reviews = await Review.find(filter);

        let comments = await Comment.find(filter);

        console.log(annotations, reviews, comments);

    };
}