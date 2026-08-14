import { account, storage, tablesDB } from "./appwrite.js";
const loginContainer = document.getElementById("loginContainer");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

const logoutBtn = document.getElementById("logoutBtn");


// =========================
// CHECK LOGIN
// =========================

async function checkLogin() {

    try {

        const user = await account.get();

        console.log("Already logged in:", user.name);

        showDashboard();

    } catch (error) {

        console.log("Not logged in");

        showLogin();

    }

}


// =========================
// LOGIN
// =========================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    loginMessage.textContent = "Logging in...";

    try {

        await account.createEmailPasswordSession({
            email: email,
            password: password
        });

        console.log("Admin logged in!");

        showDashboard();

    } catch (error) {

        console.error(error);

        loginMessage.textContent = error.message;

    }

});


// =========================
// SHOW DASHBOARD
// =========================

function showDashboard() {

    loginContainer.style.display = "none";

    dashboard.style.display = "block";

}


// =========================
// SHOW LOGIN
// =========================

function showLogin() {

    loginContainer.style.display = "flex";

    dashboard.style.display = "none";

}


// =========================
// LOGOUT
// =========================

logoutBtn.addEventListener("click", async () => {

    try {

        await account.deleteSession({
            sessionId: "current"
        });

        showLogin();

        console.log("Logged out");

    } catch (error) {

        console.error(error);

    }

});


// CHECK LOGIN WHEN PAGE LOADS

checkLogin();

// =========================
// UPLOAD NEWSPAPER
// =========================

const uploadForm = document.getElementById("uploadForm");
const uploadMessage = document.getElementById("uploadMessage");

const BUCKET_ID = "6a7e8bce001fa009b1b2";

uploadForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const fileInput = document.getElementById("newspaper");
    const file = fileInput.files[0];

    if (!file) {
        uploadMessage.textContent = "Please select a PDF.";
        return;
    }

    if (file.type !== "application/pdf") {
        uploadMessage.textContent = "Only PDF files are allowed.";
        return;
    }

    uploadMessage.textContent = "Uploading newspaper...";

    try {

        const uploadedFile = await storage.createFile({
            bucketId: BUCKET_ID,
            fileId: "unique()",
            file: file
        });
        const DATABASE_ID = "6a7e99e5002d9abd688b";
const TABLE_ID = "newspapers";

const editionDate = document.getElementById("editionDate").value;

await tablesDB.createRow({
    databaseId: DATABASE_ID,
    tableId: TABLE_ID,
    rowId: "unique()",
    data: {
        title: "DEEPMALA Weekly Newspaper",
        editionDate: new Date(editionDate).toISOString(),
        fileId: uploadedFile.$id
    }
});

        console.log("Uploaded file:", uploadedFile);

        uploadMessage.textContent =
            "Newspaper uploaded successfully!";

        uploadForm.reset();

    } catch (error) {

        console.error(error);

        uploadMessage.textContent =
            "Upload failed: " + error.message;

    }

});