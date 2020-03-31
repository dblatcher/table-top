/*
 * Invoke function as soon as DOM loaded.
 *
 * Chrome *will* trigger DOMContentLoaded when the back button is used to load a page
 * Safari and Firefox do not trigger DOMContentLoaded from the back button
 * IE11 & Edge - unknown
 */
const onLoad = function(f) {
    if (document.readyState == 'loading') {
        document.addEventListener('DOMContentLoaded', f);
    } else {
        f();
    }
}

export {onLoad}