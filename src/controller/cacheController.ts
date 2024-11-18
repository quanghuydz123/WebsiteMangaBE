import { Request, Response } from 'express';
import APIParamsModel, { IAPIParams } from '../models/APIPramsModel';
import ModelModified from "../models/ModelModified";

// Main function to handle ETag generation and validation
async function getEtag(
    req: Request,
    apiParam: IAPIParams,
    currentModelName: string
): Promise<string | null> {
    try {
        
        // Perform both queries in parallel
        const [cachedAPIParams, modelModified] = await Promise.all([
            // Query APIParamsModel to check if the parameters exist
            APIParamsModel.findOne(apiParam),
            // Query ModelModified to get the last update timestamp for the model
            ModelModified.findOne({ modelName: currentModelName })
        ]);

        if (cachedAPIParams && modelModified) {
            const lastUpdatedAt = modelModified.updatedAt;
            const requestHash = generateETag(cachedAPIParams.params, lastUpdatedAt);
            
            // If the ETag matches the client header, return `null` (indicates 304)
            if (req.headers["if-none-match"] === requestHash) {
                return null; // Data hasn't changed
            }
        }


        // Cache the request parameters if not already cached
        await upsertAPIParamsModel(apiParam); // dont need await because if it fail it not break the system

        // Generate a new ETag based on the latest data
        const newETag = generateETag(apiParam.params, new Date());

        // Update the modification timestamp for the model
        upsertModelModified(currentModelName);  // dont need await because if it fail it not break the system

        return newETag; // Return the new ETag
    } catch (error) {
        console.error("Error in getEtag:", error);
        return null;
    }

}

// Helper function to create or update the ModelModified record
async function upsertModelModified(newModelName: string) {
    try {
        await ModelModified.updateOne(
            { modelName: newModelName },
            { updatedAt: new Date() },
            { upsert: true } // Insert if it doesn't exist
        );

    } catch (error) {
        console.error("Error during createModelModified:", error);
    }
}

// Helper function to generate an ETag using hashing
function generateETag(params: string, lastUpdatedAt: Date): string {
    const crypto = require("crypto");
    const rawString = `${params}_${lastUpdatedAt.getTime()}`;
    return crypto.createHash("md5").update(rawString).digest("hex");
}

// Helper function to upsert APIParamsModel
async function upsertAPIParamsModel(apiParam: IAPIParams) {
    try {
        await APIParamsModel.updateOne(
            { apiRoute: apiParam.apiRoute, params: apiParam.params },
            { ...apiParam },
            { upsert: true } // Insert if not exists
        );

    } catch (error) {
        console.error("Error during upsertAPIParamsModel:", error);
    }
}

function controllCacheHeader(res: Response,etag:string,seconds:number=20) {
    res.setHeader('ETag', etag);
    res.setHeader("Cache-Control", `public, max-age=${seconds}, must-revalidate`); // Cache for 5 second
}

export default {
    getEtag,
    upsertModelModified,
    controllCacheHeader
};
