// ROOT ELEMENT
const root = document.documentElement;

// WEBPAGE NAVIGATION BUTTONS
const header = document.querySelector('header');
const aboutUsBtn = document.getElementById('about-us-page-btn');
const homePageBtn = document.getElementById('home-page-btn');
const contactPageBtn = document.getElementById('contact-page-btn');
const navigation = document.querySelector('nav');
const hamBurger = document.querySelector('.ham-menu');

// THE WEBPAGE SECTIONS
const homePageSection = document.querySelector('.home-page-section')
const aboutUsSection = document.querySelector('.about-us-section');
const contactUsSection = document.querySelector('.contact-us-section')

// HERO SECTION 
const topDiv = document.querySelector('.top-div');
const imageSlide = document.getElementById('slider');
const images = imageSlide.querySelectorAll('img');
const LeftImageSlider = document.getElementById('left-image-slider');
const rightImageSlider = document.getElementById('right-image-slider');

const videoGeneralBody = document.querySelector('.video-gen-body');
const videoScreen = document.querySelector('.video-screen');
const LeftVidBtn = document.getElementById('vid-button-left');
const rightVidBtn = document.getElementById('vid-button-right');
const navBtn = document.querySelector('nav button');
const themeContainer = document.querySelector('.theme-selector');
const themeColorList = document.querySelector('.theme-selector ul');
const themeColorValue = themeColorList.querySelectorAll('li');
const indicators = document.querySelectorAll('.nav-bullets span');
const videoCardContainer = document.querySelector('.first-vids');
const sermonVideoPlayer = document.getElementById('display-video-container')

// CONTACT
const dialog = document.getElementById("myModal");
const joinUsBtn = document.getElementById("join-us-btn");
const closeModalBtn = document.getElementById("close-modal-btn");

const initializeApp = () => {
    showWebPageSection(homePageSection);
    backGroundSlide()
    updateIndicators()
    renderSermons(featuredSermons);
    loadSavedTheme()
}

const handleScroll = () => {
    const atTop = window.scrollY === 0;
    header.classList.toggle('hidden-top', !atTop);
    header.classList.toggle('visible-top', atTop);
}

window.addEventListener('scroll', () => requestAnimationFrame(handleScroll));


// THE SERMON CARD DATA 
const sermonList = [
    {
        videoUrl: "media/‎@Beautiful_You‎20240120‎_Phoenix.mp4",
        title: "Walking By Faith",
        speaker: "Pastor Tobore",
        date: "July 12, 2026",
        category: "Faith",
        thumbnail: "media/Walking By Faith Thumbnail.jpg",
        duration: "45:00",
        id: 1,
        description: "Faith is what moves mountains but remember faith without works is pointless."
    },

    {
        videoUrl: "media/‎@Beautiful_You‎20240120‎_Phoenix.mp4",
        title: "The Power of Consecration",
        speaker: "Pastor Monday",
        date: "July 5, 2026",
        category: "Consecration",
        thumbnail: "media/Power Of ConsecrationThumbnail.jpg",
        duration: "51:00",
        id: 2,
        description: "Consecration helps you fight competing appetites. It helps one maintain focus and boosts discipline"
    },

    {
        videoUrl: "media/‎@Beautiful_You‎20240120‎_Phoenix.mp4",
        title: "Walking in Purity",
        speaker: "Pastor Lucky",
        date: "April 10, 2026",
        category: "Purity",
        thumbnail: "media/Living Patience  Faith.png",
        duration: "42:00",
        id: 3,
        description: "This video is meant to give you and understanding the importance of walking in purity. Purity is what gives you right to stand in certain places."
    },

    {
        videoUrl: "media/‎@Beautiful_You‎20240120‎_Phoenix.mp4",
        title: "Living a Life of Purpose",
        speaker: "Pastor Emmanuel",
        date: "September 09, 2025",
        category: "Purpose",
        thumbnail: "media/purposeThumbnail.jpg",
        duration: "56:00",
        id: 4,
        description: "One of the greatest revelations from God is your purpose. It gives you a definite direction in life, making it easier to achieve a goal with the support of discipline factor."
    },

    {
        videoUrl: "media/‎@Beautiful_You‎20240120‎_Phoenix.mp4",
        title: "The Winning Attitude",
        speaker: "Pastor Jeffrey",
        date: "May 14, 2026",
        category: "Success",
        thumbnail: "media/Winners Logo.png",
        duration: "48:00",
        id: 5,
    },

    {
        videoUrl: "media/‎Bro_just_wants_to_be_home_🤣_Can’t_Even_(viaGlenngrov‎20240413‎_Phoenix.mp4",
        title: "Financial Fortune is My Heritage",
        speaker: "Pastor Michael",
        date: "February 26, 2026",
        category: "Prosperity",
        thumbnail: "media/Pastor Preaching.png",
        duration: "43:00",
        id: 6,
    }
]

const featuredSermons = [
    {
        videoUrl: "../media/‎@Beautiful_You‎20240120‎_Phoenix.mp4",
        title: "Walking By Faith",
        speaker: "Pastor Tobore",
        date: "July 12, 2026",
        category: "Faith",
        thumbnail: "../media/Walking By Faith Thumbnail.jpg",
        duration: "45:00",
        id: 1,
        description: "Faith is what moves mountains but remember faith without works is pointless.",
    },

    {
        videoUrl: "../media/‎@Beautiful_You‎20240120‎_Phoenix.mp4",
        title: "The Power of Consecration",
        speaker: "Pastor Monday",
        date: "July 5, 2026",
        category: "Consecration",
        thumbnail: "../media/Power Of ConsecrationThumbnail.jpg",
        duration: "51:00",
        id: 2,
        description: "Consecration helps you fight competing appetites. It helps one maintain focus and boosts discipline",
    },

    {
        videoUrl: "../media/‎@Beautiful_You‎20240120‎_Phoenix.mp4",
        title: "Walking in Purity",
        speaker: "Pastor Lucky",
        date: "April 10, 2026",
        category: "Purity",
        thumbnail: "../media/Living Patience  Faith.png",
        duration: "42:00",
        id: 3,
        description: "This video is meant to give you and understanding the importance of walking in purity. Purity is what gives you right to stand in certain places.",
    },

    {
        videoUrl: "../media/‎@Beautiful_You‎20240120‎_Phoenix.mp4",
        title: "Living a Life of Purpose",
        speaker: "Pastor Emmanuel",
        date: "September 09, 2025",
        category: "Purpose",
        thumbnail: "../media/purposeThumbnail.jpg",
        duration: "56:00",
        id: 4,
        description: "One of the greatest revelations from God is your purpose. It gives you a definite direction in life, making it easier to achieve a goal with the support of discipline factor.",
    },
    {
        videoUrl: "../media/‎@Beautiful_You‎20240120‎_Phoenix.mp4",
        title: "The Winning Attitude",
        speaker: "Pastor Jeffrey",
        date: "May 14, 2026",
        category: "Success",
        thumbnail: "../media/Winners Logo.png",
        duration: "48:00",
        id: 5,
    },

    {
        videoUrl: "../media/‎Bro_just_wants_to_be_home_🤣_Can’t_Even_(viaGlenngrov‎20240413‎_Phoenix.mp4",
        title: "Financial Fortune is My Heritage",
        speaker: "Pastor Michael",
        date: "February 26, 2026",
        category: "Prosperity",
        thumbnail: "../media/Pastor Preaching.png",
        duration: "43:00",
        id: 6,
    },
    {
        videoUrl: "../churchData/Prophetic Tongues(720P_HD).mp4",
        title: "The Power of Prayer",
        speaker: "Pastor Daniel",
        date: "August 9, 2026",
        category: "Prayer",
        thumbnail: "../media/FirstHomeImage.png",
        duration: "47:15",
        id: 7,
        description: "Prayer opens the door for God's intervention and strengthens our relationship with Him."
    },
    {
        videoUrl: "../churchData/Marry Only who fears the Lord _apostlemichaeloropko _love _marriageadvise(720P_HD).mp4",
        title: "Covenant Day of Marriage Settlement",
        speaker: "Pastor Grace",
        date: "August 16, 2026",
        category: "Holiness",
        thumbnail: "../media/Unveling the wonders in the word.png",
        duration: "42:10",
        id: 8,
        description: "Marriage is from God and there are important several things that we ought to know before and in marriage"
    },

]

const webPageSections = [
    homePageSection,
    aboutUsSection,
    contactUsSection
]

const showWebPageSection = (webPageToShow) => {
    webPageSections.forEach(page => page.classList.add('hidden'));
    webPageSections.forEach(page => page.classList.remove('visibility'));

    webPageToShow.classList.remove('hidden');

    setTimeout(() => {
        webPageToShow.classList.add('visibility');
    }, 20);

}


homePageBtn.addEventListener('click', () => {
    showWebPageSection(homePageSection);
});

aboutUsBtn.addEventListener('click', () => {
    showWebPageSection(aboutUsSection);
});

contactPageBtn.addEventListener('click', () => {
    showWebPageSection(contactUsSection);
});

const headLinkButtons = (e) => {
    let linkBtn = e.target.closest('a');

    if (!linkBtn) return;

    const linkBtns = e.currentTarget.querySelectorAll('a');

    linkBtns.forEach((btn) => {
        btn.classList.remove('page-btn-active');
    });

    linkBtn.classList.add('page-btn-active');
}

header.addEventListener('click', headLinkButtons);

// THE RENDER SERMON CARDS FUNCTION
const videoSections = [
    videoGeneralBody,
    sermonVideoPlayer,
]

const showVideoSection = (pageToShow) => {
    videoSections.forEach((page) => page.classList.add('hidden'))
    pageToShow.classList.remove('hidden');;
}

const renderSermons = (sermons) => {
    let html = "";

    sermons.forEach((sermon) =>
        html += `<div class="video-card" data-id="${sermon.id}">
                     <div class="image">
                    <img src="${sermon.thumbnail}" alt="">
                    <h4>${sermon.duration}</h4>
                    </div>
                     <div> 
                        <p>8:00AM-10:20AM</p>
                           <h2>${sermon.title}</h2>
                          <p>${sermon.speaker}</p>
                        </div>
                            </div>`
    );
    videoCardContainer.innerHTML = html;
}

// NAVIGATE VIDEOS

let videoSlidePosition = 0;
const updateVideoSlider = () => {

    const maxScroll = videoCardContainer.scrollWidth - videoScreen.clientWidth;

    videoSlidePosition = Math.max(-maxScroll, Math.min(0, videoSlidePosition)
    );

    videoCardContainer.style.transform = `translateX(${videoSlidePosition}px)`;
};


// Left / Previous Button
LeftVidBtn.addEventListener('click', () => {
    videoSlidePosition += 200;
    updateVideoSlider()
});

// Right / Next Button
rightVidBtn.addEventListener('click', () => {
    videoSlidePosition -= 200;
    updateVideoSlider()
});

const openSermon = (sermon) => {
    if (!sermonVideoPlayer) {
        console.error("sermonVideoPlayer element not found in the DOM.");
        return;
    }

    sermonVideoPlayer.innerHTML = "";

    const backBtn = document.createElement('button');
    backBtn.innerHTML = `<p>Previous</p> <i class="fas fa-arrow-left"></i>`;
    backBtn.title = "Return to Previous Page";

    backBtn.addEventListener('click', () => {
        showVideoSection(videoGeneralBody);
        clickedVideo.pause()
    })

    const clickedVideo = document.createElement('video');
    clickedVideo.poster = sermon.thumbnail;
    clickedVideo.src = sermon.videoUrl;
    clickedVideo.load();
    clickedVideo.controls = true;
    clickedVideo.play();

    const titleVid = document.createElement('h3');
    titleVid.textContent = `${sermon.title}`;

    const minister = document.createElement('p')
    minister.textContent = `${sermon.speaker}`;


    sermonVideoPlayer.appendChild(backBtn)
    sermonVideoPlayer.appendChild(clickedVideo);
    sermonVideoPlayer.appendChild(titleVid);
    sermonVideoPlayer.appendChild(minister);

    showVideoSection(sermonVideoPlayer);

}

// SERMONCARD CLICK
const sermonClick = (event) => {
    const card = event.target.closest('.video-card');
    if (!card) return;
    const id = Number(card.dataset.id);
    const sermon = sermonList.find((sermon) => {
        return sermon.id === id;

    })

    if (!sermon) return;
    openSermon(sermon)
}

videoCardContainer.addEventListener('click', sermonClick);


//THEME COLOR SELECTION FIELD.
themeContainer.addEventListener('mouseover', () => {
    themeColorList.style.display = "block";
});
themeContainer.addEventListener('mouseout', () => {
    themeColorList.style.display = "none";
})


export const themeColorSelected = (e) => {
    const list = e.target.closest('li');

    if (!list) return;

    const selectedTheme = list.dataset.theme;

    if (selectedTheme === "light") {
        root.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
    }
    else if (selectedTheme === "dark") {
        root.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark')
    }
};

export const loadSavedTheme = () => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        root.classList.add('dark-theme');
    }
}
themeContainer.addEventListener('click', themeColorSelected);

// HANDLING JOINING US
const joinUs = () => {

}

// Open the popup like an alert
joinUsBtn.addEventListener("click", () => {
    dialog.showModal();
});

// Close the popup when OK is clicked
closeModalBtn.addEventListener("click", () => {
    dialog.close();
});



// NAVIGATION BAR MENU
const hamOnClick = () => {
    navigation.classList.toggle('active');
    hamBurger.classList.toggle('active');
}

// IMAGE SLIDESHOW
let currentImage = 0;
let time = 10000;

const backGroundSlide = () => {
    imageSlide.style.transform = `translateX(${currentImage * -100}%)`;
}
const rightOnClick = () => {
    currentImage++;
    if (currentImage === images.length) {
        currentImage = 0;
    }
    backGroundSlide();
    updateIndicators();
}
setInterval(rightOnClick, time);

const leftOnClick = () => {
    currentImage--;
    if (currentImage < 0) {
        currentImage = images.length - 1;
    }
    backGroundSlide();
    updateIndicators();
}


// NAVIGATE SPAN INDICATOR
function updateIndicators() {
    indicators.forEach(indicator => {
        indicator.classList.remove("active");
    });
    indicators[currentImage].classList.add("active");
}

LeftImageSlider.addEventListener('click', leftOnClick);
rightImageSlider.addEventListener('click', rightOnClick);
hamBurger.addEventListener('click', hamOnClick);

initializeApp();