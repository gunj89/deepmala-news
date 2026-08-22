
import { Query } from "appwrite";
import { storage, tablesDB } from "./appwrite.js";

const BUCKET_ID = "6a7e8bce001fa009b1b2";
const DATABASE_ID = "6a7e99e5002d9abd688b";
const TABLE_ID = "newspapers";
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;


// Get DEEPMALA YouTube channel
async function getDeepmalaChannel() {

    const url =
        `https://www.googleapis.com/youtube/v3/channels` +
        `?part=contentDetails` +
        `&forHandle=@deepmalanews` +
        `&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("Channel:", data);

    return data.items[0];
}


// Get newest 3 videos
async function getLatestVideos() {

    const channel = await getDeepmalaChannel();

    const uploadsPlaylist =
        channel.contentDetails.relatedPlaylists.uploads;

    const url =
        `https://www.googleapis.com/youtube/v3/playlistItems` +
        `?part=snippet` +
        `&playlistId=${uploadsPlaylist}` +
        `&maxResults=3` +
        `&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log("Latest videos:", data);

    return data.items;
}


async function loadYouTubeVideos() {

    try {

        const videos = await getLatestVideos();

        const videoCards =
            document.querySelectorAll(".video-card");

        videos.forEach((video, index) => {

            if (!videoCards[index]) return;

            const videoId =
                video.snippet.resourceId.videoId;

            const title =
                video.snippet.title;

            const iframe =
                videoCards[index].querySelector("iframe");

            const heading =
                videoCards[index].querySelector("h3");


            // Update YouTube video
            iframe.src =
                `https://www.youtube.com/embed/${videoId}`;

            // Update video title
            heading.textContent =
                title;

        });

    } catch (error) {

        console.error(
            "Failed to load YouTube videos:",
            error
        );

    }

}

loadYouTubeVideos();


async function loadLatestNewspaper() {

    const titleElement =
        document.getElementById("newspaperTitle");

    const editionDateElement =
        document.getElementById("editionDate");

    const coverDateElement =
        document.getElementById("coverEditionDate");

    const readButton =
        document.getElementById("readNewspaper");



    try {
        console.log("Trying to load newspaper...");

       const response = await tablesDB.listRows({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    queries: [
        Query.orderDesc("$createdAt"),
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


        // titleElement.textContent =
        //     newspaper.title;

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