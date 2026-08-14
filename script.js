
import { Query } from "appwrite";
import { storage, tablesDB } from "./appwrite.js";

const BUCKET_ID = "6a7e8bce001fa009b1b2";
const DATABASE_ID = "6a7e99e5002d9abd688b";
const TABLE_ID = "newspapers";



async function loadLatestNewspaper() {

    const titleElement =
        document.getElementById("newspaperTitle");

    const editionDateElement =
        document.getElementById("editionDate");

    const coverDateElement =
        document.getElementById("coverEditionDate");

    const readButton =
        document.getElementById("readNewspaper");

    const downloadButton =
        document.getElementById("downloadNewspaper");


    try {
        console.log("Trying to load newspaper...");

        const response = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [
                Query.orderDesc("editionDate"),
                Query.limit(1)
            ]
        });


        if (response.rows.length === 0) {

            titleElement.textContent =
                "No newspaper available";

            editionDateElement.textContent =
                "No edition published yet.";

            coverDateElement.textContent =
                "No edition";

            return;
        }


        const newspaper = response.rows[0];

        console.log(
            "Latest newspaper:",
            newspaper
        );


        const date =
            new Date(newspaper.editionDate);


        const formattedDate =
            date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });


        titleElement.textContent =
            newspaper.title;

        editionDateElement.textContent =
            formattedDate;

        coverDateElement.textContent =
            formattedDate.toUpperCase();


        const fileUrl =
            storage.getFileView({
                bucketId: BUCKET_ID,
                fileId: newspaper.fileId
            });


        readButton.href = fileUrl;

        downloadButton.href = fileUrl;

    } catch (error) {

        console.error(
            "Could not load newspaper:",
            error
        );

        titleElement.textContent =
            "Unable to load newspaper";

        editionDateElement.textContent =
            "Please try again later.";

    }

}


loadLatestNewspaper();


console.log("Appwrite Storage connected!");
console.log("Bucket ID:", BUCKET_ID);