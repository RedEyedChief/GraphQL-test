import cors       from "cors";
import bodyParser from "body-parser";

export default {
    json : ( ...args ) => {
        const fn = bodyParser.json({
                limit  : 1024 * 1024,
                verify : ( req, res, buf ) => {
                    try {
                        if ( buf.length !== 0 ) JSON.parse(buf);
                    } catch (e) {
                        console.log(e);

                        res.send({
                            status : 0,
                            error  : {
                                code    : "BROKEN_JSON",
                                message : "Please, verify your json"
                            }
                        });
                        throw new Error("BROKEN_JSON");
                    }
                }
            });

        return fn( ...args );
    },
    cors       : cors({ origin: "*" })
};