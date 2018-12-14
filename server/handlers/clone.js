module.exports = function(Document) {
    return async function(documentId) {

        const { Section } = Document.app.models;

        let document = await Document.find({
            where: {
                id: documentId
            }
        });

        document = document[0];

        let sections = await Section.find({
            where: {
                documentId: documentId
            }
        });

        document = {
            title: `${document.title} clone @ ${Date.now()}`,
            content: document.content,
            draft: true
        };

        document = await Document.create(document);

        for (let i in sections) {

            let section = sections[i];

            section = {
                title: section.title,
                content: section.content,
                documentId: document.id
            };

            await Section.create(section);

        }
        
        return document;

    };
};