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
        
        const { Section } = Document.app.models;
        
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
                
                comment = comment[0] ? comment[0].content : "Not Provided";
                
                rate = rate[0] ? rate[0].content : "Not Provided";
                
                data[section.title].push({
                    userId: user.id.toString(),
                    comment: comment,
                    rate: rate
                });
                
            }
            
            let csv = await converter.json2csvPromisified(data[section.title]);
            
            await writeFile(`${now}/${section.title}.csv`, csv);
            
        }

        zipFolder(`./${now}`);

        let reader = fs.createReadStream(`./${now}.zip`);

        res.type("application/octet-stream");

        res.download(`./${now}.zip`);
        
    };
};