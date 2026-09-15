const root = document.documentElement;

const themeSelection = document.querySelector('.theme-selection');

const addSermonModal = document.getElementById('add-sermon-modal');
const addSermonButton = document.querySelector('#add-sermon-btn');
const closeAddSermonBtn = document.getElementById('close-add-sermon');
const sermonTableBody = document.getElementById('sermon-table-body');
const refreshBtn = document.querySelector('.refresh-btn');
const categoryFilter = document.getElementById('category-filter');
const speakerFilter = document.getElementById('speaker-filter');
const totalSermons = document.getElementById('major-total-sermons');
const totalSermonCategories = document.getElementById('total-sermon-categories');
const sermonSearchInput = document.getElementById('sermon-search');
const searchSuggestionsCon = document.querySelector('.search-suggestions');

const editSermonModal =
    document.getElementById("edit-sermon-modal");

const closeEditSermonBtn =
    document.getElementById("close-edit-sermon");

const cancelEditSermonBtn =
    document.getElementById("cancel-edit-sermon");

const editSermonForm =
    document.getElementById("edit-sermon-form");

const API = "http://localhost:5000/api/sermons"
const MEDIA_BASE_URL = "http://localhost:5000";

// THE MODEL MANAGEMENT
let sermonList = [];
let editingSermonId = null;

const initializeApp = async () => {
    try {
        sermonList = await loadDataInfo(API);
        renderSermonTable(sermonList);

        const categories = getCategories(sermonList);
        renderSermonTableCategories(categories);
        renderSermonTableSpeakers(sermonList);

        displaySermonCategory(categories);

        const speakers = getSpeakers(sermonList);
        renderSermonTableSpeakers(speakers);

        loadSavedTheme();
        loadLatestSermons();

    } catch (error) {
        console.log(error);
    }
}


const loadDataInfo = async (filePath) => {
    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.warn(error);
    }
}


const loadLatestSermons = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/sermons/latest");

        if (!response.ok) {
            throw new Error("Failed to fetch latest sermons");
        }

        const sermons = await response.json();

        renderLatestSermons(sermons);
    } catch (error) {
        console.error(error);
    }
};

const renderLatestSermons = (sermons) => {
    const container = document.querySelector(".sermon-activity-list");
    console.log("renderLatestSermons called");
    console.log(sermons);

    container.innerHTML = sermons.map(sermon => `
         <li class="activity-item">
            <div class="icon-wrapper">
                <img src="${getMediaUrl(sermon.thumbnail)}" alt="Sermon Icon" class="activity-icon">
            </div>
            <div class="activity-content">
                <p class="activity-text"><strong>${sermon.title}</strong> has been uploaded to the video catalog.</p>
                <span class="activity-time">${sermon.date}</span>
            </div>
        </li> `).join("");;
};

const getMediaUrl = (filePath) => {

    if (!filePath) return "";

    let cleanPath = filePath;

    cleanPath = cleanPath.replace(/^(\.\.\/)+/, "");

    cleanPath = cleanPath.replace(/^BackEnd\//, "");

    return `${MEDIA_BASE_URL}/${cleanPath}`;
};

const themeColorSelected = (e) => {
    const button = e.target.closest('button');

    if (!button) return;

    const selectedTheme = button.dataset.theme;
    const buttons = e.currentTarget.querySelectorAll('button')

    buttons.forEach(button => {
        button.classList.remove('active-theme');
    })
    button.classList.add('active-theme');

    if (selectedTheme === "light") {
        root.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }

    if (selectedTheme === "dark") {
        root.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark')
    }
};

const loadSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        root.classList.add('light-theme');
    }
}

themeSelection.addEventListener('click', themeColorSelected);

const searchSermons = (searchValue) => {
    let currentValue = searchValue.toLowerCase();
    return sermonList.filter((sermon) => {
        const title = sermon.title.toLowerCase();
        const speaker = sermon.speaker.toLowerCase();
        return title.includes(currentValue) || speaker.includes(currentValue);
    })
}

const renderSuggestions = (matches) => {
    let html = "";
    if (matches.length === 0) {
        html = `<div class="suggested-sermon"><p style="color: silver">No matching sermon found...</p>
        </div>`;
    } else {
        matches.forEach((sermon) => {
            html += `<div class="suggested-sermon" data-id="${sermon.id}">
            <h3>${sermon.title}</h3>
            <p>${sermon.speaker}</p>
            </div>`});
    }
    searchSuggestionsCon.innerHTML = html;
}

const handleSearchInput = (event) => {
    searchSuggestionsCon.classList.remove('hidden');
    const value = event.target.value.trim();
    const matches = searchSermons(value);
    renderSuggestions(matches);
    if (value === "") {
        searchSuggestionsCon.classList.add('hidden');
        return;
    }
}

sermonSearchInput.addEventListener('input', handleSearchInput)


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


const displaySermonCategory = (categories) => {
    let html = "";
    html = `<div class="summary-icon">
                            <i class="fas fa-layer-group"></i>
                        </div>
                        <div>
                            <span>Categories</span>
                            <h3>${categories.length}</h3>
                        </div>
`
    totalSermonCategories.innerHTML = html;
}


/*=======================================
CATEGORY RENDERING
==================================*/
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


const renderSermonTableCategories = (categories) => {
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

const renderSermonTableSpeakers = (speakers) => {

    let html = `<option value="all">All Speakers</option>`;
    speakers.forEach(speaker => {
        html += `<option value="${speaker.name}">${speaker.name}</option>`
    })

    speakerFilter.innerHTML = html;
}



/* =================================
TABLE RENDERING
=============================*/
const renderSermonTable = (sermons) => {
    let html = "";

    sermons.forEach(sermon => {
        html += `<tr data-id="${sermon.id}">
                 <td>
                                        <div class="sermon-table-info">
                                            <img src="${getMediaUrl(sermon.thumbnail)}" alt="${sermon.title}">
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

    totalSermons.innerHTML = ` <div class="summary-icon">
                            <i class="fas fa-book-open"></i>
                        </div>

                        <div>

                            <span>Total Sermons</span>

                            <h3>${sermonList.length}</h3>

                        </div>`
}


sermonTableBody.addEventListener("click", async (event) => {

    const editBtn = event.target.closest(".edit-btn");
    const deleteBtn = event.target.closest('.delete-btn');

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

        return;
    };


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

        console.log(confirmed)

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

        return;
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