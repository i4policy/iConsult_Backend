let converter = require("json-2-csv");

let fs = require("fs");

let zip = require("zip-folder");

function writeFile(name, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(name, content, 'utf-8', function(err) {
            if (err) reject(err);
            resolve(content);
        });
    })
}

function zipFolder(folder) {
    return new Promise((resolve, reject) => {
        zip(folder, `${folder}.zip`, function(err) {
            if (err) reject(err);
            resolve();
        });
    })
}

module.exports = function(Document) {
    return async function (documentId, res) {
        
        const { Section, DocumentRate, DocumentComment } = Document.app.models;
        
        const { Comment, Rate } = Section.app.models;
        
        const { UserAccount } = Section.app.models;
        
        let data = {};
        
        let now = new Date();
        
        fs.mkdirSync(`./${now}`);
        
        let sections = await Section.find({
            where: {
                documentId: documentId
            }
        });

        let document = await Document.findById(documentId);

        data[document.title] = [];
        
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
                
                let comment = await Comment.find(filter);
                
                let rate = await Rate.find(filter);

                let documentComment = await DocumentComment.find({
                    where: {
                        documentId: documentId,
                        userId: user.id
                    }
                });

                let documentRate = await DocumentRate.find({
                    where: {
                        documentId: documentId,
                        userId: user.id
                    }
                });
                
                comment = comment[0] ? comment[0].content : "Not Provided";
                
                rate = rate[0] ? rate[0].content : "Not Provided";

                documentComment = documentComment[0] ? documentComment[0].content : "Not Provided";

                documentRate = documentRate[0] ? documentRate[0].content : "Not Provided";

                data[document.title].push({
                    userId: user.id.toString(),
                    comment: documentComment,
                    rate: documentRate
                });
                
                data[section.title].push({
                    userId: user.id.toString(),
                    comment: comment,
                    rate: rate
                });
                
            }
            
            let csv = await converter.json2csvPromisified(data[section.title]);
            
            await writeFile(`${now}/${section.title}.csv`, csv);

            csv = await converter.json2csvPromisified(data[document.title]);

            await writeFile(`${now}/${document.title}.csv`, csv);
            
        }

        await zipFolder(`./${now}`);

        res.type("application/zip");

        res.status(200);

        res.download(`./${now}.zip`);
        
    };
};