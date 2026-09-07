const addSermonModal = document.getElementById('add-sermon-modal');
const addSermonButton = document.querySelector('.add-sermon-btn');
const closeAddSermonBtn = document.getElementById('close-add-sermon');
const sermonTableBody = document.getElementById('sermon-table-body');
const refreshBtn = document.querySelector('.refresh-btn');
const categoryFilter = document.getElementById('category-filter');
const speakerFilter = document.getElementById('speaker-filter');

const editSermonModal =
    document.getElementById("edit-sermon-modal");

const closeEditSermonBtn =
    document.getElementById("close-edit-sermon");

const cancelEditSermonBtn =
    document.getElementById("cancel-edit-sermon");

const editSermonForm =
    document.getElementById("edit-sermon-form");

const API = "http://localhost:5000/api/sermons"

// THE MODEL MANAGEMENT
let sermonList = [];
let editingSermonId = null;

const initializeApp = async () => {
    try {
        sermonList = await loadDataInfo(API);
        renderSermonTable(sermonList);

        const categories = getCategories(sermonList);
        renderCategories(categories);
        renderSpeakers(sermonList)

        const speakers = getSpeakers(sermonList);
        renderSpeakers(speakers);

    } catch (error) {
        console.log(error);
    }
}

addSermonButton.addEventListener('click', () => {
    addSermonModal.showModal();
})

closeAddSermonBtn.addEventListener('click', () => {
    addSermonModal.close();
});

// 
const addSermonForm = document.querySelector("#add-sermon-form");

addSermonForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const formData = new FormData(addSermonForm);

    try {

        const response = await fetch(
            API,
            {
                method: "POST",

                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to add sermon"
            );
        }

        console.log("Sermon created:", data);

        addSermonForm.reset();

        alert("Sermon added successfully!");

    } catch (error) {

        console.error("Error adding sermon:", error);

        alert(error.message);

    }

});

const loadDataInfo = async (filePath) => {
    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = response.json();
        return data;

    } catch (error) {
        console.warn(error);
    }
}


const getCategories = (sermons) => {
    let categories = [];

    sermons.forEach(sermon => {
        // Fallback to "Uncategorized" if the category is missing, null, or empty
        const sermonCategory = sermon.category && sermon.category.trim() !== ""
            ? sermon.category
            : "Uncategorized";

        const existingSpeaker = categories.find((category) => category.name === sermonCategory);

        if (existingSpeaker) {
            existingSpeaker.count++;
        } else {
            categories.push({
                name: sermonCategory,
                count: 1,
            });
        }
    });

    return categories;
};

const renderCategories = (categories) => {
    let html = ` <option value="all">All Categories</option>`;
    categories.forEach(category => {
        html += `<option value="${category.name}"  data-category="${category.name}">${category.name}(${category.count})</option>`
    })
    categoryFilter.innerHTML = html;
}

const getSpeakers = (sermons) => {
    let speakers = [];

    sermons.forEach(sermon => {
        // Fallback to "Uncategorized" if the category is missing, null, or empty
        const sermonSpeaker = sermon.speaker && sermon.speaker.trim() !== ""
            ? sermon.speaker
            : "Uncategorized";

        const existingSpeaker = speakers.find((speaker) => speaker.name === sermonSpeaker);

        if (!existingSpeaker) {
            speakers.push({
                name: sermonSpeaker,
            });
        }
    });

    return speakers;
}

const renderSpeakers = (speakers) => {

    let html = `<option value="all">All Speakers</option>`;
    speakers.forEach(speaker => {
        html += `<option value="${speaker.name}">${speaker.name}</option>`
    })

    speakerFilter.innerHTML = html;
}


const renderSermonTable = (sermons) => {
    let html = "";

    sermons.forEach(sermon => {
        html += `<tr data-id="${sermon.id}">
                 <td>
                                        <div class="sermon-table-info">
                                            <img src"${sermon.thumbnail}" alt="">
                                            <div>
                                                <strong> ${sermon.title}</strong> 
                                                <span>ID: ${sermon.id}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        ${sermon.speaker}
                                    </td>
                                    <td>
                                        <span class="category-badge teaching">
                                            ${sermon.category}
                                        </span>
                                    </td>
                                    <td>
                                        ${sermon.date}
                                    </td>
                                    <td>
                                        ${sermon.duration}
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="view-btn" title="View"><i class="far fa-eye"></i></button>

                                            <button class="edit-btn" title="Edit"><i class="fas fa-edit"></i></button>

                                            <button class="delete-btn" title="Delete"><i class="fas fa-trash"></i> </button>
                                        </div>
                                    </td>
                                </tr> `
    });

    // const editBtn = document.querySelector('.edit-btn');


    sermonTableBody.innerHTML = html;
}

sermonTableBody.addEventListener("click", async (event) => {

    const editBtn = event.target.closest(".edit-btn");
    const deleteBtn = event.target.closest('.delete-btn')

    if (!editBtn) return;

    if (editBtn) {
        const row = editBtn.closest("tr");

        const sermonId = row.dataset.id;

        const sermon = sermonList.find(
            sermon => sermon.id === Number(sermonId)
        );

        if (!sermon) return;

        editingSermonId = sermon.id;

        document.getElementById("edit-sermon-title").value =
            sermon.title;

        document.getElementById("edit-sermon-speaker").value =
            sermon.speaker;

        document.getElementById("edit-sermon-category").value =
            sermon.category;

        document.getElementById("edit-sermon-date").value =
            formatDateForInput(sermon.date);

        document.getElementById("edit-sermon-duration").value =
            sermon.duration;

        document.getElementById("edit-sermon-description").value =
            sermon.description;

        editSermonModal.showModal();
    };
    if(!deleteBtn) return;

    if (deleteBtn) {
        const row = deleteBtn.closest("tr");

        const sermonId = row.dataset.id;

        const sermon = sermonList.find(
            sermon => sermon.id === Number(sermonId)
        );

        if (!sermon) return;

        const confirmed = confirm(
            `Are you sure you want to delete "${sermon.title}"?`
        );

        if (!confirmed) return;

        try {

            const response = await fetch(
                `${API}/${sermonId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete sermon"
                );
            }

            await initializeApp();

            alert("Sermon deleted successfully!");

        } catch (error) {

            console.error("Error deleting sermon:", error);

            alert(error.message);

        }
    }

});

const formatDateForInput = (date) => {
    return new Date(date).toISOString().split("T")[0];
};

editSermonForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const updatedSermon = {

        title: document
            .getElementById("edit-sermon-title")
            .value
            .trim(),

        speaker: document
            .getElementById("edit-sermon-speaker")
            .value
            .trim(),

        category: document
            .getElementById("edit-sermon-category")
            .value,

        date: document
            .getElementById("edit-sermon-date")
            .value,

        duration: document
            .getElementById("edit-sermon-duration")
            .value
            .trim(),

        description: document
            .getElementById("edit-sermon-description")
            .value
            .trim()
    };

    try {

        const response = await fetch(
            `${API}/${editingSermonId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedSermon)
            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(
                data.message || "Failed to update sermon"
            );
        }

        console.log("Sermon updated:", data);

        editSermonModal.close();

        editingSermonId = null;

        await initializeApp();

        alert("Sermon updated successfully!");

    } catch (error) {

        console.error("Error updating sermon:", error);

        alert(error.message);

    }

});

refreshBtn.addEventListener('click', initializeApp)
initializeApp();