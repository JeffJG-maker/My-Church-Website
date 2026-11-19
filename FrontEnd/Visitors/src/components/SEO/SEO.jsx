
import { useEffect } from "react";

const SITE_URL = "https://lfcwinnersiguosa.onrender.com";
const SITE_NAME = "Living Faith Church Iguosa";
const DEFAULT_IMAGE = `${SITE_URL}/Big_Winnerslogo.png`;
const DEFAULT_TITLE = "Living Faith Church Iguosa | Winners Chapel";
const DEFAULT_DESCRIPTION =
    "Welcome to Living Faith Church Iguosa, popularly known as Winners Chapel. Join us for worship, prayer, inspiring sermons, and fellowship in Iguosa, Edo State, Nigeria.";

function SEO({
    title,
    description = DEFAULT_DESCRIPTION,
    path = "/",
    image = DEFAULT_IMAGE,
    type = "website",
    robots = "index, follow",
}) {
    useEffect(() => {
        const pageTitle = title
            ? `${title} | ${SITE_NAME}`
            : DEFAULT_TITLE;

        const canonicalUrl = new URL(path, SITE_URL).href;
        const imageUrl = new URL(image, SITE_URL).href;

        const updateMeta = (attribute, key, content) => {
            let element = document.head.querySelector(
                `meta[${attribute}="${key}"]`
            );

            if (!element) {
                element = document.createElement("meta");
                element.setAttribute(attribute, key);
                document.head.appendChild(element);
            }

            element.setAttribute("content", content);
        };

        const updateCanonical = (url) => {
            let element = document.head.querySelector(
                'link[rel="canonical"]'
            );

            if (!element) {
                element = document.createElement("link");
                element.setAttribute("rel", "canonical");
                document.head.appendChild(element);
            }

            element.setAttribute("href", url);
        };

        document.title = pageTitle;

        updateMeta("name", "description", description);
        updateMeta("name", "robots", robots);

        updateMeta("property", "og:type", type);
        updateMeta("property", "og:site_name", SITE_NAME);
        updateMeta("property", "og:title", pageTitle);
        updateMeta("property", "og:description", description);
        updateMeta("property", "og:url", canonicalUrl);
        updateMeta("property", "og:image", imageUrl);
        updateMeta("property", "og:image:alt", `${SITE_NAME} logo`);
        updateMeta("property", "og:locale", "en_NG");

        updateMeta("name", "twitter:card", "summary_large_image");
        updateMeta("name", "twitter:title", pageTitle);
        updateMeta("name", "twitter:description", description);
        updateMeta("name", "twitter:image", imageUrl);
        updateMeta("name", "twitter:image:alt", `${SITE_NAME} logo`);

        updateCanonical(canonicalUrl);
    }, [title, description, path, image, type, robots]);

    return null;
}

export default SEO;
