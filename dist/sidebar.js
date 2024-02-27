window.$docsify.plugins = [].concat(window.$docsify.plugins, plugin);

function plugin(hook, vm) {
    hook.doneEach(() => {
        highlightPageTitleInSidebar();
    });
}

/**
 * 原來在點下文章中的次標題連結後，會移除側邊欄標題的 .active。
 * 所以設定 .is-active 來 highlight 側邊欄中目前頁面的文章標題。
 * 此外，側邊欄卷軸也會移動至指定處。
 */
function highlightPageTitleInSidebar() {
    const pageTitle = document.querySelector(".markdown-section>h1 a span").innerHTML;

    try {
        const anchors = document.querySelectorAll(".sidebar-nav li>a");
        anchors.forEach((anchor) => {
            if (anchor.innerHTML == pageTitle) {
                const activeLI = anchor.parentElement;
                activeLI.classList.add("is-active");

                const sidebarNav = document.querySelector(".sidebar-nav");
                sidebarNav.scrollTop = getPrevSibling(activeLI, 3).offsetTop;

                throw new Error("No error. The title in the sidebar is the same as the page title.");
            }
        });
        throw new PageTitleError("Title in the sidebar is different from the page title.");
    } catch (e) {
        if (e instanceof PageTitleError) {
            console.error(e.message);
        }
    }
}

/**
 * @param {Element } element 
 * @param {number} offset 
 */
function getPrevSibling(element, offset) {
    let prevSibling;

    if (element.previousElementSibling) {
        prevSibling = element.previousElementSibling;
    } else {
        return element;
    }

    while (--offset) {
        if (!prevSibling.previousElementSibling) {
            break;
        } else {
            prevSibling = prevSibling.previousElementSibling;
        }
    }

    return prevSibling;
}

class PageTitleError extends Error {
    constructor(message) {
        super(message);
        this.name = "PageTitleError";
    }
}