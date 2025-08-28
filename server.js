const path = require("path");
const fs = require("fs");

module.exports = function({resources, options}) {
    return {
        name: "serveNodeModules",
        async middleware(req, res, next) {
            // Example: serve xlsx.min.js
            if (req.path === "/resources/libs/xlsx.full.min.js") {
                const filePath = path.join(process.cwd(), "node_modules", "xlsx", "dist", "xlsx.full.min.js");
                if (fs.existsSync(filePath)) {
                    res.type(".js");
                    res.send(fs.readFileSync(filePath));
                    return;
                }
            }
            next();
        }
    };
};