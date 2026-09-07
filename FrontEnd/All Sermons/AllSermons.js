'use strict'

const loader = document.querySelector('.load-container');
const errorContainer = document.querySelector('.error-message');
const retryButton = document.getElementById('retry-btn');
const mediaType = document.getElementById('media-type');
const videos = document.querySelector('.theVideos');
const audios = document.querySelector('.theAudios');
const hamBurger = document.querySelector('.ham-menu');
const navigation = document.querySelector('nav');
const mainContent = document.querySelector('main');
const search = document.getElementById('input-search');
const searchButton = document.getElementById('submit-button');
const searchContainer = document.querySelector('.search-suggestions');
const results = document.querySelector('.search-results');
const generalSermonPage = document.querySelector('.bodyCon');
const sermonVideoPlayer = document.querySelector('.media-displayer-screen');
const sermonCategoryfullContainer = document.querySelector('.sermon-categories')
const sermonResultText = document.querySelector('.category-sermon-results');
const slideButtons = sermonCategoryfullContainer.querySelectorAll('.slide-button');
const sermonCategoryList = document.querySelector('.category-list');
const videoConOne = document.querySelector('.video-con');
const vidConTwo = document.querySelector('.video-containing-cards');
// const clickedVideo = document.getElementById('current-video');
const titleVid = document.getElementById('title');
const minister = document.getElementById('minister-name');
const backBtn = document.getElementById('back-btn');
const videoDescription = document.querySelector('.video-description');
const subscribeButton = document.getElementById('subscribe-btn');
const changeThemeManager = document.querySelector('.change-theme-background');
const themeColorList = document.querySelector('.theme-colors-list');
const body = document.body;
const root = document.documentElement;



// const VidCon
let sermonList = [];

const initializeApp = async () => {
    showPage(loader);
    loadSavedTheme();

    try {
        sermonList = await loadData("http://localhost:5000/api/sermons");

        const categoryList = getCategories(sermonList);

        renderCategories(categoryList);
        renderSermons(sermonList);

        showPage(generalSermonPage);

    } catch (error) {
        showPage(errorContainer);
        console.log(error);
    }
};

const loadData = async (filePath) => {
    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        throw error;
    }
};


/* _____________________________________________________
SERMON CARDS DATA DISPLAY
_________________________________________________
*/
const renderSermons = (sermons) => {

    let html = "";
    for (const sermon of sermons) {
        html +=
            `<div class="vid-card" data-id="${sermon.id}">
        <div class="vid-thumbnail">
        <video class="block-video"poster="${sermon.thumbnail}" src="${sermon.videoUrl}" muted></video>
        <h4>${sermon.duration}</h4>
        </div>
        <div>
                <h3>${sermon.title}</h3>
                <p><strong>Minister:</strong> ${sermon.speaker}</p>
                <h4>${sermon.date}</h4>
                <p>${sermon.category}</p>
            </div>
        </div>`
    }
    videoConOne.innerHTML = html;
    vidConTwo.innerHTML = html;

    setupVideoPreviews(videoConOne);
    setupVideoPreviews(vidConTwo)
}

const openSermon = (sermon) => {
    const clickedVideo = document.createElement('video')
    const videoPlayerContainer = document.querySelector('.video-player');
    videoPlayerContainer.innerHTML = '';
    videoPlayerContainer.appendChild(clickedVideo);
    clickedVideo.setAttribute('id', 'current-video');
    clickedVideo.controls = true;
    clickedVideo.poster = sermon.thumbnail;
    clickedVideo.src = sermon.videoUrl;
    clickedVideo.load();
    clickedVideo.play()

    titleVid.textContent = `${sermon.title}`;
    minister.textContent = `${sermon.speaker}`;

    const downloadVideo = document.getElementById('download-video');
    downloadVideo.href = sermon.videoUrl;
    downloadVideo.download = `${sermon.title}.mp4`;

    videoDescription.innerHTML = `<p style="font-size: clamp(0.8em, 2vw, 1em);>${sermon.description}</p>`

    backBtn.innerHTML = `<i class="fas fa-arrow-left"></i>`;
    backBtn.title = "Return to Previous Page";
    backBtn.addEventListener('click',
        () => {
            clickedVideo.pause();
            showPage(generalSermonPage);
            // backBtn.classList.add('hidden');
            backBtn.innerHTML = `<a href="index.html">
    <i class="fas fa-home" style="color: var(--text-color)"></i>
    </a>`;
            backBtn.title = "Return to Home Page";
            search.value = "";
        });

    showPage(sermonVideoPlayer);
}

/* _____________________________________________________
RENDERING CARDS BY CATEGORIES
_________________________________________________ 
*/
const getCategories = (sermons) => {
    let categories = [];
    sermons.forEach(sermon => {
        const existingCategories = categories.find((category) => category.name === sermon.category);
        if (existingCategories) {
            existingCategories.count++;
        } else {
            categories.push({
                name: sermon.category,
                count: 1,
            })
        }
    })
    return categories;
}

const renderCategories = (categories) => {
    let html = `<button class="category-btn" id="all-sermons" data-stored="${sermonList.length}" data-category="All">All(${sermonList.length})</button>`;
    sermonCategoryList.innerHTML = "";
    categories.forEach(category => {
        html += `<button class="category-btn" data-stored="${category.count}" data-category="${category.name}">${category.name}(${category.count})</button>`
    })
    sermonCategoryList.innerHTML = html;
    updateCategorySlide()
}

const handleCategoryClick = (e) => {
    const button = e.target.closest('.category-btn');

    if (!button) return;

    const categoryName = button.dataset.category;
    const dataStored = button.dataset.stored;

    if (categoryName === "All") {
        renderSermons(sermonList);
    } else {
        const selectedCategory = sermonList.filter((sermon) => {
            return sermon.category === categoryName;
        });

        renderSermons(selectedCategory);
    }

    sermonResultText.innerHTML = `
        <h3>Showing sermons in:</h3>
        <p>${categoryName}, ${dataStored} sermons</p>
    `;

    const buttons = e.currentTarget.querySelectorAll('.category-btn');

    buttons.forEach((btn) => {
        btn.classList.remove('category-active');
    });

    button.classList.add('category-active');
};

// sermonCategoryList.addEventListener('click', );
sermonCategoryList.addEventListener('click', handleCategoryClick);


let categoryPosition = 0;
const updateCategorySlide = () => {

    const maxScroll = sermonCategoryList.scrollWidth - sermonCategoryfullContainer.clientWidth;

    categoryPosition = Math.max(-maxScroll, Math.min(0, categoryPosition)
    );

    sermonCategoryList.style.transform = `translateX(${categoryPosition}px)`;
};


// Left / Previous Button
slideButtons[0].addEventListener('click', () => {
    categoryPosition += 150;
    updateCategorySlide()
});

// Right / Next Button
slideButtons[1].addEventListener('click', () => {
    categoryPosition -= 150;
    updateCategorySlide()
});

/* _____________________________________________________
            MATCH SEARCH INPUT BY USER
_________________________________________________
*/
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
    searchContainer.innerHTML = "";
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
    searchContainer.innerHTML = html;
}

const handleSearchInput = (event) => {
    searchContainer.classList.remove('hidden');
    const value = event.target.value.trim();
    const matches = searchSermons(value);
    renderSuggestions(matches);
    if (value === "") {
        searchContainer.classList.add('hidden');
        return;
    }
}

const handleSuggestionClick = (e) => {
    const valueSearch = e.target.closest('.suggested-sermon');
    if (!valueSearch) return;

    const idNum = Number(valueSearch.dataset.id);

    const selectedSermon = sermonList.find((selectedSermon) => {
        return selectedSermon.id === idNum;
    });
    if (!selectedSermon) return;

    openSermon(selectedSermon);
    search.value = `${selectedSermon.title} by ${selectedSermon.speaker}`;
    searchContainer.classList.add('hidden');
}

const searchButtonClick = () => {
    const value = search.value.trim().toLowerCase();
    const foundSermons = searchSermons(value);

    if (foundSermons.length === 0) {
        renderSermons([]);

        sermonResultText.innerHTML = `
            <h3 style="color: darkgrey;">No sermons found for:</h3>
            <p>${value}</p>
        `;

        searchContainer.classList.add('hidden');
        return;
    }

    sermonResultText.innerHTML = `
        <h3>Search results for:</h3>
        <p>${value.toUpperCase()}, ${foundSermons.length} sermons</p>
    `;

    renderSermons(foundSermons);
    searchContainer.classList.add('hidden');

}

search.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchButtonClick();
    }
});


search.addEventListener('input', handleSearchInput);
searchContainer.addEventListener('click', handleSuggestionClick);
searchButton.addEventListener('click', searchButtonClick);


/* _____________________________________________________
            CLICKING ANY SERMON VIDEO CARD
_________________________________________________
*/
const sermonClick = (e) => {
    const card = e.target.closest('.vid-card');
    if (card) {
        const cards = e.currentTarget.querySelectorAll('.vid-card');
        cards.forEach(card => {
            card.classList.remove('item-selected')
        })
        card.classList.add('item-selected');
    }

    if (!card) return;
    const id = Number(card.getAttribute('data-id'));
    const sermon = sermonList.find((sermon) => {
        const one = sermon.id === id;
        return one;
    });

    if (!sermon) return;
    openSermon(sermon);
}

vidConTwo.addEventListener('click', sermonClick)
videoConOne.addEventListener('click', sermonClick);

const setupVideoPreviews = (container) => {
    const cardVideos = container.querySelectorAll('video');

    cardVideos.forEach((video) => {

        video.addEventListener('mouseenter', () => {

            cardVideos.forEach((otherVideo) => {
                if (otherVideo !== video) {
                    otherVideo.pause();
                    otherVideo.currentTime = 0;
                }
            });

            video.play();
        });

        video.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });

    });
};
/* _____________________________________________________
            SUBSCRIPTION BUTTON MANAGEMENT
_________________________________________________
*/
subscribeButton.addEventListener('click', () => {
    subscribeButton.classList.toggle('subscribed');
    if (subscribeButton.textContent === "subscribe") {
        subscribeButton.innerHTML = `<p>subscribed</p><i class="fas fa-check"></i>`
    } else {
        subscribeButton.textContent = "subscribe"
    }
});


/* _____________________________________________________
ALL NAVIGATION SETTINGS
_________________________________________________
*/
const pages = [
    generalSermonPage,
    sermonVideoPlayer,
    loader,
    errorContainer
]

const contentPages = [
    generalSermonPage,
    sermonVideoPlayer
];

const showPage = (pageToShow) => {
    pages.forEach((page) => page.classList.add('hidden'))
    pageToShow.classList.remove('hidden');
}

hamBurger.addEventListener('click', () => {
    contentPages.forEach(page => {
        page.classList.toggle('shift');
    });
    navigation.classList.toggle('inactive');
});

// navigation.addEventListener('click', );

contentPages[0].addEventListener('click', () => {
    navigation.classList.remove('active');
});

changeThemeManager.addEventListener('mouseover', () => {
    themeColorList.classList.remove('in-active');
    changeThemeManager.style.height = "min-content"
    changeThemeManager.style.borderTopRightRadius = "40%"
})
changeThemeManager.addEventListener('mouseout', () => {
    themeColorList.classList.add('in-active');
    changeThemeManager.style.height = "30px";
    changeThemeManager.style.borderTopRightRadius = "5px";
})

const themeColorSelected = (e) => {
    const button = e.target.closest('button');

    if (!button) return;

    const selectedTheme = button.dataset.theme;

    if (selectedTheme === "light") {
        root.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
    }

    if (selectedTheme === "dark") {
        root.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark')
    }
};

const loadSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        root.classList.add('light-theme');
    }
}
changeThemeManager.addEventListener('click', themeColorSelected);


/* _____________________________________________________
        MEDIA TYPE MANAGEMENT SETTINGS
_________________________________________________
*/
mediaType.addEventListener('click', () => {
    if (mediaType.value === 'audio') {
        audios.style.display = 'block';
        videos.style.display = 'none';
    }
    else {
        audios.style.display = 'none';
        videos.style.display = 'block';
    }
});
initializeApp();
retryButton.addEventListener('click', initializeApp);