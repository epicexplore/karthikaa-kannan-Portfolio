/**
 * SEO Loader
 * Fetches SEO settings from /api/settings and updates the DOM
 */
async function loadSEO() {
    try {
        const res = await fetch('/api/settings');
        const json = await res.json();

        if (json.success) {
            const s = json.data;

            // Title
            if (s.seo_title) document.title = s.seo_title;

            // Meta Description
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            if (s.seo_description) metaDesc.content = s.seo_description;

            // Meta Keywords
            let metaKeys = document.querySelector('meta[name="keywords"]');
            if (!metaKeys) {
                metaKeys = document.createElement('meta');
                metaKeys.name = 'keywords';
                document.head.appendChild(metaKeys);
            }
            if (s.seo_keywords) metaKeys.content = s.seo_keywords;
        }
    } catch (err) {
        console.error('SEO Load Failed', err);
    }
}
