import GraphQLClient    from "../GraphQLClient";
import LIVR             from "livr";

let ProductCreation = async function( req, res ) {
    try {
        const productData = validateData( req.body );

        const query = `
            mutation productCreate($input: ProductInput!) {
                productCreate(input: $input) {
                    product {
                        id
                        title
                    }
                }
            }
        `;
        const variables = {
            "input": {
                "title": productData.title
            }
        };
        const createdProduct = await GraphQLClient.request({
            document: query,
            variables: variables
        });

        const tagsArr = productData.tags;
        const metafieldsArr = [];

        for (let i=0; i<tagsArr.length; i++) {
            //const newArr = tagsArr.toSpliced(i, 0); /* available in node v20 */
            const newArr = [...tagsArr];
            newArr.splice(i, 1);
            metafieldsArr.push({
                [tagsArr[i]]: newArr.join()
            });
        }

        createdProduct.productCreate.product["metafields"] = metafieldsArr;

        res.status(200).send( createdProduct );
    } catch ( error ) {
        console.error(error);
        if ( error.type ) {
            const validationError = {
                status : 0,
                error  : {
                    code    : error.type,
                    message : error.message
                }
            };
            res.status(406).send( validationError );
        } else {
            const commonError = {
                status : 0,
                error  : {
                    code    : "SERVER_ERROR",
                    message : error.message ? error.message : error
                }
            };
            res.status(500).send( commonError );
        }
    }
};

function validateData( data ) {
    extendLIVR();
    const validator = new LIVR.Validator({
        title   : [ "required", "string" ],
        tags    : [ "required", "not_empty_list", { "list_of": "string" } ]
    });
    
    const validData =  validator.validate(data);

    if ( validData ) {
        return validData;
    } else {
        throw {
            type: "NONVALID",
            message: validator.getErrors()
        };
    }
}

function extendLIVR() {
    const stringExtend = function() {
        return value => {
            if ( typeof value !== "string" ) return "NOT_STRING";
        };
    };
    LIVR.Validator.registerDefaultRules({ string: stringExtend });
}

export default ProductCreation;